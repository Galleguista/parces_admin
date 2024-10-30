// project_section/Form/Quaternary.js
import React, { useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

const Quaternary = ({ onNext, onPrevious }) => {
  const [formValues, setFormValues] = useState({
    modalidadParticipacion: '',
    modeloReparto: '',
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
      <Typography variant="h5" gutterBottom>Modalidad de Aparcería</Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Modalidad de Participación:</FormLabel>
        <RadioGroup
          name="modalidadParticipacion"
          value={formValues.modalidadParticipacion}
          onChange={handleInputChange}
        >
          <FormControlLabel value="Participación Activa (presencial)" control={<Radio />} label="Participación Activa (presencial)" />
          <FormControlLabel value="Participación Remota (si aplica)" control={<Radio />} label="Participación Remota (si aplica)" />
          <FormControlLabel value="Participación Activa y Remota" control={<Radio />} label="Participación Activa y Remota" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Modelo de Reparto de Beneficios:</FormLabel>
        <RadioGroup
          name="modeloReparto"
          value={formValues.modeloReparto}
          onChange={handleInputChange}
        >
          <FormControlLabel value="Reparto equitativo según los aportes" control={<Radio />} label="Reparto equitativo según los aportes" />
          <FormControlLabel value="Reparto proporcional a la inversión" control={<Radio />} label="Reparto proporcional a la inversión" />
          <FormControlLabel value="Acuerdo consensuado" control={<Radio />} label="Acuerdo consensuado" />
          <FormControlLabel value="Otro" control={<Radio />} label="Otro" />
        </RadioGroup>
      </FormControl>

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

export default Quaternary;
