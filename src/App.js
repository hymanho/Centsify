import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Logout from './components/auth/LogOff';
import Account from './components/user/Account';
import firebase from './services/firebase';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<SignUp />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;