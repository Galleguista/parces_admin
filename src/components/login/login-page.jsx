import React, { useState } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import RegisterPage from './register-page';
import theme from '../../theme';

const LoginPage = ({ onLogin, onShowRegister }) => {
  const [usuario, setUsuario] = useState(''); // Estado para usuario
  const [password, setPassword] = useState(''); // Estado para contraseña
  const [showRegister, setShowRegister] = useState(false); // Estado para mostrar la vista de registro

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        onLogin();
      } else {
        alert('Credenciales inválidas o error en la autenticación');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
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
                      onClick={handleSwitchToRegister}
                    >
                      ¿No tienes una cuenta? Crea una
                    </Typography>
                  </Box>
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
