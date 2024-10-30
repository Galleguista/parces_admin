// project_section/Form/Tertiary.js
import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

const Tertiary = ({ onNext, onPrevious }) => {
  const [formValues, setFormValues] = useState({
    aportesParticipantes: '',
    recursosDisponibles: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleNext = () => {
    onNext(formValues); // Envía los valores al componente principal y avanza a la siguiente sección
  };

  return (
    <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Participación y Recursos</Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Aportes Esperados de los Participantes:</FormLabel>
        <RadioGroup
          name="aportesParticipantes"
          value={formValues.aportesParticipantes}
          onChange={handleInputChange}
        >
          {["Mano de Obra", "Insumos", "Terrenos", "Financiamiento", "Maquinaria y Equipos", "Asistencia Técnica", "Infraestructura", "Otros"].map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
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
        sx={{ marginBottom: 2 }}
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
