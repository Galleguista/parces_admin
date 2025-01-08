import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './main/NavBar';
import Sidebar from './main/Sidebar';
import ChatSidebar from './sections/ChatSidebar';
import ProfileSection from './sections/profile';
import ProjectsSection from './sections/project_section/projects';
import GroupsSectionUI from './sections/groups_section/GroupsSectionUI';
import ResourcesSection from './sections/resources';
import AchievementsSection from './sections/achievements';
import ForumSection from './sections/forum';
import EventsSection from './sections/events';
import Feed from './sections/Feed';
import AdminSection from './sections/admin_section/AdminSection'

const drawerWidth = 280;
const API_URL = `${import.meta.env.VITE_API_URL}/usuarios/me`;
const ROLE_URL = `${import.meta.env.VITE_API_URL}/roles`;

const sections = [
  { id: 'profile', label: 'Perfil' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'groups', label: 'Grupos' },
  { id: 'resources', label: 'Recursos' },
  { id: 'achievements', label: 'Logros' },
  { id: 'forum', label: 'Foro' },
  // { id: 'events', label: 'Eventos' },
  { id: 'feed', label: 'Novedades' },
  { id: 'admin', label: 'Vista administrador' },

];

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ nombre: '', avatarUrl: '', roleName: '', });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const decodeToken = (token) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role_id;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const publicUrl = import.meta.env.VITE_PUBLIC_URL;
        const profileData = {
          ...response.data,
          avatarUrl: response.data.avatar ? `${publicUrl}${response.data.avatar}` : '',
        };
        setUserProfile(profileData);  // Asegúrate de que response.data incluya isAdmin
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    

    const fetchRoleDetails = async (roleId) => {
      try {
        const response = await axios.get(`${ROLE_URL}/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile((prevProfile) => ({
          ...prevProfile,
          roleName: response.data.role_name,
        }));
      } catch (error) {
        console.error('Error fetching role details:', error);
      }
    };

    if (token) {
      const roleId = decodeToken(token);
      if (roleId) {
        fetchUserProfile();
        fetchRoleDetails(roleId);
      }
    }
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
        {activeSection === 'groups' && <GroupsSectionUI />}
        {activeSection === 'resources' && <ResourcesSection />}
        {activeSection === 'achievements' && <AchievementsSection />}
        {activeSection === 'forum' && <ForumSection />}
        {/* {activeSection === 'events' && <EventsSection />} */}
        {activeSection === 'feed' && <Feed />}
        {activeSection === 'admin' && <AdminSection />}
      </Box>
      <ChatSidebar open={chatSidebarOpen} handleClose={handleMessagesClose} />
    </Box>
  );
};

export default AdminPage;
