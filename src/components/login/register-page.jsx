import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Avatar, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import theme from '../../theme';

const RegisterPage = ({ onRegister }) => {
  const [nombre, setNombre] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errors, setErrors] = useState({});  // Estado para los errores de validación
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Validación simple para el correo
  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Validación de contraseña (ejemplo: al menos 6 caracteres)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones previas en el frontend
    let newErrors = {};
    if (!nombre) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!isValidEmail(correoElectronico)) {
      newErrors.correoElectronico = "Debe ingresar un correo electrónico válido";
    }
    if (!isValidPassword(password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const status = true;  // Omitimos cualquier lógica de verificación y asumimos que el usuario está activo por defecto
    console.log('Register attempt with:', { nombre, correoElectronico, password, celular, status, direccion });

    try {
      // Enviar la solicitud al backend para registro
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/register`, {
        nombre,
        correo_electronico: correoElectronico,
        password,
        celular,
        status,
        direccion,
      });

      if (response.data.success) {
        console.log('Response from backend:', response);
        onRegister();
        setOpen(true);
      } else {
        alert('No se pudo completar el registro. Verifique sus datos.');
      }

    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error durante el registro. Verifique su información o intente nuevamente.');
    }
  };

  // Función para cerrar el modal y redirigir al login
  const handleClose = () => {
    setOpen(false);
    navigate('/login');
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
                  Register
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nombre"
                    label="Name"
                    name="nombre"
                    autoComplete="nombre"
                    autoFocus
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="correoElectronico"
                    label="Email Address"
                    name="correoElectronico"
                    autoComplete="email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="celular"
                    label="Phone"
                    name="celular"
                    autoComplete="celular"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="direccion"
                    label="Address"
                    name="direccion"
                    autoComplete="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Register
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Ventana Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <IconButton>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ textAlign: 'center' }}>
              Te has registrado correctamente, ahora inicia sesión.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary" fullWidth>
              Iniciar sesión
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
