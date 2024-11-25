import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Avatar, Button, Alert, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, TextField, Grid, Paper, FormControlLabel, Checkbox, Divider, IconButton, Tooltip
} from '@mui/material';
import {
  ContactMail, Info, Nature, People, LocationOn, AttachFile, Edit, Chat
} from '@mui/icons-material';
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
  const currentUserId = localStorage.getItem('user_id'); // Obtener el ID del usuario actual

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
      console.log('Administrador del Proyecto:', response.data.administrador); // Depuración
      console.log('Usuario Actual:', currentUserId); // Depuración

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

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({
      ...editedProject,
      [name]: value,
    });
  };

  // Función para actualizar el proyecto
  const updateProject = async (updatedProject) => {
    try {
      const response = await instance.patch(`/proyectos/${updatedProject.proyecto_id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("Proyecto actualizado:", response.data);
      return response.data; // Devuelve el proyecto actualizado
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      throw error;
    }
  };

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    try {
      const updatedProject = await updateProject(editedProject);
      setIsEditing(false);
      onUpdateProject(updatedProject); // Actualiza el estado del proyecto en el componente padre
      setErrorAlert(false);
    } catch (error) {
      setErrorAlert(true);
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Lógica para añadir un miembro
  const handleAddMember = async () => {
    if (!newMemberId.trim()) {
      setAddMemberError('Por favor, ingresa un ID o correo válido.');
      return;
    }

    try {
      await instance.post(
        `/proyectos/${project.proyecto_id}/miembro`,
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

  // Función para renderizar iconos de archivos (opcional)
  const renderFileIcon = (fileType) => {
    // Lógica para elegir el icono según el tipo de archivo
    return <AttachFile />;
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
        <IconButton onClick={() => setIsEditing(!isEditing)} sx={{ ml: 2 }}>
          <Edit />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Información" icon={<Info />} />
          <Tab label="Miembros" icon={<People />} />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, color: 'primary.main' }} />
                Información Básica
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>Nombre:</strong>{' '}
                  {isEditing ? (
                    <TextField name="nombre" value={editedProject.nombre} onChange={handleInputChange} fullWidth />
                  ) : (
                    project.nombre
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Descripción:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="descripcion"
                      value={editedProject.descripcion}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  ) : (
                    project.descripcion
                  )}
                </Typography>
              </Paper>
            </Grid>

            {/* Detalles del Proyecto */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Nature sx={{ mr: 1, color: 'success.main' }} />
                Detalles del Proyecto
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>Tamaño del Terreno:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="tamano_terreno"
                      value={editedProject.tamano_terreno}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.tamano_terreno
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Duración:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="duracion_proyecto"
                      value={editedProject.duracion_proyecto}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.duracion_proyecto
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Participantes Esperados:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="numero_participantes"
                      value={editedProject.numero_participantes}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.numero_participantes
                  )}
                </Typography>
              </Paper>
            </Grid>

            {/* Participación y Recursos */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, color: 'secondary.main' }} />
                Participación y Recursos
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>Aportes Esperados:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="aportes_participantes"
                      value={editedProject.aportes_participantes}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.aportes_participantes
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Recursos Disponibles:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="recursos_disponibles"
                      value={editedProject.recursos_disponibles}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  ) : (
                    project.recursos_disponibles
                  )}
                </Typography>
              </Paper>
            </Grid>

            {/* Modalidad de Aparcería */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                Modalidad de Aparcería
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>Modalidad:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="modalidad_participacion"
                      value={editedProject.modalidad_participacion}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.modalidad_participacion
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Modelo de Reparto:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="modelo_reparto"
                      value={editedProject.modelo_reparto}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.modelo_reparto
                  )}
                </Typography>
              </Paper>
            </Grid>

            {/* Contacto y Publicación */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ContactMail sx={{ mr: 1, color: 'primary.main' }} />
                Contacto y Publicación
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>Nombre del Encargado:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="nombre_encargado"
                      value={editedProject.nombre_encargado}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.nombre_encargado
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Correo Electrónico:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="correo_contacto"
                      value={editedProject.correo_contacto}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.correo_contacto
                  )}
                </Typography>
                <Typography variant="body1">
                  <strong>Teléfono:</strong>{' '}
                  {isEditing ? (
                    <TextField
                      name="telefono_contacto"
                      value={editedProject.telefono_contacto}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    project.telefono_contacto
                  )}
                </Typography>
                {isEditing && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedProject.publicar_comunidad || false}
                          onChange={() =>
                            setEditedProject({
                              ...editedProject,
                              publicar_comunidad: !editedProject.publicar_comunidad,
                            })
                          }
                        />
                      }
                      label="Publicar mi proyecto"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedProject.aceptar_terminos || false}
                          onChange={() =>
                            setEditedProject({
                              ...editedProject,
                              aceptar_terminos: !editedProject.aceptar_terminos,
                            })
                          }
                        />
                      }
                      label="Acepto los términos y condiciones"
                    />
                  </>
                )}
              </Paper>
            </Grid>

            {/* Botones de acción */}
            {isEditing && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ mr: 2 }}>
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                  Guardar Cambios
                </Button>
              </Grid>
            )}
          </Grid>
        )}

        {/* Miembros del Proyecto */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Miembros del Proyecto</Typography>

            {/* Botón para añadir miembros (solo para el administrador) */}
            {admin?.usuario_id === currentUserId ? (
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setIsAddingMember(true)}
              >
                Añadir Miembro
              </Button>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Solo el administrador puede añadir miembros.
              </Typography>
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
