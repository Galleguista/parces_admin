import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, Grid, Divider, Avatar, IconButton, Tooltip, Paper, TextField, Button, Checkbox, FormControlLabel
} from '@mui/material';
import { ContactMail, Info, Nature, People, LocationOn, AttachFile, Edit } from '@mui/icons-material';

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project });

  // Log the project data on initial load
  useEffect(() => {
    console.log("Project data loaded into ProjectDetails component:", project);
    setEditedProject({ ...project });
  }, [project]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    console.log("Toggle edit mode. Now editing:", isEditing);
    setEditedProject({ ...project }); // Reset to initial project data on toggle
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field changed: ${name} = ${value}`);
    setEditedProject({
      ...editedProject,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    console.log("Saving changes for project:", editedProject);
    onUpdateProject(editedProject);
    setIsEditing(false);
  };

  const renderFileIcon = (fileType) => {
    console.log("Rendering icon for file type:", fileType);
    if (fileType.includes('pdf')) return <AttachFile color="error" />;
    if (fileType.includes('image')) return <AttachFile color="primary" />;
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
