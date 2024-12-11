// AdminSection/AdminSection.jsx
import React, { useState } from 'react';
import {
  Box, Tabs, Tab, Typography
} from '@mui/material';
import AdminUsers from './options/AdminUsers';
import AdminProjects from './options/AdminProjects';
import AdminResources from './options/AdminResources';

const AdminSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 0:
        return <AdminUsers />;
      case 1:
        return <AdminProjects />;
      case 2:
        return <AdminResources />;
      default:
        return <AdminUsers />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ p: 2 }}>Administración</Typography>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Usuarios" />
        <Tab label="Proyectos" />
        <Tab label="Recursos" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {renderSection()}
      </Box>
    </Box>
  );
};

export default AdminSection;
