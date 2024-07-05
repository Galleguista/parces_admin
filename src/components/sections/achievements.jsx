import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const achievements = [
  {
    id: 1,
    title: 'Top Contributor',
    description: 'Awarded for being the top contributor of the month.',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    title: 'Best Project',
    description: 'Awarded for leading the best project of the year.',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    title: 'Community Helper',
    description: 'Recognized for exceptional help in the community.',
    image: 'https://via.placeholder.com/300',
  },
];

const AchievementsSection = () => {
  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>Achievements</Typography>
      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
              <CardContent>
                <Box
                  component="img"
                  src={achievement.image}
                  alt={achievement.title}
                  sx={{ width: '100%', height: 140, borderRadius: '16px', mb: 2 }}
                />
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{achievement.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{achievement.description}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AchievementsSection;
