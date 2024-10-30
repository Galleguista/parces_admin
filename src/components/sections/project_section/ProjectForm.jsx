// project_section/ProjectForm.js
import React, { useState } from 'react';
import { Button } from '@mui/material';
import First from './Form/First';
import Secondary from './Form/Secondary';
import Tertiary from './Form/Tertiary';
import Quaternary from './Form/Quaternary';
import Quinary from './Form/Quinary';

const ProjectForm = () => {
  const [step, setStep] = useState(0); // Controla la sección actual
  const [formData, setFormData] = useState({}); // Almacena todos los datos del formulario

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1); // Avanza a la siguiente sección
  };

  const handlePrevious = () => {
    setStep(step - 1); // Retrocede a la sección anterior
  };

  return (
    <div>
      {step === 0 && <First onNext={handleNext} />}
      {step === 1 && <Secondary onNext={handleNext} onPrevious={handlePrevious} />}
      {step === 2 && <Tertiary onNext={handleNext} onPrevious={handlePrevious} />}
      {step === 3 && <Quaternary onNext={handleNext} onPrevious={handlePrevious} />}
      {step === 4 && <Quinary onNext={handleNext} onPrevious={handlePrevious} />}
      {/* Finalizar el formulario aquí */}
    </div>
  );
};

export default ProjectForm;
