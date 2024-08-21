import React, { useState } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Avatar, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const theme = createTheme();

const RegisterPage = ({ onRegister }) => {
  const [nombre, setNombre] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const status = true; // Asignar status por defecto
    console.log('Register attempt with:', { nombre, correoElectronico, password, celular, status, direccion });
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/register`, {
        nombre,
        correo_electronico: correoElectronico,
        password,
        celular,
        status,
        direccion,
      });
      console.log('Response from backend:', response);
      onRegister();
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed');
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
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
