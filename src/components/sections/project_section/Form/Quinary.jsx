// project_section/Form/Quinary.js
import React, { useState } from 'react';
import { Box, TextField, Typography, Button, FormControlLabel, Checkbox, Radio, RadioGroup, FormLabel, Grid } from '@mui/material';
import { Agriculture, Pets, EmojiNature, Waves, Hive } from '@mui/icons-material';

const Quinary = ({ onNext, onPrevious, initialValues }) => {
  const [formValues, setFormValues] = useState({
    nombreEncargado: '',
    correoContacto: '',
    telefonoContacto: '',
    aceptarTerminos: false,
    publicarComunidad: false,
    archivos: [],
    iconoSeleccionado: '',
    ...initialValues, // Cargar valores iniciales si existen
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limitar a 10 archivos
    setFormValues({ ...formValues, archivos: files });
  };

  const handleNext = () => {
    onNext(formValues); // Envía los valores al componente principal y avanza a la siguiente sección
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Contacto y Publicación</Typography>

      <Typography variant="subtitle1" gutterBottom>Nombre del Encargado:</Typography>
      <TextField
        fullWidth
        name="nombreEncargado"
        variant="outlined"
        placeholder="Nombre completo del responsable o líder del proyecto."
        value={formValues.nombreEncargado}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Correo Electrónico de Contacto:</Typography>
      <TextField
        fullWidth
        name="correoContacto"
        variant="outlined"
        placeholder="Correo electrónico para que los interesados puedan comunicarse."
        value={formValues.correoContacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Teléfono de Contacto (opcional):</Typography>
      <TextField
        fullWidth
        name="telefonoContacto"
        variant="outlined"
        placeholder="Número de contacto para consultas rápidas."
        value={formValues.telefonoContacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Publicar Proyecto:</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formValues.aceptarTerminos}
            onChange={handleInputChange}
            name="aceptarTerminos"
          />
        }
        label="Acepto los términos y condiciones de Parces"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formValues.publicarComunidad}
            onChange={handleInputChange}
            name="publicarComunidad"
          />
        }
        label="Publicar mi proyecto a la comunidad"
      />

      <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 3 }}>
        Selecciona un Ícono Representativo:
      </Typography>
      <RadioGroup
        row
        name="iconoSeleccionado"
        value={formValues.iconoSeleccionado}
        onChange={handleInputChange}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4}>
            <FormControlLabel
              value="Agriculture"
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
              value="Pets"
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
              value="EmojiNature"
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
              value="Waves"
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
              value="Hive"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <Hive fontSize="small" sx={{ mr: 1 }} />
                  Apícola
                </Box>
              }
            />
          </Grid>
        </Grid>
      </RadioGroup>

      <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 3 }}>
        Subir Imágenes y Archivos relacionados:
      </Typography>
      <input
        accept="image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 2 }}
      />
      <Typography variant="body2" color="textSecondary">
        Sube hasta 10 archivos compatibles. Tamaño máximo por archivo: 100 MB.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <Button variant="outlined" color="secondary" onClick={onPrevious}>
          Anterior
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Finalizar
        </Button>
      </Box>
    </Box>
  );
};

export default Quinary;
