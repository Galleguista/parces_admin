import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const initialChats = [
  {
    id: 1,
    name: 'Caroline Lundu',
    avatar: 'https://via.placeholder.com/50',
    messages: [
      { id: 1, sender: 'Caroline Lundu', message: 'Hey! How are you doing?', time: '10:30 AM' },
      { id: 2, sender: 'Brian Hughes', message: 'I’m good, thanks! How about you?', time: '10:32 AM' },
      { id: 3, sender: 'Caroline Lundu', message: 'I’m great, working on a new project.', time: '10:35 AM' },
    ],
  },
  {
    id: 2,
    name: 'Mark Johnson',
    avatar: 'https://via.placeholder.com/50',
    messages: [
      { id: 1, sender: 'Mark Johnson', message: 'Hey, did you see my last email?', time: '9:00 AM' },
      { id: 2, sender: 'Brian Hughes', message: 'Yes, I’ll get back to you soon.', time: '9:05 AM' },
    ],
  },
];

const MessagesSection = () => {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(initialChats[0].id);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: Date.now(),
      sender: 'Brian Hughes',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChats = chats.map((chat) =>
      chat.id === selectedChatId
        ? { ...chat, messages: [...chat.messages, newMsg] }
        : chat
    );

    setChats(updatedChats);
    setNewMessage('');
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

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
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  selected={chat.id === selectedChatId}
                >
                  <ListItemAvatar>
                    <Avatar alt={chat.name} src={chat.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={chat.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedChat.name}</Typography>
            <Divider />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
              <List>
                {selectedChat.messages.map((message) => (
                  <ListItem key={message.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={message.sender} src={message.sender === 'Brian Hughes' ? 'https://via.placeholder.com/50' : selectedChat.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.sender}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {message.message}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="textSecondary">
                            {message.time}
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
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MessagesSection;
