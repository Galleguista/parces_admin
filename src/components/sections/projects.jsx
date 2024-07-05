import React, { useState } from 'react';
import { Container, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Box, Button, Card, CardContent, CardMedia, Typography, Fab, Dialog, DialogContent, DialogTitle, AppBar, Tabs, Tab, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const projectsData = [
  { id: 1, title: 'Proyecto 1', description: 'Descripción del Proyecto 1', image: 'https://via.placeholder.com/150', location: 'Ubicación 1', category: 'Categoría 1', relevance: 'Alta', members: [{ id: 1, name: 'Miembro 1', avatar: 'https://via.placeholder.com/50' }, { id: 2, name: 'Miembro 2', avatar: 'https://via.placeholder.com/50' }] },
  { id: 2, title: 'Proyecto 2', description: 'Descripción del Proyecto 2', image: 'https://via.placeholder.com/150', location: 'Ubicación 2', category: 'Categoría 2', relevance: 'Media', members: [{ id: 3, name: 'Miembro 3', avatar: 'https://via.placeholder.com/50' }, { id: 4, name: 'Miembro 4', avatar: 'https://via.placeholder.com/50' }] },
  { id: 3, title: 'Proyecto 3', description: 'Descripción del Proyecto 3', image: 'https://via.placeholder.com/150', location: 'Ubicación 3', category: 'Categoría 3', relevance: 'Media', members: [{ id: 5, name: 'Miembro 5', avatar: 'https://via.placeholder.com/50' }, { id: 6, name: 'Miembro 6', avatar: 'https://via.placeholder.com/50' }] },
];

const ProjectsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', category: '', relevance: '' });
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tabValue, setTabValue] = useState(0);

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

  const filteredProjects = projectsData.filter((project) => {
    return (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.location ? project.location === filters.location : true) &&
      (filters.category ? project.category === filters.category : true) &&
      (filters.relevance ? project.relevance === filters.relevance : true)
    );
  });

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
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{ borderRadius: '24px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
              onClick={() => handleProjectClick(project)}
            >
              <CardMedia
                component="img"
                height="140"
                image={project.image}
                alt={project.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
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
              <TextField label="Título" variant="outlined" fullWidth />
              <TextField label="Descripción" variant="outlined" fullWidth multiline rows={4} />
              <TextField label="URL de la Imagen" variant="outlined" fullWidth />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <TextField label="Ubicación" variant="outlined" fullWidth />
              <TextField label="Categoría" variant="outlined" fullWidth />
              <TextField label="Relevancia" variant="outlined" fullWidth />
              <Button variant="contained" color="primary" onClick={handleClose}>Crear</Button>
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
            <Typography variant="h4">{selectedProject.title}</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={selectedProject.image}
                alt={selectedProject.title}
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
                  {selectedProject.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Ubicación:</strong> {selectedProject.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Categoría:</strong> {selectedProject.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Relevancia:</strong> {selectedProject.relevance}
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
