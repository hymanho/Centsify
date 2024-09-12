import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Chatbot.css'; // Import CSS file for styling

const SimpleChatbot = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            const result = await axios.post('http://localhost:5000/chat', {
                message: message,
                data: {}  // Include any relevant data for prediction if needed
            });
            setResponse(result.data.response || 'No response from server');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setResponse('Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="simple-chatbot-container">
            <div className="message-input">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows="2"
                />
                <button onClick={handleSend} disabled={isLoading}>Send</button>
            </div>
            <div className="response-area">
                {isLoading ? <div>Loading...</div> : <div>{response}</div>}
            </div>
        </div>
    );
};

export default SimpleChatbot;