import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, IconButton, Divider, TextField, Button } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import useChat from './useChat'; 

const ChatSidebar = ({ open, handleClose, chatId }) => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage } = useChat(chatId); 

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    sendMessage(newMessage);
    setNewMessage('');
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
              <ListItemText primary={message.usuario?.nombre} secondary={message.contenido} /> {/* Usa el nombre del remitente */}
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
