// src/components/auth/SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { storeAccount } from '../../backend/Account/AccountServices';
import Account from '../../models/AccountDataModel';
import '../../styles/auth/AuthForms.css';
import { getCurrentUserToken } from '../../backend/auth/login';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // Firebase user object

    // Build Account object with Firebase UID as primary key
    const account = new Account(
      user.uid,     // UID used as PK
      username,
      email,
      username,     // displayName (can be same as username)
      0,            // Default balance
      'USD',        // Default currency
      {},           // Default preferences
      {},           // Default alerts
      {},           // Default settings
      {}            // Default reports
    );

    // Store account in Firestore using UID as doc ID
    await storeAccount(account);

    console.log('Account successfully created:', user);

    // Optionally get user token for backend or chatbot use
    const userToken = await getCurrentUserToken();
    console.log('User token:', userToken);

    // Send token to backend API for session management
    await fetch('http://localhost:5000/store-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: userToken }),
    });

    // Redirect to account page after successful signup
    navigate('/account');
  } catch (error) {
    setError(error.message);
  }
};


  return (
    <div className="card">
      <div className="form-section">
        <div className="header">Sign Up</div>
        <div className="form-container">
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
