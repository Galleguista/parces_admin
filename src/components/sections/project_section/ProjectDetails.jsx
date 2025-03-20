"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Button,
  Alert,
  Tabs,
  Tab,
  TextField,
  Grid,
  Paper,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import {
  Edit,
  Info,
  People,
  Nature,
  ContactMail,
  AttachFile,
  LocationOn,
  HowToVote,
  Close,
  Description,
  AccessTime,
  Group,
  Handshake,
  Email,
  Phone,
  InsertDriveFile,
  PictureAsPdf,
  Image as ImageIcon,
  Article,
} from "@mui/icons-material"
import axios from "axios"
import ProjectMembers from "./ProjectMembers"
import ProjectLog from "./ProjectLog"
import ProjectPostulations from "./ProjectPostulations"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
})

const ProjectDetails = ({ project, onClose, onUpdateProject }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState({ ...project })
  const [errorAlert, setErrorAlert] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    setEditedProject({ ...project })
  }, [project])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedProject({ ...editedProject, [name]: value })
  }

  const updateProject = async (updatedProject) => {
    try {
      const response = await instance.put(`/proyectos/${updatedProject.proyecto_id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error)
      throw error
    }
  }

  const handleSaveChanges = async () => {
    try {
      const updatedProject = await updateProject(editedProject)
      setIsEditing(false)
      onUpdateProject(updatedProject)
      setErrorAlert(false)
    } catch (error) {
      setErrorAlert(true)
    }
  }

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translate(-50%, 0)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f8f9fa",
        },
      }}
    >
      {errorAlert && (
        <Alert
          severity="error"
          onClose={() => setErrorAlert(false)}
          sx={{
            mb: 0,
            borderRadius: 0,
            "& .MuiAlert-icon": { color: "#f44336" },
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          No tienes permiso para realizar esta acción.
        </Alert>
      )}

      <DialogTitle
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          py: 2,
          px: 3,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="600" noWrap sx={{ maxWidth: "80%" }}>
            {project.nombre}
          </Typography>
          <Box>
            <Tooltip title="Editar proyecto">
              <IconButton
                onClick={() => setIsEditing(!isEditing)}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                  mr: 1,
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar">
              <IconButton
                onClick={onClose}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <Box sx={{ bgcolor: "background.paper", px: 3, pb: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              color: "text.secondary",
              "&.Mui-selected": { color: "primary.main" },
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
              height: 2,
            },
          }}
        >
          <Tab label="Información" icon={<Info />} iconPosition="start" />
          <Tab label="Miembros" icon={<People />} iconPosition="start" />
          <Tab label="Bitácora" icon={<Nature />} iconPosition="start" />
          <Tab label="Postulaciones" icon={<HowToVote />} iconPosition="start" />
        </Tabs>
      </Box>

      <DialogContent sx={{ flex: 1, overflow: "auto", p: 3, bgcolor: "background.default" }}>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  mb: 1,
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  <Description sx={{ mr: 1.5, color: "primary.main" }} />
                  Información Básica
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Nombre:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="nombre"
                        value={editedProject.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.nombre}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Descripción:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="descripcion"
                        value={editedProject.descripcion}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.descripcion}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Objetivos:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="objetivos"
                        value={editedProject.objetivos}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.objetivos}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Detalles del Proyecto */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "success.main",
                    fontWeight: 600,
                  }}
                >
                  <Nature sx={{ mr: 1.5, color: "success.main" }} />
                  Detalles del Proyecto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <LocationOn sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Tamaño del Terreno:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="tamano_terreno"
                            value={editedProject.tamano_terreno}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.tamano_terreno}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <AccessTime sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Duración:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="duracion_proyecto"
                            value={editedProject.duracion_proyecto}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.duracion_proyecto}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Group sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Participantes Esperados:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="numero_participantes"
                            value={editedProject.numero_participantes}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.numero_participantes}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Participación y Recursos */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "secondary.main",
                    fontWeight: 600,
                  }}
                >
                  <People sx={{ mr: 1.5, color: "secondary.main" }} />
                  Participación y Recursos
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Aportes Esperados:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="aportes_participantes"
                        value={editedProject.aportes_participantes}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.aportes_participantes}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Recursos Disponibles:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="recursos_disponibles"
                        value={editedProject.recursos_disponibles}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.recursos_disponibles}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Modalidad de Aparcería */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  <Handshake sx={{ mr: 1.5, color: "primary.main" }} />
                  Modalidad de Aparcería
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Modalidad:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="modalidad_participacion"
                        value={editedProject.modalidad_participacion}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.modalidad_participacion}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Modelo de Reparto:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        name="modelo_reparto"
                        value={editedProject.modelo_reparto}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                        {project.modelo_reparto}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Contacto y Publicación */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "info.main",
                    fontWeight: 600,
                  }}
                >
                  <ContactMail sx={{ mr: 1.5, color: "info.main" }} />
                  Contacto y Publicación
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <People sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Nombre del Encargado:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="nombre_encargado"
                            value={editedProject.nombre_encargado}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.nombre_encargado}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <Email sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Correo Electrónico:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="correo_contacto"
                            value={editedProject.correo_contacto}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.correo_contacto}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <Phone sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Teléfono:
                        </Typography>
                        {isEditing ? (
                          <TextField
                            name="telefono_contacto"
                            value={editedProject.telefono_contacto}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{project.telefono_contacto}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={editedProject.publicar_comunidad || false}
                            onChange={() =>
                              setEditedProject({
                                ...editedProject,
                                publicar_comunidad: !editedProject.publicar_comunidad,
                              })
                            }
                            color="primary"
                          />
                        }
                        label={<Typography fontWeight={500}>Publicar mi proyecto</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={editedProject.aceptar_terminos || false}
                            onChange={() =>
                              setEditedProject({ ...editedProject, aceptar_terminos: !editedProject.aceptar_terminos })
                            }
                            color="primary"
                          />
                        }
                        label={<Typography fontWeight={500}>Acepto los términos y condiciones</Typography>}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Archivos Relacionados */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  padding: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: "warning.main",
                    fontWeight: 600,
                  }}
                >
                  <AttachFile sx={{ mr: 1.5, color: "warning.main" }} />
                  Archivos Relacionados
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {(Array.isArray(project.documentos_relevantes) ? project.documentos_relevantes : []).length > 0 ? (
                    (Array.isArray(project.documentos_relevantes) ? project.documentos_relevantes : []).map(
                      (file, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            padding: 1.5,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            transition: "all 0.2s",
                            "&:hover": {
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              bgcolor: "rgba(0, 0, 0, 0.01)",
                            },
                          }}
                        >
                          <Tooltip title="Descargar archivo">
                            <IconButton size="small" sx={{ mr: 1 }}>
                              {file.type?.includes("pdf") ? (
                                <PictureAsPdf color="error" />
                              ) : file.type?.includes("image") ? (
                                <ImageIcon color="primary" />
                              ) : file.type?.includes("word") || file.type?.includes("document") ? (
                                <Article color="info" />
                              ) : (
                                <InsertDriveFile color="action" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                        </Paper>
                      ),
                    )
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", ml: 2 }}>
                      No hay archivos adjuntos
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
        {tabValue === 1 && (
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <ProjectMembers projectId={project.proyecto_id} />
          </Paper>
        )}
        {tabValue === 2 && (
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <ProjectLog projectId={project.proyecto_id} />
          </Paper>
        )}
        {tabValue === 3 && (
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
              height: "100%",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <ProjectPostulations projectId={project.proyecto_id} projectOwnerId={project.usuario_id} />
          </Paper>
        )}
      </DialogContent>

      {isEditing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            px: 3,
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
            boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.05)",
            zIndex: 10,
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{
              width: "100%",
              py: 1.2,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            startIcon={<Edit />}
          >
            Guardar Cambios
          </Button>
        </Box>
      )}
    </Dialog>
  )
}

export default ProjectDetails

