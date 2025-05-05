import React, { useState, useEffect, useRef } from 'react';
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
import { io } from 'socket.io-client';
import useChat from './useChat';

const ChatSidebar = ({ open, handleClose, selectedConversationId: externalConversationId }) => {
  const theme = useTheme();
  const [selectedConversationId, setSelectedConversationId] = useState(externalConversationId || null);
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef(null);

  const {
    messages,
    isConversationEmpty,
    newMessage,
    setNewMessage,
    sendMessage,
  } = useChat(selectedConversationId);

  useEffect(() => {
    if (!open) return;
  
    const token = localStorage.getItem('token');
  
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      auth: { token },
    });
  
    socketRef.current = socket;
  
    socket.on('connect', () => {
      console.log('[ChatSidebar] Socket conectado:', socket.id);
      socket.emit('get_conversations');
    });
  
    socket.on('conversation_list', (data) => {
      console.log('[ChatSidebar] Conversaciones recibidas:', data);
      const enrichedConversations = data.map((conv) => ({
        ...conv,
        avatar: <Group />,
      }));
  
      setConversations(enrichedConversations);
  
      if (enrichedConversations.length > 0) {
        console.log('[ChatSidebar] Auto-uniéndose a la primera conversación:', enrichedConversations[0].conversacion_id);
        setSelectedConversationId(enrichedConversations[0].conversacion_id);
        socket.emit('join_conversation', { conversacion_id: enrichedConversations[0].conversacion_id });
      }
    });
  
    socket.on('disconnect', (reason) => {
      console.log('[ChatSidebar] Socket desconectado:', reason);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [open]);
  

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);

    if (socketRef.current) {
      socketRef.current.emit('join_conversation', { conversacion_id: conversationId });
    }
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

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
            <Typography variant="h6" sx={{ mb: 2 }}>Chats Recientes</Typography>
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
                    primary={conversation.nombre || 'Conversación'}
                    secondary={conversation.ultimoMensaje?.contenido || 'Sin mensajes recientes'}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Button onClick={handleBackToConversations}>Volver a Conversaciones</Button>
            {/* Aquí sigues mostrando los mensajes como ya tienes armado */}
            {/* ... */}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
