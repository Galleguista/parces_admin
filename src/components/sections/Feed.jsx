import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Favorite, Share, MoreVert, ChatBubbleOutline, Send, Refresh } from '@mui/icons-material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/muro`;
const FILES_URL = `${import.meta.env.VITE_PUBLIC_URL}`;

const PostCard = ({ post }) => (
  <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
    <CardHeader
      avatar={<Avatar src={post.usuario?.avatar ? `${FILES_URL}${post.usuario.avatar}` : 'https://via.placeholder.com/40'} sx={{ width: 40, height: 40 }} />}
      action={
        <IconButton aria-label="opciones">
          <MoreVert />
        </IconButton>
      }
      title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{post.usuario?.nombre || 'Anónimo'}</Typography>}
      subheader={<Typography variant="body2" color="textSecondary">{new Date(post.fecha_publicacion).toLocaleString()}</Typography>}
    />
    <CardContent sx={{ paddingTop: 0 }}>
      <Typography variant="body2">{post.contenido}</Typography>
    </CardContent>
    {post.imagen_url && (
      <Box component="div" sx={{ p: 0, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
        <img src={`${FILES_URL}${post.imagen_url}`} alt="" style={{ width: '100%', borderRadius: '0 0 8px 8px' }} />
      </Box>
    )}
    <CardActions disableSpacing sx={{ paddingTop: 0 }}>
      <IconButton aria-label="Me gusta">
        <Favorite fontSize="small" />
      </IconButton>
      <IconButton aria-label="Compartir">
        <Share fontSize="small" />
      </IconButton>
      <IconButton aria-label="Comentar">
        <ChatBubbleOutline fontSize="small" />
      </IconButton>
    </CardActions>
  </Card>
);

const NewPostCard = ({ onPostCreated, user }) => {
  const [newPost, setNewPost] = useState({ contenido: '', imagen: null });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewPost({ ...newPost, imagen: e.target.files[0] });
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('contenido', newPost.contenido);
    if (newPost.imagen) {
      formData.append('imagen', newPost.imagen);
    }

    try {
      await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated();
      setSnackbarOpen(true); // Mostrar mensaje de éxito
      setNewPost({ contenido: '', imagen: null });
    } catch (error) {
      console.error('Error al crear la publicación:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <CardHeader
          avatar={<Avatar src={user?.avatar ? `${FILES_URL}${user.avatar}` : 'https://via.placeholder.com/40'} sx={{ width: 40, height: 40 }} />}
          title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>¿Qué estás pensando?</Typography>}
        />
        <CardContent>
          <TextField
            name="contenido"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Escribe algo..."
            fullWidth
            value={newPost.contenido}
            onChange={handleInputChange}
            sx={{ fontSize: '0.875rem' }}
          />
          <input type="file" onChange={handleFileChange} />
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" endIcon={<Send />} onClick={handleCreatePost} sx={{ marginLeft: 'auto', fontSize: '0.875rem' }}>
            Publicar
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          ¡Publicación creada con éxito! 🎉
        </Alert>
      </Snackbar>
    </>
  );
};

const Feed = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [user, setUser] = useState(null);

  const fetchPublicaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPublicaciones(response.data);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchUser();
    fetchPublicaciones();

    const interval = setInterval(fetchPublicaciones, 30000); // Refrescar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Muro
        </Typography>
        <IconButton onClick={fetchPublicaciones}>
          <Refresh />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NewPostCard onPostCreated={fetchPublicaciones} user={user} />
        </Grid>
        {publicaciones.map((post) => (
          <Grid item xs={12} key={post.publicacion_id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Feed;
