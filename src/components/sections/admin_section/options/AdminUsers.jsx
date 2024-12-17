import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Respuesta del servidor:', response.data);

      const data = response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users); 
      } else {
        console.error('La respuesta no contiene un arreglo válido.');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setUsers([]);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (userId) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Usuario eliminado correctamente.');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setSnackbarMessage('Error al eliminar el usuario.');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const { usuario_id, ...updateData } = editData;
      await axios.put(`${API_URL}/${usuario_id}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Usuario actualizado correctamente.');
      fetchUsers();
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setSnackbarMessage('Error al actualizar el usuario.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.usuario_id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.correo_electronico}</TableCell>
                  <TableCell>{user.celular}</TableCell>
                  <TableCell>{user.direccion}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 1 }}
                      onClick={() => handleDeleteClick(user.usuario_id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición */}
      {openEditDialog && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Usuario</DialogTitle>
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
              label="Correo Electrónico"
              fullWidth
              value={editData.correo_electronico || ''}
              onChange={(e) =>
                setEditData({ ...editData, correo_electronico: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Celular"
              fullWidth
              value={editData.celular || ''}
              onChange={(e) => setEditData({ ...editData, celular: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Dirección"
              fullWidth
              value={editData.direccion || ''}
              onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
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
      )}

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

export default AdminUsers;
