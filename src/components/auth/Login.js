// src/components/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../backend/login'; // route back to auth.js
import { auth } from '../../firebase';
import '../../styles/Login.css';  // Check this path is correct.

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      console.log('Successfully logged in'); // Log message after successful login
      navigate('/account'); // Redirect to account page
    } catch (error) {
      console.log('Login failed:', error.message); // Log error message for debugging
      setError('Wrong username or password, please try again.'); // Display user-friendly error message
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
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
  );
};

export default Login;