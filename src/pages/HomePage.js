/*

Defines the HomePage component, which serves as the landing page of the application. 
It includes the Centsible logo, a hero section, and options to log in or sign up.

*/

import React from 'react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import '../styles/HomePage.css';
import logo from '../assets/centsible-logo.png';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Header section with logo and title */}
      <header className="page-header">
        <img src={logo} alt="Centsify Logo" className="logo" />
        <h1>Centsify</h1>
      </header>

      {/* Hero section with a brief description of the app's purpose */}
      <section className="hero-section">
        <h2>Take Control of Your Finances</h2>
        <p>
          Track your expenses, manage your budget, and achieve your financial goals with Centsify!
        </p>
      </section>

      {/* Login and Signup forms */}
      <div className="auth-forms">
        <Login />
        <SignUp />
      </div>
    </div>
  );
};

export default HomePage;
