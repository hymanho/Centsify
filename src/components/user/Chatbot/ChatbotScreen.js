import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/Chatbot.css'; // Import the updated CSS file

const Chatbot = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]); // Track chat history
    const [isTyping, setIsTyping] = useState(false); // Typing indicator
    const chatContainerRef = useRef(null); // Ref to scroll to the bottom

    const handleSend = async (event) => {
        if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
            event.preventDefault(); // Prevent default Enter key behavior
            if (inputMessage.trim() === '') return; // Do not send empty messages

            const userMessage = { sender: "user", text: inputMessage };
            setMessages(prev => [...prev, userMessage]); // Add user's message
            setIsTyping(true); // Show typing indicator

            try {
                const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender: 'test_user', message: inputMessage }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const botText = data[0]?.text || "No response from chatbot.";
                    // Simulate typing delay
                    setTimeout(() => {
                        const botMessage = { sender: "chatbot", text: botText };
                        setMessages(prev => [...prev, botMessage]); // Add chatbot's response
                        setIsTyping(false);
                    }, 1000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                const errorMessage = { sender: "chatbot", text: "Sorry, something went wrong. Please try again later." };
                setMessages(prev => [...prev, errorMessage]);
                setIsTyping(false);
            }

            setInputMessage(''); // Clear input field
        }
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <h2>Financial Assistant</h2>
            </div>
            <div className="chat-window" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message chatbot typing">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form className="input-area" onSubmit={(e) => e.preventDefault()}>
                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleSend}
                    placeholder="Type your message..."
                    rows={1}
                />
                <button onClick={handleSend} aria-label="Send Message">➡️</button>
            </form>
        </div>
    );
};

export default Chatbot;
