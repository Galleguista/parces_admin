import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Container, Box, Card, CardContent, TextField, Button, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import RegisterPage from './register-page'; // Importa el formulario de registro
import axios from 'axios';
import theme from '../../theme';

const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false); 
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Solicitud al backend para autenticar
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        usuario,
        password,
      });

      const { access_token, refresh_token } = response.data;

      // Guardar tokens en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      onLogin(); // Actualizar estado global de inicio de sesión
      navigate('/admin'); // Navegar a la página de administrador
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error.response || error);
      alert('Credenciales inválidas o error en la autenticación');
    }
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true); // Cambiar a la vista de registro
  };

  const handleRegisterComplete = () => {
    setShowRegister(false); // Volver a la vista de inicio de sesión después del registro
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        {showRegister ? (
          // Mostrar el componente de registro
          <RegisterPage onRegister={handleRegisterComplete} />
        ) : (
          // Mostrar el componente de inicio de sesión
          <Box
            component="form"
            onSubmit={handleLogin}
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
                    onChange={(e) => setUsuario(e.target.value)}
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
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: 'primary.main',
                      mt: 2,
                    }}
                    onClick={handleSwitchToRegister} // Llama a la función para mostrar el registro
                  >
                    ¿No tienes una cuenta? Crea una
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
