import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, Grid, TextField, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/profile/me`;
const UPDATE_PROFILE_URL = `${import.meta.env.VITE_API_URL}/profile/me`;

const initialProfile = {
  nombre: '',
  correo_electronico: '',
  celular: '',
  direccion: '',
  avatar: '',
};

const ProfileSection = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileSettings, setProfileSettings] = useState(initialProfile);
  const [avatarFile, setAvatarFile] = useState(null);
  const token = localStorage.getItem('token'); // Asegúrate de manejar correctamente el token de autenticación

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = {
          ...response.data,
          avatar: response.data.avatar ? `data:image/jpeg;base64,${response.data.avatar}` : '',
        };
        setProfile(profileData);
        setProfileSettings(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (avatarFile) {
        // Convertimos el archivo de imagen a base64 antes de enviarlo
        const reader = new FileReader();
        reader.readAsDataURL(avatarFile);
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1]; // Remover el prefijo data:image/jpeg;base64,
          const formData = {
            ...profileSettings,
            avatar: base64data,
          };
          await sendProfileUpdateRequest(formData);
        };
      } else {
        const formData = {
          ...profileSettings,
        };
        await sendProfileUpdateRequest(formData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const sendProfileUpdateRequest = async (formData) => {
    try {
      const response = await axios.put(UPDATE_PROFILE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Cambia esto para JSON
        },
      });
      
      const profileData = {
        ...response.data,
        avatar: response.data.avatar ? `data:image/jpeg;base64,${response.data.avatar}` : '',
      };
      setProfile(profileData);
      setProfileSettings(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings({ ...profileSettings, [name]: value });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const validateBase64Image = (base64String) => {
    const regex = /^data:image\/(?:jpeg|jpg|png);base64,/;
    return regex.test(base64String);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={validateBase64Image(profile.avatar) ? profile.avatar : 'https://via.placeholder.com/150'}
              alt="Profile Picture"
              sx={{ width: 120, height: 120, border: '4px solid', borderColor: 'primary.main', mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{profile.nombre}</Typography>
            <Typography variant="body1" color="textSecondary">{profile.correo_electronico}</Typography>
            <Typography variant="body1" color="textSecondary">{profile.celular}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{profile.direccion}</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ mt: 2 }}
              onClick={handleEdit}
            >
              Editar Perfil
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Configuración del Perfil</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={profileSettings.nombre}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  name="correo_electronico"
                  value={profileSettings.correo_electronico}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Celular"
                  name="celular"
                  value={profileSettings.celular}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={profileSettings.direccion}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <input type="file" onChange={handleAvatarChange} />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Guardar Cambios
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileSection;
