import React from 'react';
import { Box, Drawer, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';

const messages = [
  {
    id: 1,
    author: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    message: 'Hello, how are you?',
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: 'https://via.placeholder.com/40',
    message: 'Can we meet tomorrow?',
  },
  // More messages...
];

const ChatSidebar = ({ open, handleClose }) => {
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
            <ListItem button key={message.id} sx={{ borderRadius: 1 }}>
              <ListItemAvatar>
                <Avatar src={message.avatar} />
              </ListItemAvatar>
              <ListItemText primary={message.author} secondary={message.message} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
