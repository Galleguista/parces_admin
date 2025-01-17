import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/login-page';
import AdminPage from './components/AdminPage';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refresh_token');

      console.log('Validando token...');

      if (!token && refreshToken) {
        console.log('No se encontró access_token, intentando renovar con refresh_token...');
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('token', response.data.access_token);
          console.log('Token renovado exitosamente.');
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error renovando el token:', error);
          localStorage.removeItem('refresh_token');
          setIsLoggedIn(false);
        }
      } else if (token) {
        console.log('Verificando el access_token...');
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/validate`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log('Token válido.');
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error validando el token:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } else {
        console.log('No se encontraron tokens válidos.');
        setIsLoggedIn(false);
      }

      setLoading(false); // Finaliza la validación
    };

    validateToken();
  }, []);

  const handleLogin = () => {
    console.log('Usuario logueado exitosamente.');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión del usuario.');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <>
      {loading ? (
        <div>Cargando...</div> // Mostrar mensaje de carga mientras valida
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/admin" element={isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? '/admin' : '/login'} />} />
        </Routes>
      )}
    </>
  );
};

export default App;
