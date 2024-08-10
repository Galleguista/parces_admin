import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Box, Button, Card, CardContent, CardMedia, Typography, Fab, Dialog, DialogContent, DialogTitle, AppBar, Tabs, Tab, Avatar, List, ListItem, ListItemAvatar, ListItemText, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', // Cambia este valor por el puerto en el que está corriendo tu backend
});

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', category: '', relevance: '' });
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tabValue, setTabValue] = useState(0);
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
    requisitos_participacion: '',
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
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const handleCreateProject = async () => {
    try {
      const response = await instance.post('/proyectos/create', newProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    <Container sx={{ marginTop: 4, borderRadius: '16px', padding: 2, backgroundColor: '#f5f5f5', maxWidth: '90%' }}>
      <TextField
        fullWidth
        label="Buscar"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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
          <Grid item xs={12} sm={6} md={4} key={project.proyecto_id}>
            <Card
              sx={{ borderRadius: '24px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
              onClick={() => handleProjectClick(project)}
            >
              <CardMedia
                component="img"
                height="140"
                image={project.imagen_representativa}
                alt={project.nombre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {project.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.descripcion}
                </Typography>
              </CardContent>
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
          <Box component="form" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <TextField label="Nombre" variant="outlined" fullWidth name="nombre" value={newProject.nombre} onChange={handleInputChange} />
              <TextField label="Descripción" variant="outlined" fullWidth multiline rows={4} name="descripcion" value={newProject.descripcion} onChange={handleInputChange} />
              <TextField label="Objetivos" variant="outlined" fullWidth name="objetivos" value={newProject.objetivos} onChange={handleInputChange} />
              <TextField label="Actividades Planificadas" variant="outlined" fullWidth name="actividades_planificadas" value={newProject.actividades_planificadas} onChange={handleInputChange} />
              <TextField label="Categoría" variant="outlined" fullWidth name="categoria" value={newProject.categoria} onChange={handleInputChange} />
              <TextField label="Tipo de Cultivo" variant="outlined" fullWidth name="tipo_cultivo" value={newProject.tipo_cultivo} onChange={handleInputChange} />
              <TextField label="Tipo de Ganadería" variant="outlined" fullWidth name="tipo_ganaderia" value={newProject.tipo_ganaderia} onChange={handleInputChange} />
              <TextField label="Otro" variant="outlined" fullWidth name="otro" value={newProject.otro} onChange={handleInputChange} />
              <TextField label="Ubicación (Departamento)" variant="outlined" fullWidth name="ubicacion_departamento" value={newProject.ubicacion_departamento} onChange={handleInputChange} />
              <TextField label="Ubicación (Municipio)" variant="outlined" fullWidth name="ubicacion_municipio" value={newProject.ubicacion_municipio} onChange={handleInputChange} />
              <TextField label="Ubicación (Región)" variant="outlined" fullWidth name="ubicacion_region" value={newProject.ubicacion_region} onChange={handleInputChange} />
              <TextField label="Ubicación (Altitud)" variant="outlined" fullWidth name="ubicacion_altitud" value={newProject.ubicacion_altitud} onChange={handleInputChange} />
              <TextField label="Ubicación (Clima)" variant="outlined" fullWidth name="ubicacion_clima" value={newProject.ubicacion_clima} onChange={handleInputChange} />
              <TextField label="Ubicación (Coordenadas)" variant="outlined" fullWidth name="ubicacion_coordenadas" value={newProject.ubicacion_coordenadas} onChange={handleInputChange} />
              <FormControlLabel control={<Checkbox name="cuenta_con_terreno" checked={newProject.cuenta_con_terreno} onChange={handleInputChange} />} label="Cuenta con Terreno" />
              <TextField label="Tamaño del Terreno" variant="outlined" fullWidth name="terreno_tamano" value={newProject.terreno_tamano} onChange={handleInputChange} />
              <TextField label="Vías de Acceso al Terreno" variant="outlined" fullWidth name="terreno_vias_acceso" value={newProject.terreno_vias_acceso} onChange={handleInputChange} />
              <TextField label="Acceso a Recursos del Terreno" variant="outlined" fullWidth name="terreno_acceso_recursos" value={newProject.terreno_acceso_recursos} onChange={handleInputChange} />
              <TextField label="Información Adicional" variant="outlined" fullWidth name="informacion_adicional" value={newProject.informacion_adicional} onChange={handleInputChange} />
              <TextField label="Nombre de Contacto" variant="outlined" fullWidth name="contacto_nombre" value={newProject.contacto_nombre} onChange={handleInputChange} />
              <TextField label="Correo de Contacto" variant="outlined" fullWidth name="contacto_correo" value={newProject.contacto_correo} onChange={handleInputChange} />
              <TextField label="Teléfono de Contacto" variant="outlined" fullWidth name="contacto_telefono" value={newProject.contacto_telefono} onChange={handleInputChange} />
              <TextField label="Requisitos de Participación" variant="outlined" fullWidth name="requisitos_participacion" value={newProject.requisitos_participacion} onChange={handleInputChange} />
              <TextField label="Experiencia Requerida" variant="outlined" fullWidth name="experiencia_requerida" value={newProject.experiencia_requerida} onChange={handleInputChange} />
              <TextField label="Disponibilidad de Tiempo" variant="outlined" fullWidth name="disponibilidad_tiempo" value={newProject.disponibilidad_tiempo} onChange={handleInputChange} />
              <TextField label="Competencias Específicas" variant="outlined" fullWidth name="competencias_especificas" value={newProject.competencias_especificas} onChange={handleInputChange} />
              <TextField label="Beneficios para el Aparcero" variant="outlined" fullWidth name="beneficios_aparcero" value={newProject.beneficios_aparcero} onChange={handleInputChange} />
              <TextField label="Condiciones del Proyecto" variant="outlined" fullWidth name="condiciones_proyecto" value={newProject.condiciones_proyecto} onChange={handleInputChange} />
              <TextField label="Criterios de Selección" variant="outlined" fullWidth name="criterios_seleccion" value={newProject.criterios_seleccion} onChange={handleInputChange} />
              <TextField label="Número de Participantes" variant="outlined" fullWidth name="numero_participantes" value={newProject.numero_participantes} onChange={handleInputChange} />
              <TextField label="Lista de Recursos" variant="outlined" fullWidth name="lista_recursos" value={newProject.lista_recursos} onChange={handleInputChange} />
              <TextField label="Responsabilidades del Aparcero" variant="outlined" fullWidth name="responsabilidades_aparcero" value={newProject.responsabilidades_aparcero} onChange={handleInputChange} />
              <TextField label="Colaboradores Buscados" variant="outlined" fullWidth name="colaboradores_buscados" value={newProject.colaboradores_buscados} onChange={handleInputChange} />
              <TextField
                label="Fecha de Inicio"
                variant="outlined"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                name="fecha_de_inicio"
                value={newProject.fecha_de_inicio}
                onChange={handleInputChange}
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
              />
              <TextField label="Imagen Representativa" variant="outlined" fullWidth name="imagen_representativa" value={newProject.imagen_representativa} onChange={handleInputChange} />
              <TextField label="Documentos Relevantes" variant="outlined" fullWidth name="documentos_relevantes" value={newProject.documentos_relevantes} onChange={handleInputChange} />
              <Button variant="contained" color="primary" onClick={handleCreateProject}>Crear</Button>
            </Box>
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
                src={selectedProject.imagen_representativa}
                alt={selectedProject.nombre}
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
                  {selectedProject.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Ubicación:</strong> {selectedProject.ubicacion_region}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Categoría:</strong> {selectedProject.categoria}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Relevancia:</strong> {selectedProject.relevancia}
                </Typography>
              </Box>
            )}
            {tabValue === 1 && (
              <List>
                {selectedProject.members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar alt={member.name} src={member.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))}
              </List>
            )}
            {tabValue === 2 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" color="primary">
                  Unirte al chat grupal
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default ProjectsSection;
