// project_section/Form/Tertiary.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';

const Tertiary = ({ onNext, onPrevious, initialValues }) => {
  const [formValues, setFormValues] = useState({
    aportesParticipantes: '',
    recursosDisponibles: '',
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
      <Typography variant="h5" gutterBottom>Participación y Recursos</Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Aportes Esperados de los Participantes:</FormLabel>
        <RadioGroup
          name="aportesParticipantes"
          value={formValues.aportesParticipantes}
          onChange={handleInputChange}
        >
          <Grid container spacing={2}>
            {["Mano de Obra", "Insumos", "Terrenos", "Financiamiento", "Maquinaria y Equipos", "Asistencia Técnica", "Infraestructura", "Otros"].map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>Recursos Disponibles del Proyecto:</Typography>
      <TextField
        fullWidth
        name="recursosDisponibles"
        variant="outlined"
        placeholder="Describe los recursos que ya tienes disponibles para el proyecto (equipos, capital, insumos, etc.)."
        multiline
        rows={4}
        value={formValues.recursosDisponibles}
        onChange={handleInputChange}
        sx={{ marginBottom: { xs: 1, md: 2 } }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onPrevious}>
          Anterior
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default Tertiary;
