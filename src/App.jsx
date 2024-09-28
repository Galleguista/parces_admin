import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/login-page';
import RegisterPage from './components/login/register-page';
import AdminPage from './components/AdminPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Routes>
      {/* Ruta pública para la vista de registro */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Si el usuario está logueado, redirigir a /admin */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />} />

      {/* Ruta pública para la vista de login */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Ruta protegida para el admin */}
      <Route path="/admin" element={isLoggedIn ? <AdminPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
