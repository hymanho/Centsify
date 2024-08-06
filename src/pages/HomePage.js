import React from 'react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import '../styles/HomePage.css'; // Ensure this is correctly linked

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="page-header">
        Money Tracker
      </header>
      <div className="auth-forms">
        <Login />
        <SignUp />
      </div>
    </div>
  );
};

export default HomePage;
