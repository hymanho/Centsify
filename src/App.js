import logo from './logo.svg';
import './App.css';
import React from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import LogOff from './components/LogOff';

function App() {
  return (
    <div>
      <h1>Firebase Authentication Example</h1>
      <SignUp />
      <Login />
      <LogOff />
    </div>
  );
}

export default App;
