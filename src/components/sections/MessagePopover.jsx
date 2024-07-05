import React from 'react';
import { Popover, Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

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

const MessagePopover = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Messages</Typography>
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
    </Popover>
  );
};

export default MessagePopover;
