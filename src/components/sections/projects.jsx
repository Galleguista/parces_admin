import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Box, Button, Card, CardContent,
  Typography, Fab, Dialog, DialogContent, DialogTitle, Avatar, IconButton, CardActions, Chip, List, ListItem, ListItemText, Checkbox, 
  FormControlLabel, CardMedia, Accordion, AccordionSummary, AccordionDetails, ListItemIcon
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete'; // Importar DeleteIcon

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', category: '', relevance: '' });
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newRequirement, setNewRequirement] = useState({ title: '', description: '' });
  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    actividades_planificadas: '',
    categoria: '',
    tipo_cultivo: '',
    tipo_ganaderia: '',
    otro: '',
    ubicacion_departamento: '',
    ubicacion_municipio: '',
    ubicacion_region: '',
    ubicacion_altitud: '',
    ubicacion_clima: '',
    ubicacion_coordenadas: '',
    cuenta_con_terreno: false,
    terreno_tamano: '',
    terreno_vias_acceso: '',
    terreno_acceso_recursos: '',
    informacion_adicional: '',
    contacto_nombre: '',
    contacto_correo: '',
    contacto_telefono: '',
    requisitos_participacion: [],
    experiencia_requerida: '',
    disponibilidad_tiempo: '',
    competencias_especificas: '',
    beneficios_aparcero: '',
    condiciones_proyecto: '',
    criterios_seleccion: '',
    numero_participantes: '',
    lista_recursos: '',
    responsabilidades_aparcero: '',
    colaboradores_buscados: '',
    fecha_de_inicio: '',
    fecha_de_fin: '',
    imagen_representativa: '',
    documentos_relevantes: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await instance.get('/proyectos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        console.error('Unexpected response data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewProject({
      ...newProject,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRequirementChange = (event) => {
    const { name, value } = event.target;
    setNewRequirement({
      ...newRequirement,
      [name]: value,
    });
  };

  const handleAddRequirement = () => {
    if (newRequirement.title && newRequirement.description) {
      setNewProject({
        ...newProject,
        requisitos_participacion: [...newProject.requisitos_participacion, newRequirement],
      });
      setNewRequirement({ title: '', description: '' });
    }
  };

  const handleDeleteRequirement = (index) => {
    const updatedRequirements = [...newProject.requisitos_participacion];
    updatedRequirements.splice(index, 1);
    setNewProject({ ...newProject, requisitos_participacion: updatedRequirements });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setNewProject({
        ...newProject,
        imagen_representativa: reader.result.split(',')[1], // Guardar solo la parte base64
      });
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await instance.post('/proyectos/create', {
        ...newProject,
        numero_participantes: parseInt(newProject.numero_participantes, 10) || null,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setProjects([...projects, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
    return (
      project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location ? project.ubicacion_region === filters.location : true) &&
      (filters.category ? project.categoria === filters.category : true) &&
      (filters.relevance ? project.relevancia === filters.relevance : true)
    );
  }) : [];

  return (
    <Container sx={{ marginTop: 4, padding: 2, maxWidth: '90%' }}>
      <TextField
        fullWidth
        label="Buscar"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 1 }}>
          <InputLabel>Ubicación</InputLabel>
          <Select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            label="Ubicación"
          >
            <MenuItem value=""><em>Ninguna</em></MenuItem>
            <MenuItem value="Ubicación 1">Ubicación 1</MenuItem>
            <MenuItem value="Ubicación 2">Ubicación 2</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 1 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            label="Categoría"
          >
            <MenuItem value=""><em>Ninguna</em></MenuItem>
            <MenuItem value="Categoría 1">Categoría 1</MenuItem>
            <MenuItem value="Categoría 2">Categoría 2</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 1 }}>
          <InputLabel>Relevancia</InputLabel>
          <Select
            name="relevance"
            value={filters.relevance}
            onChange={handleFilterChange}
            label="Relevancia"
          >
            <MenuItem value=""><em>Ninguna</em></MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {filteredProjects.slice(0, 9).map((project) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={project.proyecto_id}>
            <Card
              sx={{
                borderRadius: '16px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)' },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: 350,
              }}
              onClick={() => handleProjectClick(project)}
            >
            <CardMedia
                  component="img"
                  image={project.imagen_representativa ? `data:image/jpeg;base64,${project.imagen_representativa}` : 'https://via.placeholder.com/150'}
                  alt={project.nombre}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                />

              <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {project.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                  {project.descripcion}
                </Typography>
                <Chip
                  label={project.categoria}
                  sx={{ marginTop: 1 }}
                  color="secondary"
                />
              </CardContent>
              <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
                <IconButton aria-label="like project" sx={{ color: 'black' }}>
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share project" sx={{ color: 'black' }}>
                  <ShareIcon />
                </IconButton>
                <IconButton aria-label="more options" sx={{ color: 'black' }}>
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '24px', width: '80%' } }}>
        <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Información Básica</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Nombre" variant="outlined" fullWidth name="nombre" value={newProject.nombre} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Descripción" variant="outlined" fullWidth multiline rows={4} name="descripcion" value={newProject.descripcion} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Objetivos" variant="outlined" fullWidth name="objetivos" value={newProject.objetivos} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Requisitos de Participación</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  <TextField
                    label="Título del Requisito"
                    variant="outlined"
                    fullWidth
                    name="title"
                    value={newRequirement.title}
                    onChange={handleRequirementChange}
                  />
                  <TextField
                    label="Descripción del Requisito"
                    variant="outlined"
                    fullWidth
                    name="description"
                    value={newRequirement.description}
                    onChange={handleRequirementChange}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddRequirement}>
                    Add
                  </Button>
                </Box>
                <List>
                  {newProject.requisitos_participacion.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={req.title}
                        secondary={req.description}
                      />
                      <ListItemIcon>
                        <IconButton edge="end" onClick={() => handleDeleteRequirement(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            {/* Aquí agregamos los demás campos que faltan */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Detalles del Proyecto</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Actividades Planificadas" variant="outlined" fullWidth name="actividades_planificadas" value={newProject.actividades_planificadas} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Categoría" variant="outlined" fullWidth name="categoria" value={newProject.categoria} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Tipo de Cultivo" variant="outlined" fullWidth name="tipo_cultivo" value={newProject.tipo_cultivo} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Tipo de Ganadería" variant="outlined" fullWidth name="tipo_ganaderia" value={newProject.tipo_ganaderia} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Otro" variant="outlined" fullWidth name="otro" value={newProject.otro} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Ubicación y Terreno</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Ubicación (Departamento)" variant="outlined" fullWidth name="ubicacion_departamento" value={newProject.ubicacion_departamento} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Ubicación (Municipio)" variant="outlined" fullWidth name="ubicacion_municipio" value={newProject.ubicacion_municipio} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Ubicación (Región)" variant="outlined" fullWidth name="ubicacion_region" value={newProject.ubicacion_region} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Ubicación (Altitud)" variant="outlined" fullWidth name="ubicacion_altitud" value={newProject.ubicacion_altitud} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Ubicación (Clima)" variant="outlined" fullWidth name="ubicacion_clima" value={newProject.ubicacion_clima} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Ubicación (Coordenadas)" variant="outlined" fullWidth name="ubicacion_coordenadas" value={newProject.ubicacion_coordenadas} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <FormControlLabel control={<Checkbox name="cuenta_con_terreno" checked={newProject.cuenta_con_terreno} onChange={handleInputChange} />} label="Cuenta con Terreno" />
                <TextField label="Tamaño del Terreno" variant="outlined" fullWidth name="terreno_tamano" value={newProject.terreno_tamano} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Vías de Acceso al Terreno" variant="outlined" fullWidth name="terreno_vias_acceso" value={newProject.terreno_vias_acceso} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Acceso a Recursos del Terreno" variant="outlined" fullWidth name="terreno_acceso_recursos" value={newProject.terreno_acceso_recursos} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Contacto e Información Adicional</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Nombre de Contacto" variant="outlined" fullWidth name="contacto_nombre" value={newProject.contacto_nombre} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Correo de Contacto" variant="outlined" fullWidth name="contacto_correo" value={newProject.contacto_correo} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
                <TextField label="Teléfono de Contacto" variant="outlined" fullWidth name="contacto_telefono" value={newProject.contacto_telefono} onChange={handleInputChange} sx={{ marginBottom: 2 }} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fechas y Documentación</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Fecha de Inicio"
                  variant="outlined"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  name="fecha_de_inicio"
                  value={newProject.fecha_de_inicio}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Fecha de Fin"
                  variant="outlined"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  name="fecha_de_fin"
                  value={newProject.fecha_de_fin}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
                    Subir Imagen Representativa
                  </Button>
                </label>
              </AccordionDetails>
            </Accordion>
            <Button variant="contained" color="primary" onClick={handleCreateProject} sx={{ mt: 2 }}>Crear Proyecto</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {selectedProject && (
        <Dialog
          open={Boolean(selectedProject)}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{selectedProject.nombre}</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={selectedProject.imagen_representativa ? `data:image/jpeg;base64,${selectedProject.imagen_representativa}` : 'https://via.placeholder.com/150'}
                sx={{ width: 100, height: 100, mb: 2, margin: 'auto' }}
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              {selectedProject.descripcion}
            </Typography>
            <List>
              {/* Aquí se listan los detalles del proyecto */}
              <ListItem>
                <ListItemText primary="Objetivos" secondary={selectedProject.objetivos || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Actividades Planificadas" secondary={selectedProject.actividades_planificadas || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Categoría" secondary={selectedProject.categoria} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tipo de Cultivo" secondary={selectedProject.tipo_cultivo || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tipo de Ganadería" secondary={selectedProject.tipo_ganaderia || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Departamento)" secondary={selectedProject.ubicacion_departamento || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Municipio)" secondary={selectedProject.ubicacion_municipio || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Región)" secondary={selectedProject.ubicacion_region} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Altitud)" secondary={selectedProject.ubicacion_altitud || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Clima)" secondary={selectedProject.ubicacion_clima || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (Coordenadas)" secondary={selectedProject.ubicacion_coordenadas || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Cuenta con Terreno" secondary={selectedProject.cuenta_con_terreno ? 'Sí' : 'No'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tamaño del Terreno" secondary={selectedProject.terreno_tamano || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Vías de Acceso al Terreno" secondary={selectedProject.terreno_vias_acceso || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Acceso a Recursos del Terreno" secondary={selectedProject.terreno_acceso_recursos || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Información Adicional" secondary={selectedProject.informacion_adicional || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nombre de Contacto" secondary={selectedProject.contacto_nombre || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Correo de Contacto" secondary={selectedProject.contacto_correo || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Teléfono de Contacto" secondary={selectedProject.contacto_telefono || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Requisitos de Participación" secondary={selectedProject.requisitos_participacion || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Experiencia Requerida" secondary={selectedProject.experiencia_requerida || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Disponibilidad de Tiempo" secondary={selectedProject.disponibilidad_tiempo || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Competencias Específicas" secondary={selectedProject.competencias_especificas || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Beneficios para el Aparcero" secondary={selectedProject.beneficios_aparcero || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Condiciones del Proyecto" secondary={selectedProject.condiciones_proyecto || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Criterios de Selección" secondary={selectedProject.criterios_seleccion || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Número de Participantes" secondary={selectedProject.numero_participantes || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Lista de Recursos" secondary={selectedProject.lista_recursos || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Responsabilidades del Aparcero" secondary={selectedProject.responsabilidades_aparcero || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Colaboradores Buscados" secondary={selectedProject.colaboradores_buscados || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Fecha de Inicio" secondary={new Date(selectedProject.fecha_de_inicio).toLocaleDateString() || 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Fecha de Fin" secondary={selectedProject.fecha_de_fin ? new Date(selectedProject.fecha_de_fin).toLocaleDateString() : 'No especificado'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Documentos Relevantes" secondary={selectedProject.documentos_relevantes || 'No especificado'} />
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default ProjectsSection;
