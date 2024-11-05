// project_section/Form/Secondary.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid } from '@mui/material';

const Secondary = ({ onNext, onPrevious, initialValues }) => {
  const [formValues, setFormValues] = useState({
    tamanoTerreno: '',
    duracionProyecto: '',
    numeroParticipantes: '',
    ...initialValues, // Inicializa con valores existentes si están disponibles
  });

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues, // Actualiza los valores cuando initialValues cambie
    }));
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleNext = () => {
    onNext(formValues); // Envía los valores al componente principal y avanza a la siguiente sección
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Detalles del Proyecto</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Tamaño del Terreno:</Typography>
          <TextField
            fullWidth
            name="tamanoTerreno"
            variant="outlined"
            placeholder="Indica el tamaño del terreno en hectáreas."
            value={formValues.tamanoTerreno}
            onChange={handleInputChange}
            sx={{ marginBottom: { xs: 1, md: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Duración del Proyecto:</Typography>
          <TextField
            fullWidth
            name="duracionProyecto"
            variant="outlined"
            placeholder="Duración estimada en meses o años."
            value={formValues.duracionProyecto}
            onChange={handleInputChange}
            sx={{ marginBottom: { xs: 1, md: 2 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Número de Participantes Esperados:</Typography>
          <TextField
            fullWidth
            name="numeroParticipantes"
            variant="outlined"
            placeholder="Número máximo de participantes o interesados en el proyecto."
            value={formValues.numeroParticipantes}
            onChange={handleInputChange}
            sx={{ marginBottom: { xs: 1, md: 2 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onPrevious}>
              Anterior
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Siguiente
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Secondary;
