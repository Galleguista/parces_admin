// Notifications.js
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';

const Notifications = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/notificaciones`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNotificaciones(response.data);
        setUnreadCount(response.data.filter((n) => !n.leida).length);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    fetchNotificaciones();

    const interval = setInterval(fetchNotificaciones, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarcarComoLeido = async (notificacionId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/notificaciones/${notificacionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotificaciones((prev) => prev.filter((n) => n.notificacion_id !== notificacionId));
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
          <Typography sx={{ p: 2, fontWeight: 'bold' }}>Notificaciones</Typography>
          {notificaciones.length > 0 ? (
            notificaciones.map((notificacion) => (
              <Card key={notificacion.notificacion_id} sx={{ mb: 2, mx: 2 }}>
                <CardContent>
                  <Typography variant="body1">{notificacion.mensaje}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(notificacion.fecha_creacion).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => handleMarcarComoLeido(notificacion.notificacion_id)}
                  >
                    Marcar como leído
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography sx={{ p: 2 }}>No tienes notificaciones</Typography>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default Notifications;
