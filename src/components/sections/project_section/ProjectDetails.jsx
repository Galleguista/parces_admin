import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Button,
  Alert,
  Tabs,
  Tab,
  TextField,
  Grid,
  Paper,
  Divider,
  Tooltip,
  FormControlLabel,
  Checkbox,
  List,
} from '@mui/material';
import {
  Edit,
  Info,
  People,
  Nature,
  ContactMail,
  AttachFile,
  LocationOn
} from '@mui/icons-material';
import axios from 'axios';
import ProjectMembers from './ProjectMembers';
import ProjectLog from './ProjectLog';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });
  const [errorAlert, setErrorAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setEditedProject({ ...project });
  }, [project]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };

  const updateProject = async (updatedProject) => {
    try {
      const response = await instance.patch(`/proyectos/${updatedProject.proyecto_id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      throw error;
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedProject = await updateProject(editedProject);
      setIsEditing(false);
      onUpdateProject(updatedProject);
      setErrorAlert(false);
    } catch (error) {
      setErrorAlert(true);
    }
  };

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          borderRadius: 3,
          boxShadow: 6,
          overflow: 'hidden',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {errorAlert && (
        <Alert severity="error" onClose={() => setErrorAlert(false)} sx={{ mb: 2 }}>
          No tienes permiso para realizar esta acción.
        </Alert>
      )}
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
            {project.nombre}
          </Typography>
          <IconButton
            onClick={() => setIsEditing(!isEditing)}
            sx={{
              position: 'relative',
              color: 'primary.main',
              '&:hover': { color: 'primary.dark' },
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Información" icon={<Info />} />
          <Tab label="Miembros" icon={<People />} />
          <Tab label="Bitácora" icon={<Nature />} />
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
        {tabValue === 1 && <ProjectMembers projectId={project.proyecto_id} />}
        {tabValue === 2 && <ProjectLog projectId={project.proyecto_id} />}
      </DialogContent>

      {isEditing && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            boxShadow: 3,
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ width: '90%' }}
          >
            Guardar Cambios
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default ProjectDetails;
