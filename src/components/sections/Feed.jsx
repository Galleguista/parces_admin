import React, { useState, useEffect } from 'react';
import { Box, Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Container, Grid, TextField, Button } from '@mui/material';
import { Favorite, Share, MoreVert, ChatBubbleOutline, Send } from '@mui/icons-material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/admin/muro`;

const PostCard = ({ post }) => (
  <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
    <CardHeader
      avatar={<Avatar src={post.usuario?.avatar ? `data:image/jpeg;base64,${post.usuario.avatar}` : 'https://via.placeholder.com/40'} sx={{ width: 40, height: 40 }} />}
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{post.usuario?.nombre || 'Anonymous'}</Typography>}
      subheader={<Typography variant="body2" color="textSecondary">{new Date(post.fecha_publicacion).toLocaleString()}</Typography>}
    />
    <CardContent sx={{ paddingTop: 0 }}>
      <Typography variant="body2">
        {post.contenido}
      </Typography>
    </CardContent>
    {post.imagen_url && (
      <Box component="div" sx={{ p: 0, backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
        <img src={`data:image/jpeg;base64,${post.imagen_url}`} alt="" style={{ width: '100%', borderRadius: '0 0 8px 8px' }} />
      </Box>
    )}
    <CardActions disableSpacing sx={{ paddingTop: 0 }}>
      <IconButton aria-label="add to favorites">
        <Favorite fontSize="small" />
      </IconButton>
      <IconButton aria-label="share">
        <Share fontSize="small" />
      </IconButton>
      <IconButton aria-label="comment">
        <ChatBubbleOutline fontSize="small" />
      </IconButton>
    </CardActions>
  </Card>
);

const NewPostCard = ({ onPostCreated, user }) => {
  const [newPost, setNewPost] = useState({ contenido: '', imagen: null });

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
      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated(response.data);
      setNewPost({ contenido: '', imagen: null });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <CardHeader
        avatar={<Avatar src={user?.avatar ? user.avatar : 'https://via.placeholder.com/40'} sx={{ width: 40, height: 40 }} />}
        title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>What's on your mind?</Typography>}
      />
      <CardContent>
        <TextField
          name="contenido"
          multiline
          rows={3}
          variant="outlined"
          placeholder="Write something..."
          fullWidth
          value={newPost.contenido}
          onChange={handleInputChange}
          sx={{ fontSize: '0.875rem' }}
        />
        <input type="file" onChange={handleFileChange} />
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" endIcon={<Send />} onClick={handleCreatePost} sx={{ marginLeft: 'auto', fontSize: '0.875rem' }}>
          Post
        </Button>
      </CardActions>
    </Card>
  );
};

const Feed = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser({
          ...response.data,
          avatar: response.data.avatar ? `data:image/jpeg;base64,${response.data.avatar}` : null,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchPublicaciones = async () => {
      try {
        const response = await axios.get(`${API_URL}/publicaciones`);
        setPublicaciones(response.data);
      } catch (error) {
        console.error('Error fetching publicaciones:', error);
      }
    };

    fetchUser();
    fetchPublicaciones();
  }, []);

  const handlePostCreated = (newPost) => {
    setPublicaciones([newPost, ...publicaciones]);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NewPostCard onPostCreated={handlePostCreated} user={user} />
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
