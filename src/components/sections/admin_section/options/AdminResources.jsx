import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Button,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/recursos`;

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState({ imagen: null, pdf: null });

  const fetchToken = () => localStorage.getItem('token'); // Obtener el JWT del almacenamiento local

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = fetchToken();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error al obtener recursos:', error);
      setSnackbarMessage('Error al cargar los recursos.');
    }
  };

  const handleEditClick = (resource) => {
    setSelectedResource(resource);
    setEditData({ ...resource });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', editData.nombre);
    formData.append('descripcion', editData.descripcion);

    if (selectedFile.imagen) {
      formData.append('imagen', selectedFile.imagen);
    }

    if (selectedFile.pdf) {
      formData.append('pdf', selectedFile.pdf);
    }

    try {
      const token = fetchToken();
      await axios.put(`${API_URL}/${selectedResource.recurso_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('Recurso actualizado correctamente.');
      setOpenEditDialog(false);
      fetchResources();
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      setSnackbarMessage('Error al actualizar el recurso.');
    }
  };

  const handleDeleteClick = async (resourceId) => {
    try {
      const token = fetchToken();
      await axios.delete(`${API_URL}/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Recurso eliminado correctamente.');
      fetchResources();
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      setSnackbarMessage('Error al eliminar el recurso.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>PDF</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <TableRow key={resource.recurso_id}>
                  <TableCell>{resource.nombre}</TableCell>
                  <TableCell>{resource.descripcion}</TableCell>
                  <TableCell>
                    {resource.imagen_url ? (
                      <a href={resource.imagen_url} target="_blank" rel="noopener noreferrer">
                        Ver Imagen
                      </a>
                    ) : (
                      'No disponible'
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={resource.pdf_url} target="_blank" rel="noopener noreferrer">
                      Descargar PDF
                    </a>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(resource)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(resource.recurso_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron recursos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para editar recurso */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Recurso</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={editData.nombre || ''}
            onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={editData.descripcion || ''}
            onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
          />
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Cambiar Imagen
          </Typography>
          <Button variant="contained" component="label">
            Seleccionar Imagen
            <input type="file" hidden onChange={(e) => setSelectedFile({ ...selectedFile, imagen: e.target.files[0] })} />
          </Button>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Cambiar PDF
          </Typography>
          <Button variant="contained" component="label">
            Seleccionar PDF
            <input type="file" hidden onChange={(e) => setSelectedFile({ ...selectedFile, pdf: e.target.files[0] })} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default AdminResources;
