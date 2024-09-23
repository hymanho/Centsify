/*

Defines the AccountPage component, which serves as the main dashboard after a user logs in. 
It includes navigation to different sections like Expense Summary, Reports, Chatbot, and About.

*/

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseSummaryField from '../components/user/ExpenseSummary/ExpenseSummaryField';
import Reports from '../components/user/ExpenseReports/Reports';
import Chatbot from '../components/user/Chatbot/ChatbotScreen';
import About from '../components/user/AboutDisplay/AboutScreen';
import LogOff from '../components/auth/LogOff';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirects to login if the user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');  // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  // If user is not available, render nothing (optional: add a spinner here)
  if (!user) {
    return null;  
  }

  return (
    <div className="account-page">
      {/* Sidebar for navigation */}
      <nav className="sidebar">
        <h1><i className="fas fa-home"></i> Dashboard</h1>
        <NavLink to="expenses" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-wallet"></i> Expense Summary
        </NavLink>
        <NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-chart-bar"></i> Reports
        </NavLink>
        <NavLink to="chatbot" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-comments"></i> Chatbot
        </NavLink>
        <NavLink to="about" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-info-circle"></i> About
        </NavLink>
        <div className="logoff-container">
          <LogOff />  {/* Add LogOff button here */}
        </div>
      </nav>

      {/* Main content area for displaying components based on selected route */}
      <div className="main-content">
        <Routes>
          <Route path="expenses" element={<ExpenseSummaryField />} />  
          <Route path="reports" element={<Reports />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
};

export default AccountPage;
