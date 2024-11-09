import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { AttachFile, CheckCircleOutline, CancelOutlined } from '@mui/icons-material';

const Quinary = ({ onNext, onPrevious, initialValues, onFieldUpdate }) => {
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
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormValues((prevValues) => ({ ...prevValues, [name]: newValue }));
    onFieldUpdate({ [name]: newValue }); // Enviar actualización a ProjectForm
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setFormValues((prevValues) => ({ ...prevValues, archivos: files }));
    onFieldUpdate({ archivos: files });
  };

  const handleNext = () => {
    const requiredFields = ['nombre_encargado', 'correo_contacto'];
    const hasAllRequiredFields = requiredFields.every((field) => formValues[field]);

    if (hasAllRequiredFields) {
      onNext(formValues);
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 2, backgroundColor: 'white' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Contacto y Publicación
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Nombre del Encargado:</Typography>
      <TextField
        fullWidth
        name="nombre_encargado"
        variant="outlined"
        placeholder="Nombre completo del responsable o líder del proyecto."
        value={formValues.nombre_encargado}
        onChange={handleInputChange}
        sx={{ marginBottom: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Correo Electrónico de Contacto:</Typography>
      <TextField
        fullWidth
        name="correo_contacto"
        variant="outlined"
        placeholder="Correo electrónico para que los interesados puedan comunicarse."
        value={formValues.correo_contacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Teléfono de Contacto (opcional):</Typography>
      <TextField
        fullWidth
        name="telefono_contacto"
        variant="outlined"
        placeholder="Número de contacto para consultas rápidas."
        value={formValues.telefono_contacto}
        onChange={handleInputChange}
        sx={{ marginBottom: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Publicar Proyecto:</Typography>
      <FormControlLabel
        control={<Checkbox checked={formValues.aceptarTerminos} onChange={handleInputChange} name="aceptarTerminos" />}
        label="Acepto los términos y condiciones de Parces"
        sx={{ marginBottom: 1 }}
      />
      <FormControlLabel
        control={<Checkbox checked={formValues.publicarComunidad} onChange={handleInputChange} name="publicarComunidad" />}
        label="Publicar mi proyecto a la comunidad"
        sx={{ marginBottom: 3 }}
      />

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
        Subir Imágenes y Archivos relacionados:
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <input
          accept="image/*,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ marginBottom: 2 }}
        />
        <AttachFile color="action" sx={{ marginLeft: 1 }} />
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
        Puedes subir hasta 10 archivos (imágenes, PDF, Word, Excel). Tamaño máximo: 100 MB.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onPrevious}
          startIcon={<CancelOutlined />}
          sx={{ borderRadius: '8px' }}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          endIcon={<CheckCircleOutline />}
          sx={{ borderRadius: '8px' }}
        >
          Finalizar
        </Button>
      </Box>
    </Box>
  );
};

export default Quinary;
