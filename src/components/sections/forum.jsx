import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Drawer, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, IconButton, Box, Divider
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';

const initialForums = [
  {
    id: 1,
    title: 'Organic Farming Techniques',
    description: 'Discuss the best techniques for organic farming.',
    messages: [
      { id: 1, sender: 'Alice Smith', message: 'What are the best practices for pest control?', time: '10:30 AM' },
      { id: 2, sender: 'Bob Johnson', message: 'I use neem oil and it works great.', time: '10:32 AM' },
    ],
  },
  {
    id: 2,
    title: 'Urban Gardening',
    description: 'Share your tips and tricks for urban gardening.',
    messages: [
      { id: 1, sender: 'Carol Williams', message: 'What plants are best for small spaces?', time: '9:00 AM' },
      { id: 2, sender: 'David Brown', message: 'I recommend succulents and herbs.', time: '9:05 AM' },
    ],
  },
  {
    id: 3,
    title: 'Sustainable Agriculture',
    description: 'Discuss sustainable agricultural practices.',
    messages: [
      { id: 1, sender: 'Eve Davis', message: 'How can we reduce water usage in farming?', time: '11:00 AM' },
      { id: 2, sender: 'Frank Miller', message: 'Drip irrigation is a great way to save water.', time: '11:05 AM' },
    ],
  },
];

const ForumSection = () => {
  const [forums] = useState(initialForums);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleOpenForum = (forum) => {
    setSelectedForum(forum);
  };

  const handleCloseForum = () => {
    setSelectedForum(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: Date.now(),
      sender: 'Brian Hughes',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedForums = forums.map((forum) =>
      forum.id === selectedForum.id
        ? { ...forum, messages: [...forum.messages, newMsg] }
        : forum
    );

    setSelectedForum(updatedForums.find(forum => forum.id === selectedForum.id));
    setNewMessage('');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Forums</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Topics of Interest</Typography>
              <Grid container spacing={2}>
                {forums.map((forum) => (
                  <Grid item xs={12} sm={6} md={4} key={forum.id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      startIcon={<ForumIcon />}
                      onClick={() => handleOpenForum(forum)}
                    >
                      {forum.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedForum)} onClose={handleCloseForum} sx={{ '& .MuiDrawer-paper': { width: '400px' } }}>
        {selectedForum && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedForum.title}</Typography>
            <Divider />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', my: 2 }}>
              <List>
                {selectedForum.messages.map((message) => (
                  <ListItem key={message.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={message.sender} src="https://via.placeholder.com/50" />
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
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
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
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default ForumSection;
