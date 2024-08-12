import React, { useState, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, CssBaseline, Avatar, IconButton, Badge } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios'; // Asegúrate de importar axios
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExploreIcon from '@mui/icons-material/Explore';
import MailIcon from '@mui/icons-material/Mail';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ProfileSection from './sections/profile';
import ProjectsSection from './sections/projects';
import ChatsSection from './sections/messages';
import GroupsSection from './sections/groups';
import ResourcesSection from './sections/resources';
import AchievementsSection from './sections/achievements';
import ForumSection from './sections/forum';
import EventsSection from './sections/events';
import Feed from './sections/Feed';
import ChatSidebar from './sections/ChatSidebar';

const drawerWidth = 280;
const API_URL = `${import.meta.env.VITE_API_URL}/profile/me`;

const sections = [
  { id: 'profile', icon: <AssignmentIcon />, label: 'Perfil' },
  { id: 'projects', icon: <ExploreIcon />, label: 'Proyectos' },
  { id: 'groups', icon: <GroupIcon />, label: 'Grupos' },
  { id: 'resources', icon: <SchoolIcon />, label: 'Recursos' },
  { id: 'achievements', icon: <StarIcon />, label: 'Logros' },
  { id: 'forum', icon: <ForumIcon />, label: 'Foro' },
  { id: 'events', icon: <EventIcon />, label: 'Eventos' },
  { id: 'feed', icon: <ExploreIcon />, label: 'Novedades' },
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ nombre: '', avatar: '' }); // Estado para almacenar la información del usuario
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = {
          ...response.data,
          avatar: response.data.avatar ? `data:image/jpeg;base64,${response.data.avatar}` : '',
        };
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleMessagesClick = () => {
    setChatSidebarOpen(true);
  };

  const handleMessagesClose = () => {
    setChatSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(2),
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={userProfile.avatar || 'https://via.placeholder.com/150'}
            alt="Admin User"
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Typography variant="h6">{userProfile.nombre}</Typography> {/* Muestra el nombre del usuario */}
          <Typography variant="body2" color="textSecondary">Usuario</Typography>
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
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar 
          position="static" 
          color="default" 
          sx={{ 
            mb: 3, 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            borderBottom: `1px solid ${theme.palette.divider}` 
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {sections.find((section) => section.id === activeSection)?.label}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMessagesClick}>
              <Badge badgeContent={3} color="primary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'projects' && <ProjectsSection />}
        {activeSection === 'groups' && <GroupsSection />}
        {activeSection === 'resources' && <ResourcesSection />}
        {activeSection === 'achievements' && <AchievementsSection />}
        {activeSection === 'forum' && <ForumSection />}
        {activeSection === 'events' && <EventsSection />}
        {activeSection === 'feed' && <Feed />}
      </Box>
      <ChatSidebar open={chatSidebarOpen} handleClose={handleMessagesClose} />
    </Box>
  );
};

export default AdminPage;
