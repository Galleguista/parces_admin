import React, { useState } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Avatar, CssBaseline, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from '../../theme';

const LoginPage = ({ onLogin, onShowRegister }) => {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Intento de inicio de sesión con:', { correoElectronico, password });
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        correo_electronico: correoElectronico,
        password: password,
      });
      console.log('Respuesta del backend:', response);
      const { access_token } = response.data;
      console.log('Token de acceso recibido:', access_token);
      localStorage.setItem('token', access_token);
      onLogin();
      navigate('/admin');
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      alert('Credenciales inválidas');
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
                <img src="/logo.png" alt="Logo" style={{ width: 100, marginBottom: 16 }} /> {/* Logo desde la carpeta public */}
                <Typography component="h1" variant="h5">
                  Inicio de Sesión
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="correoElectronico"
                    label="Correo Electrónico"
                    name="correoElectronico"
                    autoComplete="email"
                    autoFocus
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Link href="/register" variant="body2" onClick={onShowRegister}>
                    {"¿No tienes una cuenta? Crea una"}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
