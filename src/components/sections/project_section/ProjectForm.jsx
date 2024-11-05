// project_section/ProjectForm.js
import React, { useState } from 'react';
import { Button } from '@mui/material';
import First from './Form/First';
import Secondary from './Form/Secondary';
import Tertiary from './Form/Tertiary';
import Quaternary from './Form/Quaternary';
import Quinary from './Form/Quinary';

const ProjectForm = ({ onSubmit }) => {
  const [step, setStep] = useState(0); // Controla la sección actual
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    tipoAparceria: '',
    tamanoTerreno: '',
    duracionProyecto: '',
    numeroParticipantes: '',
    aportesParticipantes: '',
    recursosDisponibles: '',
    modalidadParticipacion: '',
    modeloReparto: '',
    nombreEncargado: '',
    correoContacto: '',
    telefonoContacto: '',
    aceptarTerminos: false,
    publicarComunidad: false,
    archivos: [],
    iconoSeleccionado: '',
  });

  const handleNext = (data) => {
    // Actualizar formData con los datos de la sección actual
    setFormData((prevData) => ({ ...prevData, ...data }));
    setStep(step + 1); // Avanza a la siguiente sección
  };

  const handlePrevious = () => {
    setStep(step - 1); // Retrocede a la sección anterior
  };

  const handleFinish = () => {
    onSubmit(formData); // Envía todos los datos al backend
  };

  return (
    <div>
      {step === 0 && (
        <First onNext={handleNext} initialValues={formData} />
      )}
      {step === 1 && (
        <Secondary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />
      )}
      {step === 2 && (
        <Tertiary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />
      )}
      {step === 3 && (
        <Quaternary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />
      )}
      {step === 4 && (
        <Quinary onNext={handleFinish} onPrevious={handlePrevious} initialValues={formData} />
      )}
      {step === 4 && (
        <Button variant="contained" color="primary" onClick={handleFinish} style={{ marginTop: '16px' }}>
          Finalizar
        </Button>
      )}
    </div>
  );
};

export default ProjectForm;
