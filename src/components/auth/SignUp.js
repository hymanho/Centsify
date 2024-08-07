//signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { storeAccount } from '../../backend/Account/AccountServices'; // Import the storeAccount function
import Account from '../../models/AccountDataModel'; // Import the Account class
import '../../styles/AuthForms.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create an Account object
            const account = new Account(
                username, // Use username for name field
                email,
                username,
                0, // Default balance
                'USD', // Default currency
                {}, // Default preferences
                [], // Default transactions
                {}, // Default security settings
                {}, // Default settings
                {}  // Default backup
            );

            // Store the Account object in Firestore
            await storeAccount(account);

            console.log('Account successfully created:', user);
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
