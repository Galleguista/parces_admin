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
import axios from 'axios';

const ChatSidebar = ({ open, handleClose }) => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Obtener datos de usuario o grupo asociados a las conversaciones
  const enrichConversations = async (conversations) => {
    const userIds = Array.from(
      new Set(conversations.map((c) => c.usuario_id).filter((id) => id))
    );

    if (userIds.length === 0) return conversations;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        params: { userIds: userIds.join(',') },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const usersById = response.data.reduce((acc, user) => {
        acc[user.usuario_id] = user;
        return acc;
      }, {});

      setUsers(usersById);

      return conversations.map((conversation) => {
        const user = usersById[conversation.usuario_id];
        return {
          ...conversation,
          nombre: user?.nombre || 'Conversación sin nombre',
          avatar: user?.avatar || null,
        };
      });
    } catch (error) {
      console.error('Error al cargar usuarios asociados a conversaciones:', error);
      return conversations;
    }
  };

  // Cargar conversaciones recientes
  const loadConversations = async () => {
    try {
      console.log('Cargando conversaciones...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversaciones/recent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const enrichedConversations = await enrichConversations(response.data);
      setConversations(enrichedConversations);
      console.log('Conversaciones cargadas:', enrichedConversations);
    } catch (error) {
      console.error('Error al cargar las conversaciones:', error);
    }
  };

  // Cargar mensajes de una conversación
  const loadMessages = async (conversationId) => {
    try {
      console.log(`Cargando mensajes para la conversación: ${conversationId}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mensajes/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages(response.data);
      console.log('Mensajes cargados:', response.data);
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const payload = {
      conversacion_id: selectedConversationId,
      contenido: { texto: newMessage },
    };

    try {
      console.log('Enviando mensaje:', payload);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Mensaje enviado:', response.data);
      setNewMessage('');
      await loadMessages(selectedConversationId); // Actualiza los mensajes
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  // Actualización automática de mensajes
  useEffect(() => {
    let interval;
    if (selectedConversationId) {
      interval = setInterval(() => {
        loadMessages(selectedConversationId);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedConversationId]);

  // Cargar conversaciones cuando se abra el ChatSidebar
  useEffect(() => {
    if (open) {
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
            <Typography variant="h6">Chats Recientes</Typography>
            <Divider />
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.conversacion_id}
                  button
                  onClick={() => setSelectedConversationId(conversation.conversacion_id)}
                >
                  <ListItemAvatar>
                    {conversation.avatar ? (
                      <Avatar src={conversation.avatar} />
                    ) : (
                      <Avatar>
                        <Group />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.nombre || 'Chat sin nombre'}
                    secondary={conversation.ultimoMensaje?.contenido || 'Sin mensajes recientes'}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Button onClick={() => setSelectedConversationId(null)}>Volver a Conversaciones</Button>
            <List>
              {messages.map((message) => {
                const user = users[message.usuario_id] || {};
                return (
                  <ListItem key={message.mensaje_id}>
                    <ListItemAvatar>
                      <Avatar src={user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.nombre || 'Desconocido'}
                      secondary={message.contenido?.texto}
                    />
                  </ListItem>
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
