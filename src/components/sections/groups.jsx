import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Box, AppBar, Tabs, Tab } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const initialGroups = [
  {
    id: 1,
    name: 'Organic Farming Enthusiasts',
    description: 'A group for people passionate about organic farming.',
    image: 'https://via.placeholder.com/300',
    members: [
      { id: 1, name: 'Alice Smith', avatar: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/50' },
    ],
  },
  {
    id: 2,
    name: 'Urban Gardeners',
    description: 'Discussing tips and tricks for urban gardening.',
    image: 'https://via.placeholder.com/300',
    members: [
      { id: 1, name: 'Carol Williams', avatar: 'https://via.placeholder.com/50' },
      { id: 2, name: 'David Brown', avatar: 'https://via.placeholder.com/50' },
    ],
  },
  {
    id: 3,
    name: 'Sustainable Agriculture',
    description: 'Promoting sustainable agricultural practices.',
    image: 'https://via.placeholder.com/300',
    members: [
      { id: 1, name: 'Eve Davis', avatar: 'https://via.placeholder.com/50' },
      { id: 2, name: 'Frank Miller', avatar: 'https://via.placeholder.com/50' },
    ],
  },
];

const GroupsSection = () => {
  const [groups] = useState(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleOpenGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleCloseGroup = () => {
    setSelectedGroup(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
              <Box display="flex" alignItems="center" p={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{group.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{group.description}</Typography>
                </Box>
              </Box>
              <CardContent>
                <Button variant="contained" color="primary" onClick={() => handleOpenGroup(group)}>
                  View Group
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGroup && (
        <Dialog 
          open={Boolean(selectedGroup)} 
          onClose={handleCloseGroup} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px' } }} // Añadido borderRadius aquí
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{selectedGroup.name}</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={selectedGroup.image}
                alt={selectedGroup.name}
                sx={{ width: 150, height: 150, margin: 'auto', borderRadius: '50%' }}
              />
            </Box>
            <AppBar position="static" color="default" sx={{ borderRadius: '8px', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
                <Tab label="Información" />
                <Tab label="Miembros" />
                <Tab label="Chat Grupal" />
              </Tabs>
            </AppBar>
            {tabValue === 0 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {selectedGroup.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Fecha de creación:</strong> 1 de Enero de 2022
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Ubicación:</strong> Bogotá, Colombia
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Número de miembros:</strong> {selectedGroup.members.length}
                </Typography>
              </Box>
            )}
            {tabValue === 1 && (
              <List>
                {selectedGroup.members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar alt={member.name} src={member.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))}
              </List>
            )}
            {tabValue === 2 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" color="primary">
                  Unirte al chat grupal
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GroupsSection;
