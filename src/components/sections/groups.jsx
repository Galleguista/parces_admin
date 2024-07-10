import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Box, AppBar, Tabs, Tab, Divider, TextField, IconButton, Fab, DialogActions
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';

const GroupsSection = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  // Fetch groups from the backend
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/grupos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleOpenGroup = (group) => {
    setSelectedGroup(group);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/grupos/${groupId}/miembros`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChatId(groupId);
      setIsChatOpen(true);
      handleCloseGroup();
    } catch (error) {
      console.error('Error joining group chat:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/grupos/create`, {
        nombre: newGroupName,
        descripcion: newGroupDescription,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups([...groups, response.data]);
      setIsCreateDialogOpen(false);
      setNewGroupName('');
      setNewGroupDescription('');
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
          PaperProps={{ sx: { borderRadius: '16px' } }} // Añadido borderRadius aquí
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{selectedGroup.nombre}</Typography>
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
              </Box>
            )}
            {tabValue === 1 && (
              <List>
                {selectedGroup.miembros.map((member) => (
                  <ListItem key={member.usuario_id}>
                    <ListItemAvatar>
                      <Avatar alt={member.nombre} src={`data:image/jpeg;base64,${member.avatar}`} />
                    </ListItemAvatar>
                    <ListItemText primary={member.nombre} />
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

      <ChatSidebar open={isChatOpen} handleClose={() => setIsChatOpen(false)} chatId={chatId} />

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
