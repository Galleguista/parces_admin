import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import axios from 'axios';

const ProjectLog = ({ projectId }) => {
  const [logEntries, setLogEntries] = useState([]); // Inicializa como un arreglo vacío
  const [newEntry, setNewEntry] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchLogEntries = async () => {
  try {
    const response = await axios.get(`/proyectos/${projectId}/bitacora`, {
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log('Datos de la respuesta:', response.data); // Asegúrate de que el JSON se loguea correctamente
    setLogEntries(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching log entries:', error);
    setError('Error al cargar la bitácora.');
  }
};

  
    fetchLogEntries();
  }, [projectId]);
  

  const handleAddEntry = async () => {
    if (!newEntry.trim()) {
      setError('La descripción no puede estar vacía.');
      return;
    }
  console.log('el proyecto id es el siguiente: ',projectId)
    try {
      const response = await axios.post(
        `/proyectos/${projectId}/bitacora`, // `projectId` debe ser válido
        { descripcion: newEntry },
        {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      setLogEntries((prev) => [...prev, response.data]); // Actualiza las entradas
      setNewEntry(''); // Limpia el campo
      setSuccessMessage('Entrada añadida exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error adding log entry:', error);
      setError('No se pudo añadir la entrada.');
    }
  };
  
  

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bitácora del Proyecto
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Nueva entrada"
          variant="outlined"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddEntry}>
          Añadir
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logEntries.length > 0 ? (
              logEntries.map((entry) => (
                <TableRow key={entry.bitacora_id}>
                  <TableCell>{new Date(entry.fecha).toLocaleString()}</TableCell>
                  <TableCell>{entry.descripcion}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No hay entradas en la bitácora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectLog;
