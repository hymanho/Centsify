// src/pages/HomePage.js
import React from 'react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import './HomePage.css'; // Create this CSS file for home page specific styles

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Our App</h1>
      <div className="auth-forms">
        <Login />
        <SignUp />
      </div>
    </div>
  );
};

export default HomePage;