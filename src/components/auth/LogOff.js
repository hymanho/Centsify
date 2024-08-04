// src/components/LogOff.js
import React from 'react';
import { logOff } from '../../auth';

const LogOff = () => {
  const handleLogOff = async () => {
    try {
      await logOff();
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