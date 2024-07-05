import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, Grid, TextField, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users/me`;
const UPDATE_PROFILE_URL = `${import.meta.env.VITE_API_URL}/users/me`;

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
    console.log("API URL:", API_URL); // Verifica que la variable de entorno se esté cargando correctamente
    const fetchProfile = async () => {
      console.log('Fetching profile with token:', token);
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profile fetched successfully:', response.data);
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
    console.log('Saving profile settings:', profileSettings);
    try {
      const formData = new FormData();
      formData.append('nombre', profileSettings.nombre);
      formData.append('correo_electronico', profileSettings.correo_electronico);
      formData.append('celular', profileSettings.celular);
      formData.append('direccion', profileSettings.direccion);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await axios.put(UPDATE_PROFILE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile updated successfully:', response.data);
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
    console.log(`Changing profile setting ${name} to ${value}`);
    setProfileSettings({ ...profileSettings, [name]: value });
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={profile.avatar || 'https://via.placeholder.com/150'}
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
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Profile Settings</Typography>
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
                  Save Changes
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
