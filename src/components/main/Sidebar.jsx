import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography, Divider } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Asegúrate de importar esto
import { StackedBarChart } from '@mui/icons-material';

const PUBLIC_URL = `${import.meta.env.VITE_PUBLIC_URL}`;

const drawerWidth = 280;

const Sidebar = ({ activeSection, handleSectionChange, userProfile, mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isAdmin = userProfile.isAdmin;
  const avatarUrl = `${PUBLIC_URL}${userProfile.avatar}`; 
  console.log('testeo de user profile',avatarUrl)

  const sections = [
    { id: 'feed', icon: <StackedBarChart />, label: 'Novedades' },
    { id: 'projects', icon: <ExploreIcon />, label: 'Proyectos' },
    { id: 'groups', icon: <GroupIcon />, label: 'Grupos' },
    { id: 'resources', icon: <SchoolIcon />, label: 'Recursos' },
    { id: 'achievements', icon: <StarIcon />, label: 'Logros' },
    { id: 'forum', icon: <ForumIcon />, label: 'Foro' },
    { id: 'profile', icon: <AssignmentIcon />, label: 'Perfil' },
    // { id: 'events', icon: <EventIcon />, label: 'Eventos' },
    ...(isAdmin ? [{ id: 'admin', icon: <AdminPanelSettingsIcon />, label: 'Admin' }] : []) // Añade la sección de admin si es administrador
  ];

  const drawerContent = (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar
          src={userProfile.avatarUrl || 'https://via.placeholder.com/150'} 
          alt="Admin User"
          sx={{ width: 100, height: 100, mb: 1 }}
        />
        <Typography variant="h6">{userProfile.nombre}</Typography>
        <Typography variant="body2" color="textSecondary">{userProfile.roleName || 'Rol no asignado'}</Typography> {/* Mostramos el rol aquí */}
      </Box>
      <Divider />
      <List>
        {sections.map((section) => (
          <ListItem
            button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.contrastText,
              },
              backgroundColor: activeSection === section.id ? alpha(theme.palette.primary.main, 0.2) : 'inherit',
              color: activeSection === section.id ? theme.palette.primary.contrastText : 'inherit',
            }}
          >
            <ListItemIcon sx={{ color: activeSection === section.id ? theme.palette.primary.contrastText : theme.palette.text.primary }}>
              {section.icon}
            </ListItemIcon>
            <ListItemText primary={section.label} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(2),
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
