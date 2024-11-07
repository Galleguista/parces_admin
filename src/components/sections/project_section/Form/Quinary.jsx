import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, FormControlLabel, Checkbox } from '@mui/material';

const Quinary = ({ onNext, onPrevious, initialValues }) => {
  const [formValues, setFormValues] = useState({
    nombre_encargado: '',
    correo_contacto: '',
    telefono_contacto: '',
    aceptarTerminos: false,
    publicarComunidad: false,
    archivos: [],
    ...initialValues,
  });

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues,
    }));
    console.log("Valores iniciales cargados en Quinary:", initialValues); // Depuración
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: type === 'checkbox' ? checked : value }));
    console.log("Campo actualizado en Quinary:", name, value); // Depuración
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setFormValues((prevValues) => ({ ...prevValues, archivos: files }));
  };

  const handleNext = () => {
    console.log("Datos a enviar desde Quinary:", formValues); // Depuración antes de enviar
    const requiredFields = ['nombre_encargado', 'correo_contacto'];
    const hasAllRequiredFields = requiredFields.every((field) => formValues[field]);

    if (hasAllRequiredFields) {
      onNext(formValues);
    } else {
      console.log("Campos obligatorios faltantes en Quinary:", formValues); // Depuración de campos faltantes
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>Contacto y Publicación</Typography>

      <Typography variant="subtitle1" gutterBottom>Nombre del Encargado:</Typography>
      <TextField
        fullWidth
        name="nombre_encargado"
        variant="outlined"
        placeholder="Nombre completo del responsable o líder del proyecto."
        value={formValues.nombre_encargado}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Correo Electrónico de Contacto:</Typography>
      <TextField
        fullWidth
        name="correo_contacto"
        variant="outlined"
        placeholder="Correo electrónico para que los interesados puedan comunicarse."
        value={formValues.correo_contacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Teléfono de Contacto (opcional):</Typography>
      <TextField
        fullWidth
        name="telefono_contacto"
        variant="outlined"
        placeholder="Número de contacto para consultas rápidas."
        value={formValues.telefono_contacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>Publicar Proyecto:</Typography>
      <FormControlLabel
        control={<Checkbox checked={formValues.aceptarTerminos} onChange={handleInputChange} name="aceptarTerminos" />}
        label="Acepto los términos y condiciones de Parces"
      />
      <FormControlLabel
        control={<Checkbox checked={formValues.publicarComunidad} onChange={handleInputChange} name="publicarComunidad" />}
        label="Publicar mi proyecto a la comunidad"
      />

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
