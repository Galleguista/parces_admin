// Navbar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Popover,
  Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const Navbar = ({
  onMessagesClick,
  currentSection,
  onLogout,
  onStartConversation,
  handleDrawerToggle, // Agregado para controlar el botón del menú móvil
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_PUBLIC_URL;

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/conversaciones/private-chat`,
        { memberId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const conversationId = response.data.conversacion_id;

      if (onStartConversation) {
        onStartConversation(conversationId);
      }
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchDrawerOpen(false);
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const isNotificationOpen = Boolean(notificationAnchor);

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        mb: 3,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Botón de menú para mostrar el Sidebar */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Título de la sección actual */}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {currentSection}
        </Typography>

        {/* Barra de búsqueda para pantallas grandes */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, position: 'relative', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: { sm: '240px' },
              transition: 'width 0.3s',
              mr: 2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {searchQuery && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'white',
                width: '240px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: 1,
                zIndex: 1201,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <List>
                {searchResults.map((user) => (
                  <ListItem
                    key={user.usuario_id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => handleStartChat(user.usuario_id)}
                      >
                        <ChatIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar ? `${baseUrl}${user.avatar}` : null} />
                    </ListItemAvatar>
                    <ListItemText primary={user.nombre} secondary={user.correo_electronico} />
                  </ListItem>
                ))}
                {isSearching && (
                  <Typography sx={{ p: 2, textAlign: 'center' }}>Buscando...</Typography>
                )}
              </List>
            </Box>
          )}
        </Box>

        {/* Íconos de acciones */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={0} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            open={isNotificationOpen}
            anchorEl={notificationAnchor}
            onClose={handleNotificationClose}
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
        </Box>
      </Toolbar>

      {/* Search Drawer para móviles */}
      <Drawer
        anchor="top"
        open={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Buscar usuarios</Typography>
            <IconButton onClick={() => setIsSearchDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List>
            {searchResults.map((user) => (
              <ListItem
                key={user.usuario_id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleStartChat(user.usuario_id)}
                  >
                    <ChatIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar ? `${baseUrl}${user.avatar}` : null} />
                </ListItemAvatar>
                <ListItemText primary={user.nombre} secondary={user.correo_electronico} />
              </ListItem>
            ))}
            {isSearching && (
              <Typography sx={{ p: 2, textAlign: 'center' }}>Buscando...</Typography>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
