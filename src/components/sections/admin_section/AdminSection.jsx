import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Button, styled, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserIcon from '@mui/icons-material/Person';
import ProjectIcon from '@mui/icons-material/Work';
import ResourceIcon from '@mui/icons-material/Extension';

import AdminUsers from './options/AdminUsers';
import AdminProjects from './options/AdminProjects';
import AdminResources from './options/AdminResources';

// Styled component para los ítems de navegación
const Item = styled(Paper)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 150,
  borderRadius: '20px', // Bordes redondeados
  backgroundColor: theme.palette.background.paper, // Fondo personalizado
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0px 6px 15px ${theme.palette.primary.main}` // Sombra más prominente en hover
  }
}));

const AdminPage = () => {
  const [view, setView] = useState('main'); // Estado para controlar la vista actual

  const renderView = () => {
    switch (view) {
      case 'users':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
              <IconButton
                onClick={() => setView('main')}
                color="primary"
                sx={{ position: 'absolute', left: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" align="center">
                Gestión de Usuarios
              </Typography>
            </Box>
            <AdminUsers />
          </>
        );
      case 'projects':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
              <IconButton
                onClick={() => setView('main')}
                color="primary"
                sx={{ position: 'absolute', left: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" align="center">
                Gestión de Proyectos
              </Typography>
            </Box>
            <AdminProjects />
          </>
        );
      case 'resources':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, position: 'relative' }}>
              <IconButton
                onClick={() => setView('main')}
                color="primary"
                sx={{ position: 'absolute', left: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" align="center">
                Gestión de Recursos
              </Typography>
            </Box>
            <AdminResources />
          </>
        );
      default:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Item onClick={() => setView('users')}>
                <UserIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography>Gestionar Usuarios</Typography>
              </Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item onClick={() => setView('projects')}>
                <ProjectIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography>Gestionar Proyectos</Typography>
              </Item>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Item onClick={() => setView('resources')}>
                <ResourceIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography>Gestionar Recursos</Typography>
              </Item>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {renderView()}
    </Box>
  );
};

export default AdminPage;
