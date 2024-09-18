// src/pages/HomePage.js

import React from 'react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import '../styles/HomePage.css';
import logo from '../assets/centsible-logo.png';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="page-header">
        <img src={logo} alt="Centsible Logo" className="logo" />
        <h1>Centsible</h1>
      </header>

      <section className="hero-section">
        <h2>Take Control of Your Finances</h2>
        <p>
          Track your expenses, manage your budget, and achieve your financial goals with Centsible.
        </p>
      </section>

      <div className="auth-forms">
        <Login />
        <SignUp />
      </div>
    </div>
  );
};

export default HomePage;
