import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Avatar, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import theme from '../../theme';

const RegisterPage = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    correoElectronico: '',
    password: '',
    confirmPassword: '',
    celular: '',
    direccion: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordChecklist, setPasswordChecklist] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const checklist = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordChecklist(checklist);
    return Object.values(checklist).every(Boolean);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'nombre':
        if (!value) {
          errorMessage = 'El nombre es obligatorio';
        }
        break;
      case 'usuario':
        if (!value) {
          errorMessage = 'El nombre de usuario es obligatorio';
        }
        break;
      case 'correoElectronico':
        if (!isValidEmail(value)) {
          errorMessage = 'Debe ingresar un correo electrónico válido';
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          errorMessage = 'La contraseña no cumple con los requisitos';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errorMessage = 'Las contraseñas no coinciden';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        newErrors[field] = errors[field];
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/register`, {
        nombre: formData.nombre,
        usuario: formData.usuario,
        correo_electronico: formData.correoElectronico,
        password: formData.password,
        celular: null,
        direccion: null,
        status: true,
      });

      if (response.data.success) {
        alert('Registro exitoso');

        // Inicia sesión automáticamente usando las credenciales proporcionadas
        const loginResponse = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          usuario: formData.usuario,
          password: formData.password,
        });

        const { access_token, refresh_token } = loginResponse.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        onRegister(); // Actualizar el estado de login en la app principal
        navigate('/admin'); // Redirigir al admin directamente
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      alert('Error durante el registro. Verifique su información o intente nuevamente.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card sx={{ mt: 8, width: '100%', boxShadow: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Registro
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nombre"
                    label="Nombre"
                    name="nombre"
                    autoComplete="nombre"
                    autoFocus
                    value={formData.nombre}
                    onChange={handleChange}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="usuario"
                    label="Nombre de Usuario"
                    name="usuario"
                    autoComplete="username"
                    value={formData.usuario}
                    onChange={handleChange}
                    error={!!errors.usuario}
                    helperText={errors.usuario}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="correoElectronico"
                    label="Correo Electrónico"
                    name="correoElectronico"
                    autoComplete="email"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <Box sx={{ mt: 1, textAlign: 'left', fontSize: '0.9rem' }}>
                    <Typography color={passwordChecklist.length ? 'green' : 'red'}>✔ Al menos 8 caracteres</Typography>
                    <Typography color={passwordChecklist.uppercase ? 'green' : 'red'}>✔ Una letra mayúscula</Typography>
                    <Typography color={passwordChecklist.number ? 'green' : 'red'}>✔ Un número</Typography>
                    <Typography color={passwordChecklist.specialChar ? 'green' : 'red'}>✔ Un carácter especial</Typography>
                  </Box>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Registrarse
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
