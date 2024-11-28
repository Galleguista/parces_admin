import React from 'react';
import {
  Grid,
  Card,
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  AppBar,
  Tabs,
  Tab,
  Divider,
  TextField,
  Fab,
  Snackbar,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import useGroupsSection from './GroupsSectionLogic';

const GroupsSectionUI = () => {
  const {
    groups,
    selectedGroup,
    tabValue,
    isCreateDialogOpen,
    newGroupName,
    newGroupDescription,
    searchQuery,
    searchResults,
    isLoading,
    error,
    successMessage,
    groupMembers,
    isLoadingMembers,
    handleOpenGroup,
    handleCloseGroup,
    handleTabChange,
    handleSearch,
    handleAddMember,
    handleRemoveMember,
    setNewGroupName,
    setNewGroupDescription,
    setSearchQuery,
    handleCreateGroup,
    setIsCreateDialogOpen,
  } = useGroupsSection();

  return (
    <Box sx={{ padding: 2 }}>
      {/* Lista de grupos */}
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.grupo_id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <Box display="flex" alignItems="center" p={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{group.nombre}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {group.descripcion}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 2 }}
                onClick={() => handleOpenGroup(group)}
              >
                Ver Grupo
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón para abrir el formulario de creación */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo de creación de grupo */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Grupo"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleCreateGroup}
          >
            Crear
          </Button>
        </DialogContent>
      </Dialog>

      {/* Detalle del grupo seleccionado */}
      {selectedGroup && (
        <Dialog open={Boolean(selectedGroup)} onClose={handleCloseGroup} maxWidth="md" fullWidth>
          <DialogTitle>{selectedGroup.nombre}</DialogTitle>
          <DialogContent>
            <AppBar position="static" color="default">
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Información" />
                <Tab label="Miembros" />
              </Tabs>
            </AppBar>
            {tabValue === 0 && (
              <Box sx={{ padding: 3 }}>
                <Typography>{selectedGroup.descripcion}</Typography>
              </Box>
            )}
            {tabValue === 1 && (
              <Box sx={{ padding: 3 }}>
                {isLoadingMembers && <CircularProgress />}
                {!isLoadingMembers && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Miembros del Grupo
                    </Typography>
                    <List>
                      {groupMembers.map((member) => (
                        <Paper elevation={2} sx={{ mb: 1 }} key={member.usuario_id}>
                          <ListItem
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ListItemAvatar>
                                <Avatar src={member.avatar || 'https://via.placeholder.com/150'} alt={member.nombre} />
                              </ListItemAvatar>
                              <ListItemText primary={member.nombre} />
                            </Box>
                            <IconButton
                              onClick={() => handleRemoveMember(selectedGroup.grupo_id, member.usuario_id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Añadir Nuevos Miembros
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        label="Buscar usuarios"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                      >
                        <SearchIcon />
                      </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                    <List>
                      {searchResults.map((user) => (
                        <Paper elevation={2} sx={{ mb: 1 }} key={user.usuario_id}>
                          <ListItem
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ListItemAvatar>
                                <Avatar src={user.avatar || 'https://via.placeholder.com/150'} alt={user.nombre} />
                              </ListItemAvatar>
                              <ListItemText primary={user.nombre} />
                            </Box>
                            <IconButton
                              onClick={() => handleAddMember(selectedGroup.grupo_id, user.usuario_id)}
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Notificaciones */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={4000} onClose={() => setIsCreateDialogOpen(false)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar open={Boolean(successMessage)} autoHideDuration={4000} onClose={() => setIsCreateDialogOpen(false)}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default GroupsSectionUI;
