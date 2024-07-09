import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button, Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import MessagePopover from './MessagePopover';

const API_URL = `${import.meta.env.VITE_API_URL}/grupos`;

const GroupsSection = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false); // Definir estado para el diálogo de creación de grupo
  const [newGroup, setNewGroup] = useState({ nombre: '', descripcion: '', imagen_url: '' });
  const [miembros, setMiembros] = useState([]);
  const [nuevoMiembro, setNuevoMiembro] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleOpenMessages = async (event, group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
    try {
      const response = await axios.get(`${API_URL}/${group.grupo_id}/mensajes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  };

  const handleCloseMessages = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axios.post(
        `${API_URL}/${selectedGroup.grupo_id}/mensajes`,
        { contenido: newMessage },
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

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`${API_URL}/create`, newGroup, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const createdGroup = response.data;

      // Añadir miembros al grupo recién creado
      for (const miembro of miembros) {
        await axios.post(`${API_URL}/${createdGroup.grupo_id}/miembros`, { usuario_id: miembro }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setGroups([...groups, createdGroup]);
      setOpenCreateDialog(false);
      setNewGroup({ nombre: '', descripcion: '', imagen_url: '' });
      setMiembros([]);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleAddMiembro = () => {
    if (nuevoMiembro.trim() !== '') {
      setMiembros([...miembros, nuevoMiembro]);
      setNuevoMiembro('');
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpenCreateDialog(true)}>
        Crear Grupo
      </Button>
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
                <IconButton
                  aria-label="messages"
                  onClick={(event) => handleOpenMessages(event, group)}
                >
                  <GroupIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGroup && (
        <MessagePopover
          anchorEl={anchorEl}
          handleClose={handleCloseMessages}
          messages={messages}
          handleSendMessage={handleSendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
        />
      )}

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Grupo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Nombre del Grupo"
            value={newGroup.nombre}
            onChange={(e) => setNewGroup({ ...newGroup, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Descripción"
            value={newGroup.descripcion}
            onChange={(e) => setNewGroup({ ...newGroup, descripcion: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="URL de la Imagen"
            value={newGroup.imagen_url}
            onChange={(e) => setNewGroup({ ...newGroup, imagen_url: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Añadir Miembro"
            value={nuevoMiembro}
            onChange={(e) => setNuevoMiembro(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleAddMiembro}>
                  <AddIcon />
                </IconButton>
              ),
            }}
          />
          <List>
            {miembros.map((miembro, index) => (
              <ListItem key={index}>
                <ListItemText primary={miembro} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleCreateGroup}>
            Crear Grupo
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GroupsSection;
