// src/components/auth/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn, getCurrentUserToken } from '../../backend/auth/login';
import '../../styles/AuthForms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      console.log('Successfully logged in');
      navigate('/account');
    } catch (error) {
      console.log('Login failed:', error.message);
      setError('Wrong username or password, please try again.');
    }

    const userToken = await getCurrentUserToken();
    console.log('User token:', userToken);

    await fetch('http://localhost:5000/store-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: userToken }), // Pass token to server
    });

  };

  return (
    <div className="card">
      <div className="form-section">
        <div className="header">Login</div>
        <div className="form-container">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
