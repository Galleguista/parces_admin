import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Container,
  Pagination,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

const ForumSection = () => {
  const [forums, setForums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [newForum, setNewForum] = useState({ nombre: '', descripcion: '' });
  const forosPorPagina = 9;

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await instance.get('/foros', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setForums(response.data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const handleUnirseForo = async (forum) => {
    try {
      await instance.put(
        `/foros/${forum.foro_id}/unirse`,
        {}, // No enviamos user_id
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert(`Te has unido al foro: ${forum.nombre}`);
    } catch (error) {
      console.error('Error al unirse al foro:', error);
      alert('No se pudo completar la solicitud para unirse al foro.');
    }
  };
  

  const handleCreateForum = async () => {
    if (!newForum.nombre.trim() || !newForum.descripcion.trim()) return;
    try {
      const response = await instance.post('/foros/create', newForum, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setForums([response.data, ...forums]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const handleForumInputChange = (e) => {
    const { name, value } = e.target;
    setNewForum({ ...newForum, [name]: value });
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewForum({ nombre: '', descripcion: '' });
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  // Calcular los foros mostrados por página
  const indexOfLastForum = currentPage * forosPorPagina;
  const indexOfFirstForum = indexOfLastForum - forosPorPagina;
  const currentForums = forums.slice(indexOfFirstForum, indexOfLastForum);

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Foros
        </Typography>
        <Grid container spacing={3}>
          {currentForums.map((forum) => (
            <Grid item xs={12} sm={6} md={4} key={forum.foro_id}>
              <Card
                sx={{
                  borderRadius: 6,
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                }}
              >
                <Box display="flex" alignItems="center" p={1}>
                  <Avatar
                    sx={{
                      bgcolor: '#5C9EFA',
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    <ChatBubbleOutlineIcon sx={{ color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{forum.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {forum.descripcion}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleUnirseForo(forum)}
                >
                  Unirse
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(forums.length / forosPorPagina)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>

      {/* Botón flotante para crear foros */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo de creación de foro */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Crear Nuevo Foro</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Foro"
            name="nombre"
            value={newForum.nombre}
            onChange={handleForumInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Descripción"
            name="descripcion"
            value={newForum.descripcion}
            onChange={handleForumInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleCreateForum} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ForumSection;
