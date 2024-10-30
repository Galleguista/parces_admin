// project_section/ProjectDetails.js
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Grid, Chip, Divider, Avatar, IconButton, Tooltip, Paper, TextField, Button, Checkbox, FormControlLabel
} from '@mui/material';
import { AccountCircle, LocationOn, CalendarToday, ContactMail, EmojiObjects, Nature, People, Info, Description, AttachFile, Edit, CheckCircle } from '@mui/icons-material';

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });

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

  const handleSaveChanges = () => {
    onUpdateProject(editedProject);
    setIsEditing(false);
  };

  const renderFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <Description color="error" />;
    if (fileType.includes('image')) return <AttachFile color="primary" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <Description color="action" />;
    return <AttachFile color="disabled" />;
  };

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', padding: 3 } }}
    >
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
              <Typography variant="body1"><strong>Tamaño del Terreno:</strong> {isEditing ? <TextField name="terreno_tamano" value={editedProject.terreno_tamano} onChange={handleInputChange} fullWidth /> : project.terreno_tamano}</Typography>
              <Typography variant="body1"><strong>Duración:</strong> {isEditing ? <TextField name="duracion" value={editedProject.duracion} onChange={handleInputChange} fullWidth /> : project.duracion}</Typography>
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
              <Typography variant="body1"><strong>Aportes Esperados:</strong> {isEditing ? <TextField name="aportes_esperados" value={editedProject.aportes_esperados} onChange={handleInputChange} fullWidth /> : project.aportes_esperados}</Typography>
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
              <Typography variant="body1"><strong>Modalidad:</strong> {isEditing ? <TextField name="modalidad" value={editedProject.modalidad} onChange={handleInputChange} fullWidth /> : project.modalidad}</Typography>
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
              <Typography variant="body1"><strong>Nombre del Encargado:</strong> {isEditing ? <TextField name="contacto_nombre" value={editedProject.contacto_nombre} onChange={handleInputChange} fullWidth /> : project.contacto_nombre}</Typography>
              <Typography variant="body1"><strong>Correo Electrónico:</strong> {isEditing ? <TextField name="contacto_correo" value={editedProject.contacto_correo} onChange={handleInputChange} fullWidth /> : project.contacto_correo}</Typography>
              <Typography variant="body1"><strong>Teléfono:</strong> {isEditing ? <TextField name="contacto_telefono" value={editedProject.contacto_telefono} onChange={handleInputChange} fullWidth /> : project.contacto_telefono}</Typography>
              <FormControlLabel
                control={<Checkbox checked={editedProject.publicar} onChange={() => setEditedProject({ ...editedProject, publicar: !editedProject.publicar })} />}
                label="Publicar mi proyecto"
              />
              <FormControlLabel
                control={<Checkbox checked={editedProject.aceptar_terminos} onChange={() => setEditedProject({ ...editedProject, aceptar_terminos: !editedProject.aceptar_terminos })} />}
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
        
        {/* Botones para guardar o cancelar cambios */}
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
