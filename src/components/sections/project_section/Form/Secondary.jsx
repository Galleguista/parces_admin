// project_section/Form/Secondary.js
import React, { useState } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';

const Secondary = ({ onNext, onPrevious }) => {
  const [formValues, setFormValues] = useState({
    tamanoTerreno: '',
    duracionProyecto: '',
    numeroParticipantes: '',
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
      <Typography variant="h5" gutterBottom>Detalles del Proyecto</Typography>

      <Typography variant="subtitle1" gutterBottom>Tamaño del Terreno:</Typography>
      <TextField
        fullWidth
        name="tamanoTerreno"
        variant="outlined"
        placeholder="Indica el tamaño del terreno en hectáreas."
        value={formValues.tamanoTerreno}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Duración del Proyecto:</Typography>
      <TextField
        fullWidth
        name="duracionProyecto"
        variant="outlined"
        placeholder="Duración estimada en meses o años."
        value={formValues.duracionProyecto}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Número de Participantes Esperados:</Typography>
      <TextField
        fullWidth
        name="numeroParticipantes"
        variant="outlined"
        placeholder="Número máximo de participantes o interesados en el proyecto."
        value={formValues.numeroParticipantes}
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

export default Secondary;
