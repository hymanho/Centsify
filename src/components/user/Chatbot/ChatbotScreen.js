import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Chatbot.css'; // Import CSS file for styling

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            const result = await axios.post('http://localhost:5000/chat', {
                message: message,
                data: {}  // Include any relevant data for prediction if needed
            });
            setResponses([...responses, { user: message, bot: result.data.response }]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setResponses([...responses, { user: message, bot: 'Error sending message. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [responses]);

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h1>Chatbot</h1>
            </div>
            <div className="chatbot-messages">
                {responses.map((msg, index) => (
                    <div key={index} className={`chatbot-message ${msg.user ? 'user' : 'bot'}`}>
                        <span>{msg.user || msg.bot}</span>
                    </div>
                ))}
                {isLoading && <div className="chatbot-message bot">Typing...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows="2"
                />
                <button onClick={handleSend} disabled={isLoading}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;