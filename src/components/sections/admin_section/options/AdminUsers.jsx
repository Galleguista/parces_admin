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
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as VpnKeyIcon,
  GroupAdd as GroupAddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openManageRolesDialog, setOpenManageRolesDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(`${API_URL}/usuarios/${selectedUser.usuario_id}`, selectedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Usuario actualizado correctamente.');
      setOpenEditDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      setSnackbarMessage('Error al actualizar el usuario.');
    }
  };

  const handleDeleteClick = async (userId) => {
    const userToDelete = users.find((user) => user.usuario_id === userId);
  
    if (userToDelete?.roles?.length > 0) {
      setSnackbarMessage('Primero debes eliminar los roles asignados al usuario antes de eliminarlo.');
      return;
    }
  
    try {
      const accessToken = localStorage.getItem('token');
      await axios.delete(`${API_URL}/usuarios/${userId}`, {
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
  
  const handleManageRolesClick = (user) => {
    setSelectedUser(user);
    setOpenManageRolesDialog(true);
  };

  const handleAssignRole = async () => {
    try {
      const data = {
        user_id: selectedUser.usuario_id,
        role_id: selectedRole,
      };
      await axios.post(`${API_URL}/user-roles`, data);
      setSnackbarMessage('Rol asignado correctamente.');
      fetchUsers();
    } catch (error) {
      console.error('Error al asignar rol:', error);
      setSnackbarMessage('Error al asignar rol.');
    }
  };

  const handleRemoveRole = async (userolId) => {
    try {
      const accessToken = localStorage.getItem('token');
      await axios.delete(`${API_URL}/user-roles/${userolId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Rol eliminado correctamente.');
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      setSnackbarMessage('Error al eliminar el rol.');
    }
  };
  
  const handleUpdatePasswordClick = (user) => {
    setSelectedUser(user);
    setOpenPasswordDialog(true);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSnackbarMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const accessToken = localStorage.getItem('token');
      await axios.put(`${API_URL}/usuarios/${selectedUser.usuario_id}/password`, {
        password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Contraseña actualizada correctamente.');
      setOpenPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      setSnackbarMessage('Error al actualizar la contraseña.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage('');
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 2, width: '100%' }}>

      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.usuario_id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.usuario}</TableCell>
                  <TableCell>{user.correo_electronico}</TableCell>
                  <TableCell>
                    {user.roles && user.roles.length > 0
                      ? user.roles.map((role) => (
                          <Box key={role.userol_id} sx={{ display: 'flex', alignItems: 'center' }}>
                            {role.role_name}
                            <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => handleRemoveRole(role.userol_id)} title="Eliminar rol">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))
                      : 'Sin roles'}
                  </TableCell>
                  <TableCell>
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => handleEditClick(user)} title="Editar usuario">
                      <EditIcon />
                    </IconButton>
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => handleDeleteClick(user.usuario_id)} title="Eliminar usuario">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => handleManageRolesClick(user)} title="Asignar/Quitar roles">
                      <GroupAddIcon />
                    </IconButton>
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => handleUpdatePasswordClick(user)} title="Cambiar contraseña">
                      <VpnKeyIcon />
                    </IconButton>
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

      {/* Diálogo para editar usuario */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={selectedUser?.nombre || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Usuario"
            fullWidth
            value={selectedUser?.usuario || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, usuario: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            fullWidth
            value={selectedUser?.correo_electronico || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, correo_electronico: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </IconButton>
          <IconButton onClick={handleEditSubmit} color="primary">
            Guardar
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo para gestionar roles */}
      <Dialog open={openManageRolesDialog} onClose={() => setOpenManageRolesDialog(false)}>
        <DialogTitle>Roles de {selectedUser?.nombre}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Roles actuales:</Typography>
          {selectedUser?.roles?.length > 0 ? (
            selectedUser.roles.map((role) => (
              <Box key={role.userol_id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flexGrow: 1 }}>{role.role_name}</Typography>
                <IconButton onClick={() => handleRemoveRole(role.userol_id)} color="secondary" title="Eliminar rol">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography>No tiene roles asignados.</Typography>
          )}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Agregar nuevo rol:</Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Rol</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenManageRolesDialog(false)} color="secondary">
            Cerrar
          </IconButton>
          <IconButton onClick={handleAssignRole} color="primary">
            Guardar
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Diálogo para actualizar contraseña */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Actualizar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nueva Contraseña"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirmar Contraseña"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOpenPasswordDialog(false)} color="secondary">
            Cancelar
          </IconButton>
          <IconButton onClick={handleUpdatePassword} color="primary">
            Guardar
          </IconButton>
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

export default AdminUsers;
