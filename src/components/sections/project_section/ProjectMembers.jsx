import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { Add, Search, Delete } from '@mui/icons-material';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

const ProjectMembers = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Cargar miembros del proyecto al montar el componente
  useEffect(() => {
    const fetchProjectMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await instance.get(`/proyectos/${projectId}/miembros`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjectMembers(response.data.miembros);
      } catch (err) {
        setError('Error al cargar los miembros del proyecto.');
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchProjectMembers();
  }, [projectId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa un término de búsqueda');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get(`/usuarios/search`, {
        params: { query: searchQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.length === 0) {
        setError('No se encontraron usuarios con ese término');
      }
      setSearchResults(response.data);
    } catch (err) {
      setError('Error al buscar usuarios. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (usuarioId) => {
    try {
      await instance.post(
        `/proyectos/${projectId}/miembro`,
        { usuario_id: usuarioId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccessMessage('Miembro añadido exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Actualizar la lista de miembros
      setProjectMembers((prev) => [...prev, searchResults.find((user) => user.usuario_id === usuarioId)]);
    } catch (err) {
      setError('No se pudo añadir el miembro. Verifica tus permisos.');
    }
  };

  const handleRemoveMember = async (usuarioId) => {
    try {
      await instance.delete(`/proyectos/${projectId}/miembro/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage('Miembro eliminado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Actualizar la lista de miembros
      setProjectMembers((prev) => prev.filter((member) => member.usuario_id !== usuarioId));
    } catch (err) {
      setError('No se pudo eliminar al miembro. Verifica tus permisos.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Miembros del Proyecto
      </Typography>
      {isLoadingMembers && <CircularProgress />}
      {!isLoadingMembers && projectMembers.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 2 }}>
          No hay miembros en este proyecto.
        </Typography>
      )}
      <List>
        {projectMembers.map((member) => (
          <Paper elevation={2} sx={{ mb: 1 }} key={member.usuario_id}>
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar src={member.avatar || 'https://via.placeholder.com/150'} alt={member.nombre} />
                </ListItemAvatar>
                <ListItemText primary={member.nombre} />
              </Box>
              <IconButton
                onClick={() => handleRemoveMember(member.usuario_id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Añadir Nuevos Miembros
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar usuarios"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ minWidth: '56px', height: '56px' }}
        >
          <Search />
        </Button>
      </Box>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <List>
        {searchResults.map((user) => (
          <Paper elevation={2} sx={{ mb: 1 }} key={user.usuario_id}>
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar src={user.avatar || 'https://via.placeholder.com/150'} alt={user.nombre} />
                </ListItemAvatar>
                <ListItemText primary={user.nombre} />
              </Box>
              <IconButton
                onClick={() => handleAddMember(user.usuario_id)}
                color="primary"
              >
                <Add />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ProjectMembers;
