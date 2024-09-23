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
      bio: "Hi! My name is Diljan Shah, I'm a highly motivated and dedicated computer science student at SU, pursuing my Bachelor's degree in Computer Science. With a strong passion for innovation and a genuine interest in software development, I am constantly seeking opportunities to expand my knowledge and skills in this dynamic field.\n\nLet's connect and discuss the exciting possibilities of working together. Feel free to reach out to me via LinkedIn or my email at diljanshah119@gmail.com",
      linkedIn: 'https://www.linkedin.com/in/diljan-shah',  // Add your LinkedIn URL here
      github: 'https://github.com/diljanshah333',  // Add your GitHub URL here
    },
    {
      name: 'Hyman Ho',
      role: 'Lead Developer',
      image: creator2,
      bio: 'You can achieve anything you put your mind to!',
      linkedIn: 'https://www.linkedin.com/in/hymanho',
      github: 'https://github.com/hymanho',
    },
  ];

  const projectMission = "Our mission with this AI-powered expense tracking application is to revolutionize the way individuals manage their personal finances. The application helps users track expenses, gain insights through detailed reports, and leverage AI-driven predictions to plan better for the future. Our chatbot assistant provides instant support to answer financial queries and offers advice tailored to spending habits. By making financial management simple, intuitive, and powerful, we aim to empower users to take control of their finances and make informed decisions.";

  return (
    <div className="about-tab">
      <h2>About Us</h2>
      <div className="about-content">
        <div className="creators-list">
          {creators.map((creator) => (
            <div key={creator.name} className="creator-card">
              <img src={creator.image} alt={creator.name} className="creator-image" />
              <h3>{creator.name}</h3>
              <p><strong>{creator.role}</strong></p>
              <p>{creator.bio}</p>
              {/* Add section for GitHub and LinkedIn links with icons */}
              <div className="social-links">
                <a
                  href={creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <i className="fab fa-github"></i> GitHub
                </a>
                <a
                  href={creator.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Project Mission Section */}
        <div className="project-mission">
          <h3>Project Mission</h3>
          <p>{projectMission}</p>
        </div>
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
