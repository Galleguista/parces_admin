import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Box, AppBar, Tabs, Tab, Divider, TextField, IconButton, Fab, DialogActions, Drawer, Checkbox, FormControlLabel, Snackbar, Alert, Chip
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
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [privateChatId, setPrivateChatId] = useState(null); // ID del chat privado si está en uso

  const TIPO_CONVERSACION_GRUPO = "ef290e87-68e1-4125-b83e-2908adc0027c";

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

  const handleOpenGroup = async (group) => {
    try {
      const response = await instance.get(`/grupos/${group.grupo_id}/miembros`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSelectedGroup({
        ...group,
        miembros: response.data,
      });
      setChatId(group.conversacion_id); // Establece el chatId del grupo
      setPrivateChatId(null); // Resetear privateChatId para el chat de grupo
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const handleCloseGroup = () => {
    setSelectedGroup(null);
    setTabValue(0);
    setIsChatOpen(false); // Cierra el chat cuando se cierra el grupo
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectUsuario = (usuarioId) => {
    setSelectedUsuarios((prevSelected) =>
      prevSelected.includes(usuarioId)
        ? prevSelected.filter((id) => id !== usuarioId)
        : [...prevSelected, usuarioId]
    );
  };

  const handleJoinGroupChat = async () => {
    try {
      const response = await instance.get(`/conversaciones/${chatId}/verify-membership`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.isMember) {
        setIsChatOpen(true);
        setSelectedGroup(null); // Cierra la ventana de información del grupo
        fetchMessages(chatId);
      } else {
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error verifying membership:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await instance.post('/grupos', {
        nombre: newGroupName,
        descripcion: newGroupDescription,
        userIds: selectedUsuarios.map(id => ({ id })),
        tipo_conversacion_id: TIPO_CONVERSACION_GRUPO,
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
    }
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const fetchMessages = async (conversacionId) => {
    try {
      const response = await instance.get(`/mensajes/${conversacionId}`, {
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
      const targetChatId = privateChatId || chatId; // Usar privateChatId si existe, sino usar chatId del grupo

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        {
          conversacion_id: targetChatId,
          contenido: { texto: newMessage },
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

  const handleStartPrivateChat = async (memberId) => {
    try {
      console.log("Iniciando chat privado con memberId:", memberId);
      const response = await instance.post('/conversaciones/private-chat', { memberId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("Respuesta del servidor para la conversación privada:", response.data);
      setPrivateChatId(response.data.conversacion_id); // Guardar el ID de la conversación privada
      setChatId(response.data.conversacion_id); // Actualizar chatId a la conversación privada
      setIsChatOpen(true);
      fetchMessages(response.data.conversacion_id); // Cargar mensajes de la conversación privada
    } catch (error) {
      console.error('Error al iniciar chat privado:', error);
    }
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

      <Dialog open={Boolean(selectedGroup)} onClose={handleCloseGroup} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h5">{selectedGroup?.nombre}</Typography>
        </DialogTitle>
        <DialogContent>
          <AppBar position="static" color="default" sx={{ borderRadius: '8px', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
              <Tab label="Información" />
              <Tab label="Miembros" />
              <Tab label="Chat Grupal" />
            </Tabs>
          </AppBar>
          {tabValue === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>{selectedGroup?.descripcion}</Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Fecha de creación:</strong> {new Date(selectedGroup?.fecha_creacion).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          {tabValue === 1 && (
            <>
              <Typography variant="subtitle2">Miembros:</Typography>
              <List>
                {selectedGroup?.miembros?.map((member) => (
                  <ListItem key={member.usuario_id}>
                    <ListItemAvatar>
                      <Avatar alt={member.nombre} src={`data:image/jpeg;base64,${member.avatar}`} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={member.nombre} 
                      secondary={member.es_admin ? <Chip label="Administrador" color="primary" size="small" /> : null} 
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleStartPrivateChat(member.usuario_id)}
                    >
                      Chatear
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          )}
          {tabValue === 2 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleJoinGroupChat}>
                Unirte al chat grupal
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

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
                  {message.usuario ? message.usuario.nombre : 'Usuario desconocido'}:
                </Typography>
                <Typography variant="body1">
                  {message.contenido.texto}
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

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          Debes hablar con el administrador del grupo para ingresar a este chat.
        </Alert>
      </Snackbar>
    </>
  );
};

export default GroupsSection;
