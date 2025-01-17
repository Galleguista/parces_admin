import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, Typography, IconButton, Box, Avatar, InputLabel, Input, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';

const API_URL = `${import.meta.env.VITE_API_URL}/recursos`;
const FILES_URL = `${import.meta.env.VITE_PUBLIC_URL}`;

const ResourcesSection = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resourceData, setResourceData] = useState({ nombre: '', descripcion: '', imagen: null, pdf: null });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(API_URL, {
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
    setResourceData(resource || { nombre: '', descripcion: '', imagen: null, pdf: null });
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

    if (resourceData.imagen) {
      formData.append('imagen', resourceData.imagen);
    }

    if (resourceData.pdf) {
      formData.append('pdf', resourceData.pdf);
    }

    try {
      if (selectedResource) {
        await axios.put(`${API_URL}/${selectedResource.recurso_id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${API_URL}/create`, formData, {
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
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleDownloadPdf = (pdfUrl) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfUrl.split('/').pop()); // Descargar con el nombre original
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>


      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={3} key={resource.recurso_id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3, height: '100%', minHeight: '200px' }}>
              <CardContent>
                {resource.imagen_url && (
                  <Box
                    component="img"
                    src={`${FILES_URL}${resource.imagen_url}`}
                    alt={resource.nombre}
                    sx={{ width: '100%', height: 120, borderRadius: '16px', mb: 2, objectFit: 'cover' }}
                  />
                )}
                <Box display="flex" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{resource.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">{resource.descripcion}</Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  {resource.pdf_url && (
                    <IconButton color="primary" onClick={() => handleDownloadPdf(`${FILES_URL}${resource.pdf_url}`)}>
                      <DownloadIcon />
                    </IconButton>
                  )}
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

      {/* Botón flotante para agregar recurso */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo para agregar/editar recurso */}
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

          <Box display="flex" alignItems="center" mt={2} mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <ImageIcon />
            </Avatar>
            <InputLabel htmlFor="imagen-upload" sx={{ cursor: 'pointer' }}>
              Subir Imagen
            </InputLabel>
            <Input
              id="imagen-upload"
              margin="dense"
              type="file"
              fullWidth
              name="imagen"
              inputProps={{ accept: 'image/*' }}
              onChange={handleInputChange}
              sx={{ display: 'none' }}
            />
          </Box>

          <Box display="flex" alignItems="center" mt={2} mb={2}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <PictureAsPdfIcon />
            </Avatar>
            <InputLabel htmlFor="pdf-upload" sx={{ cursor: 'pointer' }}>
              Subir PDF
            </InputLabel>
            <Input
              id="pdf-upload"
              margin="dense"
              type="file"
              fullWidth
              name="pdf"
              inputProps={{ accept: 'application/pdf' }}
              onChange={handleInputChange}
              sx={{ display: 'none' }}
            />
          </Box>
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
