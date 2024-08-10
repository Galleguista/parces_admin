import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(`/logros/usuario/${usuarioId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (Array.isArray(response.data)) {
          setAchievements(response.data);
        } else {
          setAchievements([]);
        }
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los logros');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <Typography variant="h6" sx={{ textAlign: 'center' }}>Cargando logros...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>{error}</Typography>;
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Logros</Typography>
      <Grid container spacing={3}>
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.logro_id}>
              <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
                <CardContent>
                  <Box
                    component="img"
                    src={achievement.imagen_url}
                    alt={achievement.titulo}
                    sx={{ width: '100%', height: 140, borderRadius: '16px', mb: 2 }}
                  />
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <StarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{achievement.titulo}</Typography>
                      <Typography variant="body2" color="textSecondary">{achievement.descripcion}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>No se encontraron logros.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default AchievementsSection;
