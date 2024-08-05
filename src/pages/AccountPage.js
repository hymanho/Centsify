// src/components/Account.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Account = () => {
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
      <h2>Account Page</h2>
      <p>Welcome, {user.email}!</p>
    </div>
  );
};

export default Account;