import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/AuthForms.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            console.log('Account successfully created:', userCredential.user);
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
