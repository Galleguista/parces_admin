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

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // Inicializamos como un arreglo vacío
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Obtener el token desde el almacenamiento local
      const response = await axios.get('/usuarios', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Enviamos solo el accessToken
        },
      });

      console.log('Usuarios encontrados:', response.data); // Mostrar los datos recibidos
      setUsers(response.data); // Asumimos que el backend devuelve un arreglo directamente
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setUsers([]); // En caso de error, establecer como un arreglo vacío
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (userId) => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Obtener el token
      await axios.delete(`/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Enviamos solo el accessToken
        },
      });
      setSnackbarMessage('Usuario eliminado correctamente.');
      fetchUsers(); // Actualizar la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      setSnackbarMessage('Error al eliminar el usuario.');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Obtener el token
      const { usuario_id, ...updateData } = editData;
      await axios.put(`/usuarios/${usuario_id}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Enviamos solo el accessToken
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
            {users && users.length > 0 ? (
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
              value={editData.nombre}
              onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Correo Electrónico"
              fullWidth
              value={editData.correo_electronico}
              onChange={(e) => setEditData({ ...editData, correo_electronico: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Celular"
              fullWidth
              value={editData.celular}
              onChange={(e) => setEditData({ ...editData, celular: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Dirección"
              fullWidth
              value={editData.direccion}
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
