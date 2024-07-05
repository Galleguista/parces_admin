import React, { useState } from 'react';
import LoginPage from './components/login/login-page';
import AdminPage from './components/AdminPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? <AdminPage /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
};

export default App;
