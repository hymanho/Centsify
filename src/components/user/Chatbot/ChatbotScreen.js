import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Chatbot.css';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatHistoryRef = useRef(null);

    const handleSend = async () => {
        if (!message.trim()) return;
    
        setIsLoading(true);
        try {
            console.log('Sending message:', message);
            setResponses(prevResponses => [...prevResponses, { type: 'user', content: message }]);
            
            const result = await axios.post('http://localhost:5000/chat', {
                message: message,
                data: {}
            });
    
            console.log('Backend response:', result.data);
    
            setResponses(prevResponses => [
                ...prevResponses,
                { type: 'bot', content: result.data.response || 'No response from bot.' }
            ]);
    
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setResponses(prevResponses => [
                ...prevResponses,
                { type: 'bot', content: 'Error sending message. Please try again.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [responses]);

    return (
        <div className="chatbot-container">
            <h3>Chat with our Assistant</h3>
            <p>Ask any questions, and our AI assistant will help you.</p>
            <div className="chat-history" ref={chatHistoryRef}>
                {responses.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.type}`}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && <div className="loading-message">Typing</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input-area">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="  Type your message here..."
                    rows="1"
                />
                <button onClick={handleSend} disabled={isLoading}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
