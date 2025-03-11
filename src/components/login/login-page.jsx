"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
  InputAdornment,
  IconButton,
  Grid,
  Container,
  Link as MuiLink,
  Fade,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { Visibility, VisibilityOff, ArrowForward } from "@mui/icons-material"
import RegisterPage from "./register-page"
import axios from "axios"
import theme from "../../theme"

const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Solicitud al backend para autenticar
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        usuario,
        password,
      })

      const { access_token, refresh_token } = response.data

      // Guardar tokens en localStorage
      localStorage.setItem("token", access_token)
      localStorage.setItem("refresh_token", refresh_token)

      onLogin() // Actualizar estado global de inicio de sesión
      navigate("/admin") // Navegar a la página de administrador
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error.response || error)
      alert("Credenciales inválidas o error en la autenticación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToRegister = () => {
    setShowRegister(true)
  }

  const handleRegisterComplete = () => {
    setShowRegister(false)
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  if (showRegister) {
    return <RegisterPage onRegister={handleRegisterComplete} />
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
        <Grid container sx={{ height: "100%" }}>
          {/* Columna izquierda - Imagen/Fondo */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "relative",
              bgcolor: "#f5f5f5",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0.8,
                backgroundImage: "url(/logo.png)",
                backgroundSize: "60%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "grayscale(100%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: 40,
                zIndex: 2,
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="#333">
                Bienvenido de nuevo
              </Typography>
              <Typography variant="body1" color="#555" sx={{ mt: 1, maxWidth: "80%" }}>
                Accede a tu cuenta para gestionar tu plataforma
              </Typography>
            </Box>
          </Grid>

          {/* Columna derecha - Formulario */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: 3, sm: 6, md: 8 },
            }}
          >
            <Fade in={true} timeout={800}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Logo"
                    sx={{
                      height: 40,
                      mr: 2,
                      display: { xs: "block", md: "none" },
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="500"
                    sx={{
                      letterSpacing: "-0.5px",
                      color: "#222",
                    }}
                  >
                    Iniciar sesión
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </Typography>

                  <TextField
                    fullWidth
                    id="usuario"
                    label="Nombre de Usuario"
                    name="usuario"
                    autoComplete="username"
                    autoFocus
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    margin="normal"
                    variant="standard"
                    sx={{
                      mb: 3,
                      "& .MuiInput-underline:before": { borderBottomColor: "#e0e0e0" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#bdbdbd" },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="standard"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{ color: "#9e9e9e" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 4,
                      "& .MuiInput-underline:before": { borderBottomColor: "#e0e0e0" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#bdbdbd" },
                    }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 0,
                        textTransform: "none",
                        fontWeight: 500,
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      {isLoading ? "Iniciando..." : "Iniciar sesión"}
                    </Button>

                    <MuiLink
                      href="#"
                      underline="hover"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.875rem",
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </MuiLink>
                  </Box>

                  <Box sx={{ mt: 6, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      ¿No tienes una cuenta?{" "}
                      <MuiLink
                        component="button"
                        variant="body2"
                        onClick={handleSwitchToRegister}
                        sx={{
                          fontWeight: 500,
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Crear cuenta
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default LoginPage

