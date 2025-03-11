"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  Paper,
  IconButton,
  Fade,
  Tooltip,
  Container,
  Stack,
} from "@mui/material"
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import axios from "axios"

const API_URL = `${import.meta.env.VITE_API_URL}/usuarios/me`
const UPDATE_PROFILE_URL = `${import.meta.env.VITE_API_URL}/usuarios/me`

const initialProfile = {
  nombre: "",
  correo_electronico: "",
  celular: "",
  direccion: "",
  avatarBase64: "",
}

const ProfileSection = () => {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [profileSettings, setProfileSettings] = useState(initialProfile)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const token = localStorage.getItem("token")

  const fetchProfile = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const publicUrl = import.meta.env.VITE_PUBLIC_URL
      const profileData = {
        ...response.data,
        avatarUrl: response.data.avatar ? `${publicUrl}${response.data.avatar}` : "",
      }
      console.log(profileData)
      setProfile(profileData)
      setProfileSettings(profileData)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [token])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfileSettings(profile)
    setAvatarPreview(null)
    setAvatarFile(null)
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("nombre", profileSettings.nombre)
      formData.append("correo_electronico", profileSettings.correo_electronico)
      formData.append("celular", profileSettings.celular)
      formData.append("direccion", profileSettings.direccion)

      if (avatarFile) {
        formData.append("avatar", avatarFile, avatarFile.name)
      }

      console.log("FormData enviado:", formData)

      const response = await axios.put(UPDATE_PROFILE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setIsEditing(false)
      fetchProfile() // Actualizar el perfil después de guardar
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileSettings({ ...profileSettings, [name]: value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)

      // Crear una vista previa del avatar
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Cabecera del perfil */}
          <Box
            sx={{
              p: 4,
              pb: 6,
              position: "relative",
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={profile.avatarUrl ? profile.avatarUrl : "https://via.placeholder.com/150"}
                    alt="Profile Picture"
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid",
                      borderColor: "background.paper",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  {!isEditing && (
                    <Tooltip title="Editar perfil">
                      <IconButton
                        color="primary"
                        onClick={handleEdit}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "background.paper",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "background.paper" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {profile.nombre}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary", fontWeight: 500 }}>
                    @{profile.usuario}
                  </Typography>

                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.correo_electronico}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.celular || "No especificado"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profile.direccion || "No especificada"}
                      </Typography>
                    </Box>
                  </Stack>

                  {!isEditing && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ mt: 3, borderRadius: 1 }}
                    >
                      Editar Perfil
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Formulario de edición */}
          {isEditing && (
            <Fade in={true}>
              <Box sx={{ p: 4, bgcolor: "background.paper" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Editar información de perfil
                  </Typography>
                  <IconButton onClick={handleCancel} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar
                      src={avatarPreview || profile.avatarUrl || "https://via.placeholder.com/150"}
                      alt="Profile Picture"
                      sx={{
                        width: 150,
                        height: 150,
                        mb: 2,
                        border: "4px solid",
                        borderColor: "background.paper",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    />

                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ mt: 2, borderRadius: 1 }}
                    >
                      Cambiar foto
                      <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Nombre completo"
                          name="nombre"
                          value={profileSettings.nombre}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Correo electrónico"
                          name="correo_electronico"
                          value={profileSettings.correo_electronico}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Número de teléfono"
                          name="celular"
                          value={profileSettings.celular}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Dirección"
                          name="direccion"
                          value={profileSettings.direccion}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={handleCancel} sx={{ borderRadius: 1 }}>
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ borderRadius: 1 }}
                    >
                      Guardar cambios
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}
        </Paper>
      </Fade>
    </Container>
  )
}

export default ProfileSection

