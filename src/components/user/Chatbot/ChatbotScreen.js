import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/Chatbot.css'; // Import the CSS file

const Chatbot = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]); // Track chat history
    const chatContainerRef = useRef(null); // Ref to scroll to the bottom

    const handleSend = async (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            const userMessage = { sender: "user", text: inputMessage };
            setMessages(prev => [...prev, userMessage]); // Add user's message

            try {
                const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender: 'test_user', message: inputMessage }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const botMessage = { sender: "chatbot", text: data[0]?.text || "No response from chatbot." };
                    setMessages(prev => [...prev, botMessage]); // Add chatbot's response
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }

            setInputMessage(''); // Clear input field
        }
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    return (
        <div className="chatbot-container">
            <div className="chat-window" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleSend}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>➡️</button>
            </div>
        </div>
    );
};

export default Chatbot;