import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, CssBaseline, Avatar, IconButton, Badge } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
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
import Feed from './sections/Feed';  // Import the new Feed section
import ChatSidebar from './sections/ChatSidebar';  // Import the ChatSidebar component

const drawerWidth = 280;

const sections = [
  { id: 'profile', icon: <AssignmentIcon />, label: 'Profile' },
  { id: 'projects', icon: <ExploreIcon />, label: 'Projects' },
  { id: 'messages', icon: <MailIcon />, label: 'Messages' },
  { id: 'groups', icon: <GroupIcon />, label: 'Groups' },
  { id: 'resources', icon: <SchoolIcon />, label: 'Resources' },
  { id: 'achievements', icon: <StarIcon />, label: 'Achievements' },
  { id: 'forum', icon: <ForumIcon />, label: 'Forum' },
  { id: 'events', icon: <EventIcon />, label: 'Events' },
  { id: 'feed', icon: <ExploreIcon />, label: 'Feed' }, // Adding a new section for the feed
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const theme = useTheme();

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
          <Avatar src="https://via.placeholder.com/100" alt="Admin User" sx={{ width: 100, height: 100, mb: 1 }} />
          <Typography variant="h6">Admin User</Typography>
          <Typography variant="body2" color="textSecondary">Administrator</Typography>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar 
          position="static" 
          color="default" 
          sx={{ 
            mb: 3, 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Añadido un ligero boxShadow
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
        {activeSection === 'messages' && <ChatsSection />}
        {activeSection === 'groups' && <GroupsSection />}
        {activeSection === 'resources' && <ResourcesSection />}
        {activeSection === 'achievements' && <AchievementsSection />}
        {activeSection === 'forum' && <ForumSection />}
        {activeSection === 'events' && <EventsSection />}
        {activeSection === 'feed' && <Feed />} {/* Render the feed when the feed section is active */}
      </Box>
      <ChatSidebar open={chatSidebarOpen} handleClose={handleMessagesClose} />
    </Box>
  );
};

export default AdminPage;
