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
import { Send, Group } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const ChatSidebar = ({ open, handleClose }) => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const [tipoConversaciones, setTipoConversaciones] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const baseUrl = import.meta.env.VITE_PUBLIC_URL;

  const constructAvatarUrl = (avatarPath) => {
    return avatarPath ? `${baseUrl}${avatarPath}` : null;
  };

  const fetchTiposConversacion = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tipo-conversacion`);
      const tipoMap = response.data.reduce((acc, tipo) => {
        acc[tipo.tipo_conversacion_id] = tipo.nombre;
        return acc;
      }, {});
      setTipoConversaciones(tipoMap);
    } catch (error) {
      console.error('Error al cargar tipos de conversación:', error);
    }
  };

  const fetchUsers = async (userIds) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        params: { userIds: userIds.join(',') },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data.reduce((acc, user) => {
        acc[user.usuario_id] = {
          ...user,
          avatar: constructAvatarUrl(user.avatar),
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      return {};
    }
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/conversaciones/recent`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const conversationData = response.data;
      const userIds = Array.from(
        new Set(conversationData.map((conv) => conv.usuario_id).filter((id) => id))
      );

      const userMap = await fetchUsers(userIds);

      const enrichedConversations = conversationData.map((conversation) => {
        const user = userMap[conversation.usuario_id] || {};
        const tipo = tipoConversaciones[conversation.tipo_conversacion_id] || 'Desconocido';
        return {
          ...conversation,
          nombre:
            tipo === 'privado'
              ? user.nombre || 'Usuario desconocido'
              : conversation.nombre || 'Grupo sin nombre',
          avatar: tipo === 'privado' ? user.avatar : null,
          tipo,
        };
      });

      setConversations(enrichedConversations);
      setUsers(userMap);
    } catch (error) {
      console.error('Error al cargar las conversaciones:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mensajes/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const payload = {
      conversacion_id: selectedConversationId,
      contenido: { texto: newMessage },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
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
      fetchTiposConversacion();
      loadConversations();
    }
  }, [open]);

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
                    {conversation.tipo === 'grupo' ? (
                      <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                        <Group />
                      </Avatar>
                    ) : conversation.avatar ? (
                      <Avatar src={conversation.avatar} />
                    ) : (
                      <Avatar />
                    )}
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
              {messages.map((message) => {
                const isOwnMessage = message.usuario_id === localStorage.getItem('user_id');
                const user = users[message.usuario_id] || {};
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
                        {user.nombre || 'Desconocido'}
                      </Typography>
                    )}
                    <Typography variant="body2">{message.contenido?.texto}</Typography>
                  </Box>
                );
              })}
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
