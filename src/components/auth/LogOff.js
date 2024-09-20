// src/components/auth/LogOff.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOff } from '../../backend/auth/logOff';

const LogOff = () => {
  const navigate = useNavigate();

  const handleLogOff = async () => {
    try {
      await logOff();
      // Fetch the clear token endpoint after logging off
      await fetch('http://localhost:5000/clear-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/'); // Redirect to HomePage after logging off
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
