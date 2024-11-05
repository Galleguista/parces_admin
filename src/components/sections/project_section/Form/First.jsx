// project_section/Form/First.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';
import { Agriculture, Pets, EmojiNature, LocalFlorist, Waves, Hive, Spa, Business } from '@mui/icons-material';

const First = ({ onNext, initialValues }) => {
  const [formValues, setFormValues] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    tipoAparceria: '',
    ...initialValues, // Carga valores iniciales al cargar el componente
  });

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues, // Actualiza los valores en caso de cambios en initialValues
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
    <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Configuración General del Proyecto</Typography>

      <Typography variant="subtitle1" gutterBottom>Nombre del Proyecto:</Typography>
      <TextField
        fullWidth
        name="nombre"
        variant="outlined"
        placeholder="Nombre único que identifique tu proyecto de aparcería."
        value={formValues.nombre}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Descripción del Proyecto:</Typography>
      <TextField
        fullWidth
        name="descripcion"
        variant="outlined"
        placeholder="Proporciona una breve descripción de tu proyecto, incluyendo objetivos y visión."
        multiline
        rows={4}
        value={formValues.descripcion}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Ubicación del Proyecto:</Typography>
      <TextField
        fullWidth
        name="ubicacion"
        variant="outlined"
        placeholder="Ubicación geográfica (ciudad, departamento, país)."
        value={formValues.ubicacion}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <FormLabel component="legend">Tipo de Aparcería:</FormLabel>
        <RadioGroup
          row
          name="tipoAparceria"
          value={formValues.tipoAparceria}
          onChange={handleInputChange}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Agrícola"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Agriculture fontSize="small" sx={{ mr: 1 }} />
                    Agrícola
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Ganadera"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Pets fontSize="small" sx={{ mr: 1 }} />
                    Ganadera
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Avícola"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <EmojiNature fontSize="small" sx={{ mr: 1 }} />
                    Avícola
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Piscícola"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Waves fontSize="small" sx={{ mr: 1 }} />
                    Piscícola
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Apícola"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Hive fontSize="small" sx={{ mr: 1 }} />
                    Apícola
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Granja Integral Agroecológica"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Spa fontSize="small" sx={{ mr: 1 }} />
                    Granja Integral Agroecológica
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Agroindustria"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <Business fontSize="small" sx={{ mr: 1 }} />
                    Agroindustria
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                value="Otro"
                control={<Radio />}
                label="Otro"
              />
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleNext}>
        Siguiente
      </Button>
    </Box>
  );
};

export default First;
