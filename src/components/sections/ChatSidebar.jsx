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
import { Close, Send, Group } from '@mui/icons-material'; // Usar íconos de Material UI
import axios from 'axios';

const ChatSidebar = ({ open, handleClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Cargar conversaciones recientes
  const loadConversations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversaciones/recent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error al cargar las conversaciones recientes:', error);
    }
  };

  // Cargar mensajes de una conversación específica
  const loadMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/mensajes/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data); // Mensajes ordenados por el backend
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  };

  // Enviar un nuevo mensaje
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        {
          conversacion_id: selectedConversationId,
          contenido: { texto: newMessage },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages((prevMessages) => [response.data, ...prevMessages]);
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  // Cargar conversaciones al abrir la barra lateral
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  // Cargar mensajes al seleccionar una conversación
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{selectedConversationId ? 'Chat' : 'Chats Recientes'}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {!selectedConversationId ? (
          <List>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.conversacion_id}
                button
                onClick={() => setSelectedConversationId(conversation.conversacion_id)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                }}
              >
                <ListItemAvatar>
                  {conversation.avatar ? (
                    <Avatar src={conversation.avatar} alt={conversation.nombre || 'Chat'} />
                  ) : (
                    <Avatar>
                      <Group />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.nombre || 'Chat sin nombre'}
                  secondary={
                    conversation.ultimoMensaje
                      ? `${conversation.ultimoMensaje.usuario?.nombre || 'Desconocido'}: ${
                          conversation.ultimoMensaje.contenido || 'Mensaje vacío'
                        }`
                      : 'Sin mensajes recientes'
                  }
                  secondaryTypographyProps={{
                    sx: { color: 'text.secondary', fontSize: 12 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box>
            <Button onClick={() => setSelectedConversationId(null)} sx={{ mb: 2 }}>
              Volver a Conversaciones
            </Button>
            <List>
              {messages.map((message) => (
                <ListItem key={message.mensaje_id}>
                  <ListItemAvatar>
                    <Avatar src={message.usuario?.avatar || 'https://via.placeholder.com/40'} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.usuario?.nombre || 'Desconocido'}
                    secondary={message.contenido.texto || ''}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton color="primary" onClick={sendMessage}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
