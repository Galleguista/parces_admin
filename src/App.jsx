import React, { useState } from 'react';
import LoginPage from './components/login/login-page';
import RegisterPage from './components/login/register-page';
import AdminPage from './components/AdminPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleShowRegister = () => {
    setIsRegistering(true);
  };

  const handleShowLogin = () => {
    setIsRegistering(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AdminPage />
      ) : isRegistering ? (
        <RegisterPage onRegister={handleShowLogin} />
      ) : (
        <LoginPage onLogin={handleLogin} onShowRegister={handleShowRegister} />
      )}
    </div>
  );
};

export default App;
