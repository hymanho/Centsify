import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';  // Ensure this path correctly points to your Firebase configuration
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseSummaryField from '../components/user/ExpenseSummary/ExpenseSummaryField';  // Corrected import path
import Reports from '../components/user/ExpenseReports/Reports';
import Chatbot from '../components/user/Chatbot/ChatbotScreen';
import About from '../components/user/AboutDisplay/AboutScreen';
import LogOff from '../components/auth/LogOff';  // Import the LogOff component
import '../styles/AccountPage.css';  // Ensure the CSS path is correct

const AccountPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');  // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  if (!user) {
    return null;  // Optionally, consider adding a loading spinner here
  }

  return (
    <div className="account-page">
      {/* Sidebar */}
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

      {/* Main Content */}
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
