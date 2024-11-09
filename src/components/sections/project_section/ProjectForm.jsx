import React, { useState, useEffect } from 'react';
import First from './Form/First';
import Secondary from './Form/Secondary';
import Tertiary from './Form/Tertiary';
import Quaternary from './Form/Quaternary';
import Quinary from './Form/Quinary';

const ProjectForm = ({ onSubmit, initialValues }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    tipo_aparceria: '',
    tamano_terreno: '',
    duracion_proyecto: '',
    numero_participantes: '',
    aportes_participantes: '',
    recursos_disponibles: '',
    modalidad_participacion: '',
    modelo_reparto: '',
    nombre_encargado: '',
    correo_contacto: '',
    telefono_contacto: '',
    icono_seleccionado: '',
    aceptar_terminos: false,
    publicar_comunidad: false,
    ...initialValues,
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, ...initialValues }));
  }, [initialValues]);

  const handleNext = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFinish = () => {
    onSubmit(formData);
  };

  // Define la función onFieldUpdate
  const onFieldUpdate = (updatedField) => {
    setFormData((prevData) => ({ ...prevData, ...updatedField }));
  };

  return (
    <div>
      {step === 0 && <First onNext={handleNext} initialValues={formData} />}
      {step === 1 && <Secondary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />}
      {step === 2 && <Tertiary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />}
      {step === 3 && <Quaternary onNext={handleNext} onPrevious={handlePrevious} initialValues={formData} />}
      {step === 4 && (
        <Quinary
          onNext={handleFinish}
          onPrevious={handlePrevious}
          initialValues={formData}
          onFieldUpdate={onFieldUpdate} // Pasa la función onFieldUpdate como prop
        />
      )}
    </div>
  );
};

export default ProjectForm;
