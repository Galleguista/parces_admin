import React, { useState } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, CssBaseline, Link } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from '../../theme';

const LoginPage = ({ onLogin, onShowRegister }) => {
  const [usuario, setUsuario] = useState(''); // Estado para usuario
  const [password, setPassword] = useState(''); // Estado para contraseña
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log({ usuario, password }); // Asegúrate de que ambos valores estén definidos
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        usuario,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      onLogin();
      navigate('/admin');
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      alert('Credenciales inválidas o error en la autenticación');
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
                <img src="/logo.png" alt="Logo" style={{ width: 100, marginBottom: 16 }} />
                <Typography component="h1" variant="h5">
                  Inicio de Sesión
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="usuario"
                    label="Nombre de Usuario"
                    name="usuario"
                    autoComplete="usuario"
                    autoFocus
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)} // Actualizar el estado del usuario
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
                    onChange={(e) => setPassword(e.target.value)} // Actualizar el estado de la contraseña
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
