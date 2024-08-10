import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, ListItemAvatar, Avatar, Box, Input
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

const ResourcesSection = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resourceData, setResourceData] = useState({ id: null, nombre: '', descripcion: '', imagen: null, pdf: null });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await instance.get('/recursos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleOpenDialog = (resource = null) => {
    setSelectedResource(resource);
    setResourceData(resource || { id: null, nombre: '', descripcion: '', imagen: null, pdf: null });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' || name === 'pdf') {
      setResourceData({ ...resourceData, [name]: files[0] });
    } else {
      setResourceData({ ...resourceData, [name]: value });
    }
  };

  const handleSaveResource = async () => {
    const formData = new FormData();
    formData.append('nombre', resourceData.nombre);
    formData.append('descripcion', resourceData.descripcion);
    if (resourceData.imagen) formData.append('imagen', resourceData.imagen);
    if (resourceData.pdf) formData.append('pdf', resourceData.pdf);

    try {
      if (selectedResource) {
        await instance.put(`/recursos/${selectedResource.recurso_id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await instance.post('/recursos/create', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchResources();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await instance.delete(`/recursos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Library Resources</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Resource
        </Button>
      </Box>
      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.recurso_id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
              <CardContent>
                <Box
                  component="img"
                  src={resource.imagen_url}
                  alt={resource.nombre}
                  sx={{ width: '100%', height: 140, borderRadius: '16px', mb: 2 }}
                />
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BookIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{resource.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">{resource.descripcion}</Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <IconButton color="primary" onClick={() => handleOpenDialog(resource)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteResource(resource.recurso_id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            name="nombre"
            value={resourceData.nombre}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            name="descripcion"
            value={resourceData.descripcion}
            onChange={handleInputChange}
          />
          <Input
            margin="dense"
            type="file"
            fullWidth
            name="imagen"
            onChange={handleInputChange}
          />
          <Input
            margin="dense"
            type="file"
            fullWidth
            name="pdf"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveResource} color="primary">{selectedResource ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourcesSection;
