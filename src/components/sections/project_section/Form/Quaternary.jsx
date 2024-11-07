// project_section/Form/Quaternary.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';

const Quaternary = ({ onNext, onPrevious, initialValues }) => {
  const [formValues, setFormValues] = useState({
    modalidad_participacion: '',
    modelo_reparto: '',
    ...initialValues, // Valores iniciales desde el estado global
  });

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues, // Actualiza cuando initialValues cambie
    }));
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleNext = () => {
    onNext(formValues); // Envía los valores al estado global
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Modalidad de Aparcería</Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Modalidad de Participación:</FormLabel>
        <RadioGroup
          name="modalidad_participacion" // Ajustado para coincidir con el nombre en la base de datos
          value={formValues.modalidad_participacion}
          onChange={handleInputChange}
        >
          <Grid container spacing={2}>
            {["Participación Activa (presencial)", "Participación Remota (si aplica)", "Participación Activa y Remota"].map((option, index) => (
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

      <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
        <FormLabel component="legend">Modelo de Reparto de Beneficios:</FormLabel>
        <RadioGroup
          name="modelo_reparto" // Ajustado para coincidir con el nombre en la base de datos
          value={formValues.modelo_reparto}
          onChange={handleInputChange}
        >
          <Grid container spacing={2}>
            {["Reparto equitativo según los aportes", "Reparto proporcional a la inversión", "Acuerdo consensuado", "Otro"].map((option, index) => (
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
