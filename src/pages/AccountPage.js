import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';  // Adjusted from '../../firebase'
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseSummary from '../components/user/ExpenseSummary';
import Reports from '../components/user/Reports';
import Alerts from '../components/user/Alerts';
import '../styles/AccountPage.css'; // Import the CSS file

const AccountPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner, if desired
  }

  return (
    <div className="account-page">
      <nav className="sidebar">
        <h1>Dashboard</h1>
        <NavLink to="expenses" className={({ isActive }) => isActive ? 'active' : ''}>Expense Summary</NavLink>
        <NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
        <NavLink to="alerts" className={({ isActive }) => isActive ? 'active' : ''}>Alerts</NavLink>
      </nav>
      <div className="main-content">
        <Routes>
          <Route path="expenses" element={<ExpenseSummary />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
        </Routes>
        <p>Welcome, {user.email}!</p>
      </div>
    </div>
  );
};

export default AccountPage;
