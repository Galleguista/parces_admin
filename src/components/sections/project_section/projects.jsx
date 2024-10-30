import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, TextField, Box, Fab, Dialog, DialogContent, DialogTitle, Grid, Card, CardContent, Typography, 
  CardActions, IconButton, Select, MenuItem, InputLabel, FormControl, Chip, Tooltip, Avatar, Stack 
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PetsIcon from '@mui/icons-material/Pets';
import WaterIcon from '@mui/icons-material/Water';
import ParkIcon from '@mui/icons-material/Park';
import ProjectForm from './ProjectForm';
import ProjectDetails from './ProjectDetails';

const iconMap = {
  NaturePeopleIcon: <NaturePeopleIcon fontSize="large" color="primary" />,
  AgricultureIcon: <AgricultureIcon fontSize="large" color="primary" />,
  PetsIcon: <PetsIcon fontSize="large" color="primary" />,
  WaterIcon: <WaterIcon fontSize="large" color="primary" />,
  ParkIcon: <ParkIcon fontSize="large" color="primary" />,
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', category: '', relevance: '' });
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
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
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (newProject) => {
    try {
      const response = await instance.post('/proyectos/create', newProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setProjects([...projects, response.data]);
      setOpen(false);  // Cierra el modal después de crear el proyecto
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleDetailsClose = () => {
    setSelectedProject(null);
  };

  return (
    <Container sx={{ marginTop: 4, padding: 2, maxWidth: '90%' }}>
      <TextField
        fullWidth
        label="Buscar"
        variant="outlined"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 1 }}>
          <InputLabel>Ubicación</InputLabel>
          <Select
            name="location"
            value={filters.location}
            onChange={(event) => setFilters({ ...filters, location: event.target.value })}
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
            onChange={(event) => setFilters({ ...filters, category: event.target.value })}
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
            onChange={(event) => setFilters({ ...filters, relevance: event.target.value })}
            label="Relevancia"
          >
            <MenuItem value=""><em>Ninguna</em></MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {projects.filter((project) => project.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.proyecto_id}>
              <Card onClick={() => handleProjectClick(project)} sx={{
                borderRadius: '16px', transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)' },
                display: 'flex', flexDirection: 'column', alignItems: 'center', height: 250, padding: 2,
                backgroundColor: 'whitesmoke'
              }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, marginBottom: 2 }}>
                  {iconMap[project.icono] || <NaturePeopleIcon />}
                </Avatar>
                <CardContent sx={{ textAlign: 'center', padding: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">{project.nombre}</Typography>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', marginY: 1 }}>
                    <Chip label={project.categoria} color="primary" size="small" />
                    <Tooltip title="Ubicación del proyecto">
                      <Chip label={project.ubicacion} size="small" />
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', maxHeight: '2.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {project.descripcion}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ width: '100%', justifyContent: 'center', borderTop: '1px solid #ddd', paddingTop: 1 }}>
                  <Tooltip title="Me gusta">
                    <IconButton aria-label="like project" sx={{ color: 'black' }}>
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Compartir">
                    <IconButton aria-label="share project" sx={{ color: 'black' }}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
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
          <ProjectForm onSubmit={handleCreateProject} />
        </DialogContent>
      </Dialog>

      {selectedProject && (
        <ProjectDetails project={selectedProject} onClose={handleDetailsClose} />
      )}
    </Container>
  );
};

export default ProjectsSection;
