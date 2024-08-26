import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Box, AppBar, Tabs, Tab, Divider, TextField, IconButton, Fab, DialogActions, Drawer, Checkbox, FormControlLabel
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const GroupsSection = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchUsuarios();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await instance.get('/grupos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await instance.get('/usuarios', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleOpenGroup = (group) => {
    setSelectedGroup({
      ...group,
      miembros: group.miembros || [],
    });
  };

  const handleCloseGroup = () => {
    setSelectedGroup(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleJoinGroupChat = async (groupId) => {
    try {
      const response = await instance.post(
        `/grupos/${groupId}/miembro`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setChatId(groupId);
      setIsChatOpen(true);
      handleCloseGroup();
    } catch (error) {
      console.error('Error joining group chat:', error);
    }
  };
  

  const handleCreateGroup = async () => {
    try {
      const response = await instance.post('/grupos', {
        nombre: newGroupName,
        descripcion: newGroupDescription,
        usuariosIds: selectedUsuarios,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups([...groups, response.data]);
      setIsCreateDialogOpen(false);
      setNewGroupName('');
      setNewGroupDescription('');
      setSelectedUsuarios([]);
    } catch (error) {
      console.error('Error creating group:', error);
      console.error('Response data:', error.response?.data || 'No response data');
    }
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await instance.get(`/chat/${chatId}/messages`, {
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
          usuarioId: localStorage.getItem('usuario_id'), // Asegúrate de que el campo sea 'usuarioId'
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
  
  const handleAddMember = async () => {
    if (newMemberId.trim()) {
      try {
        await instance.post(`/grupo/${selectedGroup.grupo_id}/miembro`, {
          usuarioId: newMemberId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchGroups();
        setNewMemberId('');
      } catch (error) {
        console.error('Error adding member:', error);
      }
    }
  };
  

  const handleStartPrivateChat = async (receptorId) => {
    try {
      const response = await instance.post('/chat/private', { receptorId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChatId(response.data.chat_id);
      setIsChatOpen(true);
      fetchMessages(response.data.chat_id);
    } catch (error) {
      console.error('Error starting private chat:', error);
    }
  };

  const handleSelectUsuario = (usuarioId) => {
    setSelectedUsuarios(prevSelected =>
      prevSelected.includes(usuarioId)
        ? prevSelected.filter(id => id !== usuarioId)
        : [...prevSelected, usuarioId]
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.grupo_id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
              <Box display="flex" alignItems="center" p={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{group.nombre}</Typography>
                  <Typography variant="body2" color="textSecondary">{group.descripcion}</Typography>
                </Box>
              </Box>
              <CardContent>
                <Button variant="contained" color="primary" onClick={() => handleOpenGroup(group)}>
                  Ver Grupo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGroup && (
        <Dialog
          open={Boolean(selectedGroup)}
          onClose={handleCloseGroup}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{selectedGroup.nombre}</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={selectedGroup.image}
                alt={selectedGroup.nombre}
                sx={{ width: 150, height: 150, margin: 'auto', borderRadius: '50%' }}
              />
            </Box>
            <AppBar position="static" color="default" sx={{ borderRadius: '8px', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                <Tab label="Información" />
                <Tab label="Miembros" />
                <Tab label="Chat Grupal" />
              </Tabs>
            </AppBar>
            {tabValue === 0 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {selectedGroup.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Fecha de creación:</strong> {new Date(selectedGroup.fecha_creacion).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Ubicación:</strong> Bogotá, Colombia
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Número de miembros:</strong> {selectedGroup.miembros.length}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="ID del nuevo miembro"
                    fullWidth
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                  />
                  <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleAddMember}>
                    Añadir Miembro
                  </Button>
                </Box>
              </Box>
            )}
            {tabValue === 1 && (
              <List>
                {selectedGroup.miembros.map((member) => (
                  <ListItem key={member.usuario_id} onClick={() => setSelectedUserId(member.usuario_id)}>
                    <ListItemAvatar>
                      <Avatar alt={member.nombre} src={`data:image/jpeg;base64,${member.avatar}`} />
                    </ListItemAvatar>
                    <ListItemText primary={member.nombre} />
                    <Button variant="contained" color="secondary" onClick={() => handleStartPrivateChat(member.usuario_id)}>
                      Chatear
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
            {tabValue === 2 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => handleJoinGroupChat(selectedGroup.grupo_id)}>
                  Unirte al chat grupal
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}

      <Drawer anchor="right" open={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <Box sx={{ width: 400, p: 2 }}>
          <IconButton onClick={() => setIsChatOpen(false)}>
            <CloseIcon />
          </IconButton>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 200px)' }}>
            {messages.map((message) => (
              <Box key={message.mensaje_id} sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {message.usuario.nombre}:
                </Typography>
                <Typography variant="body1">
                  {message.contenido}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenCreateDialog}
      >
        <AddIcon />
      </Fab>

      <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Crear Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Grupo"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">Selecciona los miembros:</Typography>
          <List>
            {usuarios.map((usuario) => (
              <ListItem key={usuario.usuario_id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedUsuarios.includes(usuario.usuario_id)}
                      onChange={() => handleSelectUsuario(usuario.usuario_id)}
                    />
                  }
                  label={usuario.nombre}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
          <Button onClick={handleCreateGroup} color="primary">Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupsSection;
