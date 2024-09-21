// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './main/NavBar';
import Sidebar from './main/Sidebar';
import ChatSidebar from './sections/ChatSidebar';
import ProfileSection from './sections/profile';
import ProjectsSection from './sections/projects';
import GroupsSection from './sections/groups';
import ResourcesSection from './sections/resources';
import AchievementsSection from './sections/achievements';
import ForumSection from './sections/forum';
import EventsSection from './sections/events';
import Feed from './sections/Feed';

const drawerWidth = 280;
const API_URL = `${import.meta.env.VITE_API_URL}/profile/me`;

const sections = [
  { id: 'profile', label: 'Perfil' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'groups', label: 'Grupos' },
  { id: 'resources', label: 'Recursos' },
  { id: 'achievements', label: 'Logros' },
  { id: 'forum', label: 'Foro' },
  { id: 'events', label: 'Eventos' },
  { id: 'feed', label: 'Novedades' },
];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ nombre: '', avatarBase64: '' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
          avatarBase64: response.data.avatarBase64 ? `data:image/jpeg;base64,${response.data.avatarBase64}` : '',
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentSection = sections.find((section) => section.id === activeSection)?.label;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
        userProfile={userProfile}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Navbar
          onMessagesClick={handleMessagesClick}
          currentSection={currentSection}
          onLogout={handleLogout}
        />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
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
