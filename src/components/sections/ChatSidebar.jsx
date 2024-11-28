import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { Send, Group, Work, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const ChatSidebar = ({ open, handleClose, selectedConversationId: externalConversationId }) => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(externalConversationId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversaciones/recent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const enrichedConversations = response.data.map((conversation) => {
        let avatar = null;

        switch (conversation.tipo) {
          case 'grupo':
            avatar = <Group />;
            break;
          case 'proyecto':
            avatar = <Work />;
            break;
          default:
            avatar = <Person />;
        }

        return {
          ...conversation,
          avatar,
        };
      });

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error al cargar las conversaciones:', error);
    }
  };
  const [isConversationEmpty, setIsConversationEmpty] = useState(false);

  const loadMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/mensajes/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.length === 0) {
        setIsConversationEmpty(true);
      } else {
        setIsConversationEmpty(false);
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
      setIsConversationEmpty(false); // Manejo por si ocurre algún error
    }
  };
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const payload = {
      conversacion_id: selectedConversationId,
      contenido: { texto: newMessage },
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/mensajes`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNewMessage('');
      await loadMessages(selectedConversationId);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const handleConversationSelect = async (conversationId) => {
    setSelectedConversationId(conversationId);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    await loadMessages(conversationId);

    const id = setInterval(() => {
      loadMessages(conversationId);
    }, 2000);
    setIntervalId(id);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  useEffect(() => {
    if (externalConversationId) {
      handleConversationSelect(externalConversationId);
    }
  }, [externalConversationId]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 300,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {!selectedConversationId ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Chats Recientes
            </Typography>
            <Divider />
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.conversacion_id}
                  button
                  onClick={() => handleConversationSelect(conversation.conversacion_id)}
                >
                  <ListItemAvatar>
                    <Avatar>{conversation.avatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.nombre}
                    secondary={conversation.ultimoMensaje?.contenido || 'Sin mensajes recientes'}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Button onClick={handleBackToConversations}>Volver a Conversaciones</Button>
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
  {isConversationEmpty ? (
    <Box
      sx={{
        alignSelf: 'center',
        maxWidth: '80%',
        backgroundColor: theme.palette.grey[200],
        color: '#000',
        padding: '10px',
        borderRadius: '15px',
        boxShadow: 1,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">Esta conversación no tiene mensajes aún.</Typography>
    </Box>
  ) : (
    messages.map((message) => {
      const isOwnMessage = message.usuario_id === localStorage.getItem('user_id');
      return (
        <Box
          key={message.mensaje_id}
          sx={{
            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            backgroundColor: isOwnMessage
              ? theme.palette.primary.main
              : theme.palette.grey[200],
            color: isOwnMessage ? '#fff' : '#000',
            padding: '10px',
            borderRadius: '15px',
            boxShadow: 1,
            wordWrap: 'break-word',
          }}
        >
          {!isOwnMessage && (
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {message.nombre_usuario || 'Desconocido'}
            </Typography>
          )}
          <Typography variant="body2">{message.contenido?.texto}</Typography>
        </Box>
      );
    })
  )}
</List>

            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton onClick={sendMessage}>
                <Send />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
