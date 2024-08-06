import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';  // Adjusted from '../../firebase'
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseSummary from '../components/auth/ExpenseSummary';
import Reports from '../components/auth/Reports';
import Alerts from '../components/auth/Alerts';

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
    <div>
      <h1>Dashboard</h1>
      <nav>
        <NavLink to="expenses" className={({ isActive }) => isActive ? 'active' : ''}>Expense Summary</NavLink>
        <NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
        <NavLink to="alerts" className={({ isActive }) => isActive ? 'active' : ''}>Alerts</NavLink>
      </nav>
      <Routes>
        <Route path="expenses" element={<ExpenseSummary />} />
        <Route path="reports" element={<Reports />} />
        <Route path="alerts" element={<Alerts />} />
      </Routes>
      <p>Welcome, {user.email}!</p>
    </div>
  );
};

export default AccountPage;
