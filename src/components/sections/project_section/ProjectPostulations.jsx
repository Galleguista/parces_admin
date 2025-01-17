import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Icon,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/HelpOutline';
import AnswerIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const ProjectPostulations = ({ projectId }) => {
  const [data, setData] = useState({
    esPropietario: false,
    esMiembro: false,
    yaPostulado: false,
    formulario: [],
    postulaciones: [],
  });
  const [newPregunta, setNewPregunta] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  useEffect(() => {
    fetchPostulationsData();
  }, [projectId]);

  const fetchPostulationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/proyectos/${projectId}/postulaciones-detalle`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setData(response.data || {});
    } catch (error) {
      console.error('Error al obtener datos de postulaciones:', error);
      setError('No se pudo cargar la información del proyecto.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPregunta = async () => {
    if (!newPregunta.trim()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/proyectos/${projectId}/formulario`,
        { preguntas: [newPregunta] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );
      setData((prev) => ({
        ...prev,
        formulario: [...(prev.formulario || []), ...response.data],
      }));
      setNewPregunta('');
    } catch (error) {
      console.error('Error al añadir pregunta:', error);
    }
  };

  const handleSubmitRespuestas = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proyectos/${projectId}/postulaciones`,
        {
          respuestas: data.formulario.map((pregunta) => ({
            pregunta_id: pregunta.formulario_id,
            respuesta: respuestas[pregunta.formulario_id] || '',
          })),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );
      fetchPostulationsData();
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
    }
  };

  const handleChangeRespuesta = (preguntaId, value) => {
    setRespuestas({ ...respuestas, [preguntaId]: value });
  };

  const handleOpenDialog = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPostulacion(null);
  };

  const handleAceptarPostulacion = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proyectos/${projectId}/postulacion/${selectedPostulacion.postulacion_id}/aceptar`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      );
      fetchPostulationsData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al aceptar la postulación:', error);
    }
  };

  const handleRechazarPostulacion = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/proyectos/${projectId}/postulacion/${selectedPostulacion.postulacion_id}/rechazar`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      );
      fetchPostulationsData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al rechazar la postulación:', error);
    }
  };

  const { esPropietario, esMiembro, yaPostulado, formulario, postulaciones } = data;

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (esPropietario) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Gestión de Postulaciones
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Formulario de Postulación</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              label="Nueva pregunta"
              value={newPregunta}
              onChange={(e) => setNewPregunta(e.target.value)}
              fullWidth
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddPregunta} startIcon={<AddIcon />}>
              Añadir
            </Button>
          </Box>
          <List>
            {(formulario || []).map((pregunta) => (
              <ListItem key={pregunta.formulario_id}>
                <ListItemText primary={pregunta.pregunta} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Postulaciones Recibidas</Typography>
          {postulaciones.length === 0 ? (
            <Alert severity="info">No hay postulaciones aún.</Alert>
          ) : (
            <List>
              {postulaciones.map((postulacion) => (
                <ListItem key={postulacion.postulacion_id}>
                  <ListItemText
                    primary={`Usuario: ${postulacion.usuario_nombre}`}
                    secondary={`Estado: ${postulacion.estado}`}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handleOpenDialog(postulacion)}
                  >
                    Ver detalles
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Detalles de la Postulación</DialogTitle>
          <DialogContent>
            {selectedPostulacion?.respuestas.map((respuesta, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Icon component={QuestionMarkIcon} sx={{ mr: 1 }} />
                    Pregunta:
                  </Typography>
                  <Typography>{respuesta.pregunta}</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mt: 2, display: 'flex', alignItems: 'center' }}
                  >
                    <Icon component={AnswerIcon} sx={{ mr: 1 }} />
                    Respuesta:
                  </Typography>
                  <Typography>{respuesta.respuesta}</Typography>
                </CardContent>
              </Card>
            ))}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="success" onClick={handleAceptarPostulacion}>
              Aceptar
            </Button>
            <Button variant="contained" color="error" onClick={handleRechazarPostulacion}>
              Rechazar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  if (esMiembro) {
    return <Alert severity="info">Ya formas parte de este proyecto.</Alert>;
  }

  if (yaPostulado) {
    return <Alert severity="success">Ya has enviado una postulación para este proyecto.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Formulario de Postulación
      </Typography>
      <Paper sx={{ p: 3 }}>
        <List>
          {(formulario || []).map((pregunta) => (
            <ListItem key={pregunta.formulario_id} sx={{ mb: 2 }}>
              <ListItemText primary={pregunta.pregunta} />
              <TextField
                fullWidth
                variant="outlined"
                value={respuestas[pregunta.formulario_id] || ''}
                onChange={(e) => handleChangeRespuesta(pregunta.formulario_id, e.target.value)}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleSubmitRespuestas}>
          Enviar Postulación
        </Button>
      </Paper>
    </Box>
  );
};

export default ProjectPostulations;
