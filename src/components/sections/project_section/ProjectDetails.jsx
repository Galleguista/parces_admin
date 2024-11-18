import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Grid, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Button, TextField, Alert, Tabs, Tab
} from '@mui/material';
import { People, Info } from '@mui/icons-material';
import axios from 'axios';

// Configuración de Axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [tabValue, setTabValue] = useState(0); // Controla la pestaña activa
  const [miembros, setMiembros] = useState([]); // Miembros del proyecto
  const [isAddingMember, setIsAddingMember] = useState(false); // Controla el modal de añadir miembros
  const [newMemberId, setNewMemberId] = useState(''); // Almacena el ID del nuevo miembro
  const [addMemberError, setAddMemberError] = useState(null); // Controla errores al añadir miembros

  // Punto de depuración: Logs iniciales
  useEffect(() => {
    console.log("Valor de project.usuario_id:", project.usuario_id);
    console.log("Valor de localStorage user_id:", localStorage.getItem('user_id'));
  }, [project]);

  // Fetch miembros del proyecto desde el backend
  const fetchMiembros = async () => {
    try {
      const response = await instance.get(`/proyectos/${project.proyecto_id}/miembros`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMiembros(response.data);
    } catch (error) {
      console.error('Error al obtener los miembros del proyecto:', error);
    }
  };

  // Cargar miembros al abrir la pestaña de "Miembros"
  useEffect(() => {
    if (tabValue === 1 && project?.proyecto_id) {
      fetchMiembros();
    }
  }, [tabValue, project]);

  // Cambiar entre pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Añadir un miembro al proyecto
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
      fetchMiembros(); // Refresca los miembros
      setIsAddingMember(false);
      setNewMemberId(''); // Limpia el campo de texto
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
      {/* Título del diálogo */}
      <DialogTitle>
        {project.nombre}
      </DialogTitle>

      {/* Contenido del diálogo */}
      <DialogContent>
        {/* Pestañas */}
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Información" icon={<Info />} />
          <Tab label="Miembros" icon={<People />} />
        </Tabs>

        {/* Pestaña de Información */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Descripción:</Typography>
            <Typography>{project.descripcion}</Typography>
          </Box>
        )}

        {/* Pestaña de Miembros */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Miembros del Proyecto</Typography>

            {/* Depuración del botón "Añadir Miembro" */}
            {project.usuario_id !== localStorage.getItem('user_id') && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                ⚠️ El usuario autenticado no es administrador. No se mostrará el botón de añadir miembro.
              </Typography>
            )}

            {/* Botón para añadir miembros (visible solo para el administrador) */}
            {project.usuario_id === localStorage.getItem('user_id') && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setIsAddingMember(true)}
              >
                Añadir Miembro
              </Button>
            )}

            {/* Lista de miembros */}
            <List>
              {miembros.length > 0 ? (
                miembros.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar src={`data:image/jpeg;base64,${member.avatar}`} alt={member.nombre} />
                    </ListItemAvatar>
                    <ListItemText primary={member.nombre} secondary={member.email} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">No hay miembros registrados en este proyecto.</Typography>
              )}
            </List>

            {/* Modal para añadir miembros */}
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
