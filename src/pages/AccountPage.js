import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';  // Ensure this path correctly points to your Firebase configuration
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseSummaryField from '../components/user/ExpenseSummary/ExpenseSummaryField';  // Corrected import path
import Reports from '../components/user/ExpenseReports/Reports';
import Chatbot from '../components/user/Chatbot/ChatbotScreen';
import LogOff from '../components/auth/LogOff';  // Import the LogOff component
import '../styles/AccountPage.css';  // Ensure the CSS path is correct

// Import images from the assets folder
import creator1 from '../assets/centsiblebiopic.jpg';  // Adjust the path based on your project structure
import creator2 from '../assets/centsiblebiopic2.jpg';

const About = () => {
  const creators = [
    {
      name: 'Diljan Shah',
      role: 'Lead Developer',
      image: creator1,  // Use the imported image
      bio: 'Never give up on your dreams!',
    },
    {
      name: 'Hyman Ho',
      role: 'Lead Developer',
      image: creator2,  // Use the imported image
      bio: 'You can achieve anything you put your mind to!',
    },
  ];

  return (
    <div className="about-tab">
      <h2>About Us</h2>
      <div className="creators-list">
        {creators.map((creator) => (
          <div key={creator.name} className="creator-card">
            <img src={creator.image} alt={creator.name} className="creator-image" />
            <h3>{creator.name}</h3>
            <p><strong>{creator.role}</strong></p>
            <p>{creator.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
        <h1>Dashboard</h1>
        <NavLink to="expenses" className={({ isActive }) => isActive ? 'active' : ''}>Expense Summary</NavLink>
        <NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
        <NavLink to="chatbot" className={({ isActive }) => isActive ? 'active' : ''}>Chatbot</NavLink>
        <NavLink to="about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
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
