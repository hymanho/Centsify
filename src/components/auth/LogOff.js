// src/components/LogOff.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOff } from '../../backend/auth/logOff';  // Adjust path if needed

const LogOff = () => {
  const navigate = useNavigate();

  const handleLogOff = async () => {
    try {
      await logOff();
      navigate('/');  // Redirect to HomePage after logging off
      alert('Logged off successfully');
    } catch (error) {
      console.error('Error logging off:', error);
    }
  };

  return (
    <button onClick={handleLogOff}>Log Off</button>
  );
};

export default LogOff;