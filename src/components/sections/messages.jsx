import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/chats`;

const ChatsSection = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await axios.get(`${API_URL}/${chat.chat_id}/mensajes`, {
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
    if (newMessage.trim() === '' && !newImage) return;

    try {
      const formData = new FormData();
      formData.append('contenido', newMessage);
      if (newImage) {
        formData.append('imagen_url', newImage);
      }

      const response = await axios.post(`${API_URL}/${selectedChat.chat_id}/mensajes`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      setNewImage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Chats</Typography>
            <Divider />
            <List>
              {chats.map((chat) => (
                <ListItem
                  button
                  key={chat.chat_id}
                  onClick={() => handleSelectChat(chat)}
                  selected={selectedChat && selectedChat.chat_id === chat.chat_id}
                >
                  <ListItemAvatar>
                    <Avatar alt={chat.amigo.nombre} src={chat.amigo.avatar ? `data:image/jpeg;base64,${chat.amigo.avatar}` : 'https://via.placeholder.com/50'} />
                  </ListItemAvatar>
                  <ListItemText primary={chat.amigo.nombre} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        {selectedChat && (
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedChat.amigo.nombre}</Typography>
              <Divider />
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <List>
                  {messages.map((message) => (
                    <ListItem key={message.mensaje_id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={message.usuario.nombre} src={message.usuario.avatar ? `data:image/jpeg;base64,${message.usuario.avatar}` : 'https://via.placeholder.com/50'} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.usuario.nombre}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              {message.contenido}
                            </Typography>
                            {message.imagen_url && (
                              <Box component="img" src={message.imagen_url} sx={{ maxWidth: '100%', mt: 1 }} />
                            )}
                            <br />
                            <Typography component="span" variant="caption" color="textSecondary">
                              {new Date(message.fecha_envio).toLocaleTimeString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <IconButton color="primary" component="span">
                    <SendIcon />
                  </IconButton>
                </label>
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatsSection;
