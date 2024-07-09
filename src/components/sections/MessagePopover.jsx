import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import axios from 'axios';

const MessagePopover = ({ open, onClose }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  useEffect(() => {
    if (open) {
      fetchChats();
    }
  }, [open]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/mensajes/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSelectedChat({ chatId, messages: response.data });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/${selectedChat.chatId}/mensajes`,
        { contenido: newMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, response.data],
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/grupos/create`,
        {
          nombre: newGroupName,
          descripcion: newGroupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOpenCreateDialog(false);
      fetchChats();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chats
        </Typography>
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ mb: 2 }}
        >
          Create Group
        </Button>
        <List>
          {chats.map((chat) => (
            <ListItem
              button
              key={chat.chat_id}
              onClick={() => fetchMessages(chat.chat_id)}
              selected={selectedChat?.chatId === chat.chat_id}
            >
              <ListItemAvatar>
                <Avatar src={chat.amigoUsuario?.avatar ? `data:image/jpeg;base64,${chat.amigoUsuario.avatar}` : 'https://via.placeholder.com/40'} />
              </ListItemAvatar>
              <ListItemText primary={chat.amigoUsuario?.nombre} />
            </ListItem>
          ))}
        </List>
        {selectedChat && (
          <>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6">
                Chat with {selectedChat.amigoUsuario?.nombre}
              </Typography>
              <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedChat.messages.map((message) => (
                  <ListItem key={message.chat_id}>
                    <ListItemAvatar>
                      <Avatar src={message.usuario?.avatar ? `data:image/jpeg;base64,${message.usuario.avatar}` : 'https://via.placeholder.com/40'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.contenido}
                      secondary={new Date(message.fecha_envio).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
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
          </>
        )}

        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the name and description of the new group.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              fullWidth
              variant="outlined"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Group Description"
              fullWidth
              variant="outlined"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Drawer>
  );
};

export default MessagePopover;
//diosmio por favor salvame