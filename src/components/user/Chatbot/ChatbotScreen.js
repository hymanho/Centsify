import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/Chatbot.css'; // Import the CSS file

const Chatbot = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]); // Track messages

    const handleSend = async () => {
        if (!inputMessage.trim()) return; // Prevent sending empty messages

        const userMessage = { sender: 'test_user', message: inputMessage };
        setMessages((prev) => [...prev, { text: inputMessage, from: 'user' }]); // Add user message to history

        try {
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userMessage),
            });

            const data = await response.json();
            if (data.length > 0 && data[0]?.text) {
                setMessages((prev) => [...prev, { text: data[0].text, from: 'bot' }]); // Add bot response
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        // Clear input field
        setInputMessage('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-response">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.from === 'user' ? 'user-message' : 'bot-message'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} className="send-button">➤</button>
            </div>
        </div>
    );
};

export default Chatbot;