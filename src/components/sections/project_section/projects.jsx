"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Container,
  TextField,
  Box,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Tooltip,
  Avatar,
  Paper,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  Tabs,
  Tab,
  Badge,
  Skeleton,
} from "@mui/material"

import AddIcon from "@mui/icons-material/Add"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import NaturePeopleIcon from "@mui/icons-material/NaturePeople"
import AgricultureIcon from "@mui/icons-material/Agriculture"
import PetsIcon from "@mui/icons-material/Pets"
import WaterIcon from "@mui/icons-material/Water"
import ParkIcon from "@mui/icons-material/Park"
import SearchIcon from "@mui/icons-material/Search"
import TuneIcon from "@mui/icons-material/Tune"
import CloseIcon from "@mui/icons-material/Close"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CategoryIcon from "@mui/icons-material/Category"
import SortIcon from "@mui/icons-material/Sort"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ViewListIcon from "@mui/icons-material/ViewList"
import ProjectForm from "./ProjectForm"
import ProjectDetails from "./ProjectDetails"

const iconMap = {
  NaturePeopleIcon: <NaturePeopleIcon />,
  AgricultureIcon: <AgricultureIcon />,
  PetsIcon: <PetsIcon />,
  WaterIcon: <WaterIcon />,
  ParkIcon: <ParkIcon />,
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ location: "", category: "", relevance: "" })
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchProjects()
    } else {
      console.error("No se encontró el token")
      setLoading(false)
    }
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await instance.get("/proyectos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setProjects(response.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdateProject = async (projectData) => {
    try {
      if (selectedProject) {
        const response = await instance.put(`/proyectos/${selectedProject.proyecto_id}`, projectData)
        setProjects((prevProjects) =>
          prevProjects.map((proj) => (proj.proyecto_id === selectedProject.proyecto_id ? response.data : proj)),
        )
      } else {
        const response = await instance.post("/proyectos/create", projectData)
        setProjects([...projects, response.data])
      }
      handleClose()
    } catch (error) {
      console.error("Error creating or updating project:", error)
    }
  }

  const handleClickOpen = () => {
    setSelectedProject(null)
    setOpen(true)
  }

  const handleEditProject = (project) => {
    setSelectedProject(project)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedProject(null)
  }

  const handleClearFilters = () => {
    setFilters({ location: "", category: "", relevance: "" })
    setSearchTerm("")
    setDrawerOpen(false)
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  // Filtrar proyectos según búsqueda y filtros
  const getFilteredProjects = () => {
    let filtered = projects.filter(
      (project) =>
        project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.location ? project.ubicacion === filters.location : true) &&
        (filters.category ? project.categoria === filters.category : true),
    )

    // Filtrar por pestaña seleccionada
    if (tabValue === 1) {
      // Aquí podrías filtrar por proyectos favoritos si tuvieras esa información
      filtered = filtered.slice(0, Math.floor(filtered.length / 2)) // Simulación
    } else if (tabValue === 2) {
      // Aquí podrías filtrar por proyectos recientes
      filtered = filtered.slice(Math.floor(filtered.length / 2)) // Simulación
    }

    return filtered
  }

  const filteredProjects = getFilteredProjects()

  // Renderizar tarjeta de proyecto en modo grid
  const renderGridCard = (project) => (
    <Card
      onClick={() => handleEditProject(project)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
        },
        cursor: "pointer",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          height: 140,
          position: "relative",
          bgcolor: theme.palette.grey[100],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.primary.main,
          }}
        >
          {iconMap[project.icono] || <NaturePeopleIcon />}
        </Avatar>

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Chip
            label={project.categoria}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              bgcolor: theme.palette.background.paper,
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.nombre}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            {project.ubicacion}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
            fontSize: "0.8rem",
            lineHeight: 1.4,
          }}
        >
          {project.descripcion}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderTop: "1px solid",
          borderColor: theme.palette.divider,
        }}
      >
        <Tooltip title="Me gusta">
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <FavoriteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Compartir">
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Más opciones">
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )

  // Renderizar tarjeta de proyecto en modo lista
  const renderListCard = (project) => (
    <Card
      onClick={() => handleEditProject(project)}
      sx={{
        display: "flex",
        borderRadius: 1,
        mb: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
        cursor: "pointer",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.grey[50],
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.primary.main,
          }}
        >
          {iconMap[project.icono] || <NaturePeopleIcon />}
        </Avatar>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto", py: 1.5, px: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
                {project.nombre}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {project.ubicacion}
                </Typography>
                <Chip
                  label={project.categoria}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex" }}>
              <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                <ShareIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {!isMobile && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.8rem",
              }}
            >
              {project.descripcion}
            </Typography>
          )}
        </CardContent>
      </Box>
    </Card>
  )

  // Renderizar esqueletos de carga
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ height: "100%", borderRadius: 1 }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="100%" height={16} />
            </CardContent>
            <CardActions sx={{ px: 2, py: 1 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </CardActions>
          </Card>
        </Grid>
      ))
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Barra superior */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <TextField
            placeholder="Buscar proyectos..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 1 },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={toggleDrawer}
            size="small"
            sx={{
              borderRadius: 1,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              "&:hover": { borderColor: theme.palette.text.primary },
            }}
          >
            Filtros
          </Button>

          <Tooltip title={viewMode === "grid" ? "Vista de lista" : "Vista de cuadrícula"}>
            <IconButton
              onClick={toggleViewMode}
              sx={{
                border: 1,
                borderColor: theme.palette.divider,
                borderRadius: 1,
              }}
            >
              {viewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            size="small"
            sx={{
              borderRadius: 1,
              display: { xs: "none", sm: "flex" },
            }}
          >
            Nuevo
          </Button>
        </Box>
      </Paper>

      {/* Pestañas */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 1,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Todos" />
          <Tab
            label={
              <Badge badgeContent={Math.floor(projects.length / 2)} color="primary" max={99}>
                Favoritos
              </Badge>
            }
          />
          <Tab label="Recientes" />
        </Tabs>
      </Paper>

      {/* Contenido principal */}
      {loading ? (
        <Grid container spacing={2}>
          {renderSkeletons()}
        </Grid>
      ) : filteredProjects.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No se encontraron proyectos
          </Typography>
          <Button variant="contained" onClick={handleClickOpen} startIcon={<AddIcon />} sx={{ borderRadius: 1 }}>
            Crear nuevo proyecto
          </Button>
        </Paper>
      ) : viewMode === "grid" ? (
        <Grid container spacing={2}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.proyecto_id}>
              {renderGridCard(project)}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {filteredProjects.map((project) => (
            <Box key={project.proyecto_id} sx={{ "&:not(:last-child)": { borderBottom: 1, borderColor: "divider" } }}>
              {renderListCard(project)}
            </Box>
          ))}
        </Paper>
      )}

      {/* Botón flotante en móvil */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Drawer de filtros */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 320 } },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Filtros
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Ubicación</InputLabel>
            <Select
              name="location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              label="Ubicación"
              startAdornment={<LocationOnIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              <MenuItem value="Ubicación 1">Ubicación 1</MenuItem>
              <MenuItem value="Ubicación 2">Ubicación 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              label="Categoría"
              startAdornment={<CategoryIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              <MenuItem value="Categoría 1">Categoría 1</MenuItem>
              <MenuItem value="Categoría 2">Categoría 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Relevancia</InputLabel>
            <Select
              name="relevance"
              value={filters.relevance}
              onChange={(e) => setFilters({ ...filters, relevance: e.target.value })}
              label="Relevancia"
              startAdornment={<SortIcon sx={{ ml: 1, mr: 1, color: "action.active" }} />}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button variant="outlined" fullWidth onClick={handleClearFilters} sx={{ borderRadius: 1 }}>
              Limpiar
            </Button>
            <Button variant="contained" fullWidth onClick={toggleDrawer} sx={{ borderRadius: 1 }}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Diálogo para crear/editar proyecto */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            m: { xs: 2, sm: 4 },
          },
        }}
      >
        <DialogTitle
          sx={{
            py: 2,
            px: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={600}>
            {selectedProject ? "Actualizar Proyecto" : "Crear Nuevo Proyecto"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ProjectForm onSubmit={handleCreateOrUpdateProject} initialValues={selectedProject || {}} />
        </DialogContent>
      </Dialog>

      {selectedProject && (
        <ProjectDetails project={selectedProject} onClose={handleClose} onUpdateProject={handleCreateOrUpdateProject} />
      )}
    </Container>
  )
}

export default ProjectsSection

