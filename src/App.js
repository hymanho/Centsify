import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tailwind.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account/*" element={<AccountPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
