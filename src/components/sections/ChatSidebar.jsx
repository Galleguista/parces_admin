import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  Avatar,
  Typography,
  Divider,
  Box,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';

const ChatSidebar = ({ open, handleClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      query: { usuario_id: 'user-id-from-token' },
    });

    newSocket.on('newMessage', (message) => {
      if (message.conversacion_id === selectedConversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedConversationId]);

  const loadConversations = async () => {
    try {
      console.log('Cargando conversaciones...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/conversaciones/recent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setConversations(response.data);
      console.log('Conversaciones cargadas:', response.data);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      console.log(`Cargando mensajes para la conversación: ${conversationId}`);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/mensajes/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
      console.log('Mensajes cargados:', response.data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      conversacion_id: selectedConversationId,
      contenido: { texto: newMessage },
    };

    try {
      console.log('Enviando mensaje:', payload);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/mensajes`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Mensaje enviado:', response.data);
      setMessages((prev) => [...prev, response.data]); // Añade el mensaje al estado local
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  useEffect(() => {
    if (open) loadConversations();
  }, [open]);

  useEffect(() => {
    if (selectedConversationId) loadMessages(selectedConversationId);
  }, [selectedConversationId]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 400,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {!selectedConversationId ? (
          <>
            <Typography variant="h6">Chats Recientes</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.conversacion_id}
                  button
                  onClick={() => setSelectedConversationId(conversation.conversacion_id)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  <Avatar src={conversation.avatar || ''} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {conversation.nombre || 'Sin nombre'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {conversation.ultimoMensaje?.contenido?.texto || 'Sin mensajes recientes'}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => setSelectedConversationId(null)}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Conversación
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                mb: 2,
              }}
            >
              <List>
                {messages.map((message) => (
                  <ListItem
                    key={message.mensaje_id}
                    sx={{
                      display: 'flex',
                      justifyContent:
                        message.usuario_id === 'user-id-from-token' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 1,
                        borderRadius: 2,
                        backgroundColor:
                          message.usuario_id === 'user-id-from-token' ? '#007bff' : '#f0f0f0',
                        color:
                          message.usuario_id === 'user-id-from-token' ? 'white' : 'black',
                      }}
                    >
                      <Typography variant="body2">{message.contenido.texto}</Typography>
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {new Date(message.fecha_envio).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton onClick={sendMessage} color="primary" sx={{ ml: 1 }}>
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
