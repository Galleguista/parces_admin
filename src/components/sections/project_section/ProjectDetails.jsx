import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Avatar, Button, Alert, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, TextField,
} from '@mui/material';
import { Info, People } from '@mui/icons-material';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });
  const [errorAlert, setErrorAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [addMemberError, setAddMemberError] = useState(null);

  // Actualiza los datos al abrir el modal
  useEffect(() => {
    setEditedProject({ ...project });
  }, [project]);

  // Fetch de miembros y administrador del proyecto
  const fetchMiembros = async () => {
    try {
      const response = await instance.get(`/proyectos/${project.proyecto_id}/miembros`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAdmin(response.data.administrador);

      // Filtrar para evitar duplicados del administrador
      const filteredMiembros = response.data.miembros.filter(
        (member) => member.usuario_id !== response.data.administrador.usuario_id
      );
      setMiembros(filteredMiembros);
    } catch (error) {
      console.error('Error al obtener los miembros del proyecto:', error);
    }
  };

  useEffect(() => {
    if (project?.proyecto_id) {
      fetchMiembros();
    }
  }, [project]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveChanges = async () => {
    try {
      await onUpdateProject(editedProject);
      setIsEditing(false);
      setErrorAlert(false);
    } catch (error) {
      setErrorAlert(true);
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  // Lógica para añadir un miembro
  const handleAddMember = async () => {
    if (!newMemberId.trim()) {
      setAddMemberError('Por favor, ingresa un ID o correo válido.');
      return;
    }

    try {
      await instance.post(`/proyectos/${project.proyecto_id}/miembro`, 
        { usuario_id: newMemberId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchMiembros();
      setIsAddingMember(false);
      setNewMemberId('');
      setAddMemberError(null);
    } catch (error) {
      if (error.response?.status === 403) {
        setAddMemberError('No tienes permiso para agregar miembros a este proyecto.');
      } else if (error.response?.status === 409) {
        setAddMemberError('El usuario ya es miembro del proyecto.');
      } else {
        setAddMemberError('Ocurrió un error al intentar añadir al usuario.');
      }
      console.error('Error al añadir miembro:', error);
    }
  };

  return (
    <Dialog open={Boolean(project)} onClose={onClose} maxWidth="md" fullWidth>
      {errorAlert && (
        <Alert severity="error" onClose={() => setErrorAlert(false)} sx={{ mb: 2 }}>
          No tienes permiso para realizar esta acción.
        </Alert>
      )}

      <DialogTitle>
        {project.nombre}
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Información" icon={<Info />} />
          <Tab label="Miembros" icon={<People />} />
        </Tabs>

        {/* Información del Proyecto */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Descripción:</Typography>
            <Typography>{project.descripcion}</Typography>
          </Box>
        )}

        {/* Miembros del Proyecto */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Miembros del Proyecto</Typography>

            {/* Botón para añadir miembros (solo para el administrador) */}
            {admin?.usuario_id === localStorage.getItem('user_id') && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setIsAddingMember(true)}
              >
                Añadir Miembro
              </Button>
            )}

            <List>
              {/* Mostrar Administrador */}
              {admin && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={`data:image/jpeg;base64,${admin.avatar}`} alt={admin.nombre} />
                  </ListItemAvatar>
                  <ListItemText primary={`${admin.nombre} (Administrador)`} />
                </ListItem>
              )}
              {/* Mostrar Miembros sin incluir al Administrador */}
              {miembros.map((member) => (
                <ListItem key={member.usuario_id}>
                  <ListItemAvatar>
                    <Avatar src={`data:image/jpeg;base64,${member.avatar}`} alt={member.nombre} />
                  </ListItemAvatar>
                  <ListItemText primary={member.nombre} />
                </ListItem>
              ))}
            </List>

            {/* Modal para añadir miembro */}
            <Dialog open={isAddingMember} onClose={() => setIsAddingMember(false)}>
              <DialogTitle>Añadir Miembro</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  label="Correo o ID del Usuario"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                {addMemberError && (
                  <Alert severity="error" onClose={() => setAddMemberError(null)} sx={{ mb: 2 }}>
                    {addMemberError}
                  </Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={() => setIsAddingMember(false)} variant="outlined">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMember} variant="contained">
                    Añadir
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
