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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Button,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/proyectos`;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      setSnackbarMessage('Error al cargar los proyectos.');
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditData({ ...project });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_URL}/${selectedProject.proyecto_id}`, editData);
      setSnackbarMessage('Proyecto actualizado correctamente.');
      setOpenEditDialog(false);
      fetchProjects();
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      setSnackbarMessage('Error al actualizar el proyecto.');
    }
  };

  const handleDeleteClick = async (projectId) => {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      setSnackbarMessage('Proyecto eliminado correctamente.');
      fetchProjects();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      setSnackbarMessage('Error al eliminar el proyecto.');
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
              <TableCell>Ubicación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.proyecto_id}>
                  <TableCell>{project.nombre}</TableCell>
                  <TableCell>{project.descripcion}</TableCell>
                  <TableCell>{project.ubicacion}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(project.proyecto_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron proyectos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para editar proyecto */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Proyecto</DialogTitle>
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
          <TextField
            margin="dense"
            label="Ubicación"
            fullWidth
            value={editData.ubicacion || ''}
            onChange={(e) => setEditData({ ...editData, ubicacion: e.target.value })}
          />
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

export default AdminProjects;
