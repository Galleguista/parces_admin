import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, Typography, Button, Drawer, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, IconButton, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Fab
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', // Asegúrate de que esta URL apunte a tu API
});

const ForumSection = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newForum, setNewForum] = useState({ nombre: '', descripcion: '' });
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await instance.get('/foros', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setForums(response.data);
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const fetchForumById = async (forumId) => {
    try {
      const response = await instance.get(`/foros/${forumId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forum by ID:', error);
      return null;
    }
  };

  const handleOpenForum = async (forum) => {
    const fullForum = await fetchForumById(forum.foro_id);
    setSelectedForum(fullForum);
    
    // Lógica para obtener o crear un chat para este foro
    try {
      const chatResponse = await instance.post('/chats', {
        foro_id: forum.foro_id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCurrentChatId(chatResponse.data.chat_id);
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    }
  };

  const handleCloseForum = () => {
    setSelectedForum(null);
    setCurrentChatId(null);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await instance.post(`/chats/${currentChatId}/messages`, {
        contenido: newMessage,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Recargar los mensajes del chat
      const updatedForum = await fetchForumById(selectedForum.foro_id);
      setSelectedForum(updatedForum);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewForum({ nombre: '', descripcion: '' });
  };

  const handleCreateForum = async () => {
    if (newForum.nombre.trim() === '' || newForum.descripcion.trim() === '') return;

    try {
      const response = await instance.post('/foros/create', newForum, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setForums([...forums, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const handleForumInputChange = (event) => {
    const { name, value } = event.target;
    setNewForum({ ...newForum, [name]: value });
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Foros</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Temas de Interés</Typography>
              <Grid container spacing={2}>
                {forums.map((forum) => (
                  <Grid item xs={12} sm={6} md={4} key={forum.foro_id}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      startIcon={<ForumIcon />}
                      onClick={() => handleOpenForum(forum)}
                    >
                      {forum.nombre}
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedForum.nombre}</Typography>
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
                            {message.contenido}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="textSecondary">
                            {new Date(message.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                placeholder="Escribe un mensaje..."
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

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleOpenDialog}>
        <AddIcon />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Crear Nuevo Foro</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Foro"
            type="text"
            fullWidth
            name="nombre"
            value={newForum.nombre}
            onChange={handleForumInputChange}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            name="descripcion"
            value={newForum.descripcion}
            onChange={handleForumInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateForum} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForumSection;
