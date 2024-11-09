import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Grid, Divider, Avatar, IconButton, Tooltip, Paper, TextField, Button, Checkbox, FormControlLabel, Alert, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import { ContactMail, Info, Nature, People, LocationOn, AttachFile, Edit, Chat } from '@mui/icons-material';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });
  const [errorAlert, setErrorAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0); // Estado para la pestaña activa
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para abrir chat de proyecto
  const [messages, setMessages] = useState([]); // Mensajes del chat
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setEditedProject({ ...project });
  }, [project]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedProject({ ...project });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProject({
      ...editedProject,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await onUpdateProject(editedProject);
      setIsEditing(false);
      setErrorAlert(false); // Reiniciar alerta en caso de éxito
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorAlert(true); // Activar la alerta si hay un error 403
      } else {
        console.error("Error al actualizar el proyecto:", error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para iniciar un chat de proyecto
  const handleStartProjectChat = async () => {
    try {
      const response = await instance.post('/conversaciones/project-chat', { projectId: project.proyecto_id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setIsChatOpen(true); // Abre el chat
      setTabValue(2); // Cambia a la pestaña de chat
      fetchMessages(response.data.conversacion_id); // Cargar mensajes de la conversación del proyecto
    } catch (error) {
      console.error('Error al iniciar chat de proyecto:', error);
    }
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
      const response = await instance.post('/mensajes', {
        conversacion_id: project.conversacion_id,
        contenido: { texto: newMessage },
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Dialog open={Boolean(project)} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', padding: 3, position: 'relative' } }}>
      {errorAlert && (
        <Alert severity="error" onClose={() => setErrorAlert(false)} sx={{ mb: 2, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          No tienes permiso para realizar esta acción.
        </Alert>
      )}

      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={`data:image/jpeg;base64,${project.imagen_representativa}`}
            alt={project.nombre}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          {!isEditing ? (
            <Typography variant="h4" component="div">{project.nombre}</Typography>
          ) : (
            <TextField
              variant="outlined"
              name="nombre"
              value={editedProject.nombre}
              onChange={handleInputChange}
              fullWidth
            />
          )}
        </Box>
        <IconButton onClick={handleEditToggle}>
          <Edit color="primary" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
          <Tab label="Información" icon={<Info />} />
          <Tab label="Miembros" icon={<People />} />
          <Tab label="Chat del Proyecto" icon={<Chat />} />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={2}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, color: 'primary.main' }} />
                Información Básica
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Nombre:</strong> {isEditing ? <TextField name="nombre" value={editedProject.nombre} onChange={handleInputChange} fullWidth /> : project.nombre}</Typography>
                <Typography variant="body1"><strong>Descripción:</strong> {isEditing ? <TextField name="descripcion" value={editedProject.descripcion} onChange={handleInputChange} fullWidth multiline rows={2} /> : project.descripcion}</Typography>
                <Typography variant="body1"><strong>Objetivos:</strong> {isEditing ? <TextField name="objetivos" value={editedProject.objetivos} onChange={handleInputChange} fullWidth multiline rows={2} /> : project.objetivos}</Typography>
              </Paper>
            </Grid>

            {/* Detalles del Proyecto */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Nature sx={{ mr: 1, color: 'success.main' }} />
                Detalles del Proyecto
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Tamaño del Terreno:</strong> {isEditing ? <TextField name="tamano_terreno" value={editedProject.tamano_terreno} onChange={handleInputChange} fullWidth /> : project.tamano_terreno}</Typography>
                <Typography variant="body1"><strong>Duración:</strong> {isEditing ? <TextField name="duracion_proyecto" value={editedProject.duracion_proyecto} onChange={handleInputChange} fullWidth /> : project.duracion_proyecto}</Typography>
                <Typography variant="body1"><strong>Participantes Esperados:</strong> {isEditing ? <TextField name="numero_participantes" value={editedProject.numero_participantes} onChange={handleInputChange} fullWidth /> : project.numero_participantes}</Typography>
              </Paper>
            </Grid>

            {/* Participación y Recursos */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, color: 'secondary.main' }} />
                Participación y Recursos
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Aportes Esperados:</strong> {isEditing ? <TextField name="aportes_participantes" value={editedProject.aportes_participantes} onChange={handleInputChange} fullWidth /> : project.aportes_participantes}</Typography>
                <Typography variant="body1"><strong>Recursos Disponibles:</strong> {isEditing ? <TextField name="recursos_disponibles" value={editedProject.recursos_disponibles} onChange={handleInputChange} fullWidth multiline rows={2} /> : project.recursos_disponibles}</Typography>
              </Paper>
            </Grid>

            {/* Modalidad de Aparcería */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                Modalidad de Aparcería
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Modalidad:</strong> {isEditing ? <TextField name="modalidad_participacion" value={editedProject.modalidad_participacion} onChange={handleInputChange} fullWidth /> : project.modalidad_participacion}</Typography>
                <Typography variant="body1"><strong>Modelo de Reparto:</strong> {isEditing ? <TextField name="modelo_reparto" value={editedProject.modelo_reparto} onChange={handleInputChange} fullWidth /> : project.modelo_reparto}</Typography>
              </Paper>
            </Grid>

            {/* Contacto y Publicación */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ContactMail sx={{ mr: 1, color: 'primary.main' }} />
                Contacto y Publicación
              </Typography>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Nombre del Encargado:</strong> {isEditing ? <TextField name="nombre_encargado" value={editedProject.nombre_encargado} onChange={handleInputChange} fullWidth /> : project.nombre_encargado}</Typography>
                <Typography variant="body1"><strong>Correo Electrónico:</strong> {isEditing ? <TextField name="correo_contacto" value={editedProject.correo_contacto} onChange={handleInputChange} fullWidth /> : project.correo_contacto}</Typography>
                <Typography variant="body1"><strong>Teléfono:</strong> {isEditing ? <TextField name="telefono_contacto" value={editedProject.telefono_contacto} onChange={handleInputChange} fullWidth /> : project.telefono_contacto}</Typography>
                <FormControlLabel
                  control={<Checkbox checked={editedProject.publicar_comunidad || false} onChange={() => setEditedProject({ ...editedProject, publicar_comunidad: !editedProject.publicar_comunidad })} />}
                  label="Publicar mi proyecto"
                />
                <FormControlLabel
                  control={<Checkbox checked={editedProject.aceptar_terminos || false} onChange={() => setEditedProject({ ...editedProject, aceptar_terminos: !editedProject.aceptar_terminos })} />}
                  label="Acepto los términos y condiciones"
                />
              </Paper>
            </Grid>

            {/* Archivos Relacionados */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachFile sx={{ mr: 1, color: 'secondary.main' }} />
                Archivos Relacionados
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(Array.isArray(project.documentos_relevantes) ? project.documentos_relevantes : []).map((file, index) => (
                  <Paper key={index} elevation={2} sx={{ padding: 1, display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Descargar archivo">
                      <IconButton>
                        {renderFileIcon(file.type)}
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {file.name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Pestaña de Miembros */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Miembros del Proyecto</Typography>
            <List>
              {project.miembros?.map((member) => (
                <ListItem key={member.usuario_id}>
                  <ListItemAvatar>
                    <Avatar src={`data:image/jpeg;base64,${member.avatar}`} />
                  </ListItemAvatar>
                  <ListItemText primary={member.nombre} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Pestaña de Chat del Proyecto */}
        {tabValue === 2 && (
          <Box sx={{ p: 2 }}>
            {!isChatOpen ? (
              <Button variant="contained" color="primary" onClick={handleStartProjectChat} startIcon={<Chat />}>
                Iniciar Chat del Proyecto
              </Button>
            ) : (
              <>
                <Typography variant="h6">Chat del Proyecto</Typography>
                <Box sx={{ overflowY: 'auto', maxHeight: 300 }}>
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
                <TextField
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                />
                <Button onClick={handleSendMessage} variant="contained" color="primary" endIcon={<Chat />}>
                  Enviar
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Botones para guardar o cancelar cambios en modo edición */}
        {isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" onClick={handleEditToggle}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
