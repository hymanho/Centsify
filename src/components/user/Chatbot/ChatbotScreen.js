import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import '../../../styles/Chatbot.css'; // Ensure you have the updated CSS

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to the bottom whenever the chat history updates
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = { sender: 'user', text: message };
        setChatHistory((prevHistory) => [...prevHistory, userMessage]);
        setMessage('');

        setIsLoading(true);
        try {
            const result = await axios.post('http://localhost:5000/chat', {
                message: message,
                data: {}  // Include any relevant data for prediction if needed
            });

            const botMessage = { sender: 'bot', text: result.data.response || 'No response from server' };
            setChatHistory((prevHistory) => [...prevHistory, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const botMessage = { sender: 'bot', text: 'Error sending message. Please try again.' };
            setChatHistory((prevHistory) => [...prevHistory, botMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press to send the message
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-history">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`message-bubble ${chat.sender}`}>
                        {chat.text}
                    </div>
                ))}
                {isLoading && <div className="loading-message">Bot is typing...</div>}
                <div ref={chatEndRef} /> {/* Target for scrolling */}
            </div>
            <div className="message-input-area">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    rows="1"
                />
                <button onClick={handleSend} disabled={isLoading}>Send</button>
            </div>
        </div>
    );
};;

export default Chatbot;