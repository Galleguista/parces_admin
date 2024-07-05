import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, ListItemAvatar, Avatar, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';

const initialResources = [
  {
    id: 1,
    title: 'Introduction to Farming',
    description: 'A comprehensive guide to farming practices.',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Urban Gardening Tips',
    description: 'Tips and tricks for successful urban gardening.',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Sustainable Agriculture',
    description: 'Promoting sustainable agricultural practices.',
    image: 'https://via.placeholder.com/300x200',
  },
];

const ResourcesSection = () => {
  const [resources, setResources] = useState(initialResources);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resourceData, setResourceData] = useState({ id: null, title: '', description: '', image: '' });

  const handleOpenDialog = (resource = null) => {
    setSelectedResource(resource);
    setResourceData(resource || { id: null, title: '', description: '', image: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveResource = () => {
    if (selectedResource) {
      setResources(resources.map((res) => (res.id === selectedResource.id ? resourceData : res)));
    } else {
      setResources([...resources, { ...resourceData, id: Date.now() }]);
    }
    setOpenDialog(false);
  };

  const handleDeleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Library Resources</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Resource
        </Button>
      </Box>
      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
              <CardContent>
                <Box
                  component="img"
                  src={resource.image}
                  alt={resource.title}
                  sx={{ width: '100%', height: 140, borderRadius: '16px', mb: 2 }}
                />
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BookIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{resource.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{resource.description}</Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <IconButton color="primary" onClick={() => handleOpenDialog(resource)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteResource(resource.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={resourceData.title}
            onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={resourceData.description}
            onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            type="text"
            fullWidth
            value={resourceData.image}
            onChange={(e) => setResourceData({ ...resourceData, image: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveResource} color="primary">{selectedResource ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourcesSection;
