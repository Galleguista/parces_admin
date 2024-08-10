import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, IconButton, Divider, TextField, Button } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import axios from 'axios';

const ChatSidebar = ({ open, handleClose, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (open && chatId) {
      fetchMessages(chatId);
    }
  }, [open, chatId]);

  const fetchMessages = async (chatId) => {
    try {
      console.log('Fetching messages for chat:', chatId);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/${chatId}/messages`,
        {
          contenido: newMessage,
          usuario_id: localStorage.getItem('usuario_id'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 300,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Chats</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {messages.map((message) => (
            <ListItem key={message.mensaje_id} sx={{ borderRadius: 1 }}>
              <ListItemAvatar>
                <Avatar src={message.usuario?.avatar ? `data:image/jpeg;base64,${message.usuario.avatar}` : 'https://via.placeholder.com/40'} />
              </ListItemAvatar>
              <ListItemText primary={message.usuario?.nombre} secondary={message.contenido} />
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
          <IconButton color="primary" onClick={handleSendMessage}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
