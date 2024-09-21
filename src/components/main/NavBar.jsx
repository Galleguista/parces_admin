// Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Popover, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = ({ onMessagesClick, currentSection, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar 
      position="static" 
      color="default" 
      sx={{ 
        mb: 3, 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {currentSection}
        </Typography>
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={0} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">No tienes notificaciones</Typography>
          </Box>
        </Popover>
        <IconButton color="inherit" onClick={onMessagesClick}>
          <Badge badgeContent={3} color="primary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={onLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
