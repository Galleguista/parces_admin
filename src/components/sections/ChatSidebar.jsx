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
import { Send, Group, Work } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const ChatSidebar = ({ open, handleClose }) => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const [tipoConversaciones, setTipoConversaciones] = useState({});
  const [proyectos, setProyectos] = useState({});
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

  
  const fetchProyectos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const proyectoMap = response.data.reduce((acc, proyecto) => {
        acc[proyecto.conversacion_id] = proyecto.nombre;
        return acc;
      }, {});
      setProyectos(proyectoMap);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
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
  
      const userIdsToFetch = [];
      const enrichedConversations = conversationData.map((conversation) => {
        const tipo = tipoConversaciones[conversation.tipo_conversacion_id] || 'Desconocido';
  
        let nombre = conversation.nombre || 'Desconocido';
        let avatar = null;
  
        if (tipo === 'privado') {
          // Filtrar los user_ids para encontrar el otro usuario
          const otherUserId = conversation.user_ids.find(
            (id) => id !== localStorage.getItem('user_id')
          );
          if (otherUserId) {
            userIdsToFetch.push(otherUserId);
            conversation.otherUserId = otherUserId; // Guardamos para usar después
          }
        } else if (tipo === 'grupo') {
          nombre = conversation.nombre || 'Grupo sin nombre';
        } else if (tipo === 'proyecto') {
          nombre = proyectos[conversation.conversacion_id] || 'Proyecto sin nombre';
        }
  
        return { ...conversation, nombre, avatar, tipo };
      });
  
      // Obtener datos de los usuarios con los IDs recopilados
      if (userIdsToFetch.length > 0) {
        const userMap = await fetchUsers(userIdsToFetch);
  
        enrichedConversations.forEach((conversation) => {
          if (conversation.tipo === 'privado' && conversation.otherUserId) {
            const user = userMap[conversation.otherUserId];
            if (user) {
              conversation.nombre = user.nombre || 'Usuario desconocido';
              conversation.avatar = user.avatar || null;
            }
          }
        });
      }
  
      setConversations(enrichedConversations);
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
      fetchProyectos();
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
                    ) : conversation.tipo === 'proyecto' ? (
                      <Avatar sx={{ backgroundColor: theme.palette.primary.dark }}>
                        <Work />
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
