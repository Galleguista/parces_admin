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
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'nombre':
        if (!value) {
          errorMessage = 'El nombre es obligatorio';
        }
        break;
      case 'correoElectronico':
        if (!isValidEmail(value)) {
          errorMessage = 'Debe ingresar un correo electrónico válido';
        }
        break;
      case 'password':
        if (!isValidPassword(value)) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre') setNombre(value);
    if (name === 'correoElectronico') setCorreoElectronico(value);
    if (name === 'password') setPassword(value);
    if (name === 'celular') setCelular(value);
    if (name === 'direccion') setDireccion(value);

    validateField(name, value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!isValidEmail(correoElectronico)) {
      newErrors.correoElectronico = 'Debe ingresar un correo electrónico válido';
    }
    if (!isValidPassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const status = true;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/register`, {
        nombre,
        correo_electronico: correoElectronico,
        password,
        celular,
        status,
        direccion,
      });

      if (response.data.success) {
        onRegister();
        setOpen(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      alert('Error durante el registro. Verifique su información o intente nuevamente.');
    }
  };

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
                    value={nombre}
                    onChange={handleChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="correoElectronico"
                    label="Correo Electrónico"
                    name="correoElectronico"
                    autoComplete="email"
                    value={correoElectronico}
                    onChange={handleChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
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
                    value={password}
                    onChange={handleChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="celular"
                    label="Celular"
                    name="celular"
                    autoComplete="celular"
                    value={celular}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="direccion"
                    label="Dirección"
                    name="direccion"
                    autoComplete="direccion"
                    value={direccion}
                    onChange={handleChange}
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
