/*

This component creates a chatbot interface using React. It handles user input, sends messages to a chatbot API, and displays the chat history between the user and the bot.

It includes features such as:
- Typing indicator while the bot processes a response
- Auto-scrolling to the latest message
- Clearing the input field after sending a message

*/

import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/Account/Chatbot/Chatbot.css'; // Import the updated CSS file for chatbot styling

const Chatbot = () => {
    const [inputMessage, setInputMessage] = useState(''); // State to track the input message
    const [messages, setMessages] = useState([]); // State to track the conversation (messages)
    const [isTyping, setIsTyping] = useState(false); // State to show the chatbot typing indicator
    const chatContainerRef = useRef(null); // Reference to the chat window for auto-scrolling

    // Function to handle sending messages when user presses Enter or clicks the send button
    const handleSend = async (event) => {
        if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
            event.preventDefault(); // Prevent the default form submit behavior
            if (inputMessage.trim() === '') return; // Do not send if the input is empty

            const userMessage = { sender: "user", text: inputMessage }; // Create a user message object
            setMessages(prev => [...prev, userMessage]); // Update message list with the user's message
            setIsTyping(true); // Show typing indicator while bot is generating a response

            try {
                // Send the user's message to the chatbot API
                const response = await fetch('https://localhost:5005/webhooks/rest/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender: 'test_user', message: inputMessage }), // Send message data in the request body
                });

                if (response.ok) {
                    const data = await response.json(); // Parse the response from the chatbot
                    const botText = data[0]?.text || "No response from chatbot."; // Get the bot's response text

                    // Simulate a typing delay for a more natural feel
                    setTimeout(() => {
                        const botMessage = { sender: "chatbot", text: botText }; // Create a chatbot message object
                        setMessages(prev => [...prev, botMessage]); // Update message list with bot's response
                        setIsTyping(false); // Hide typing indicator
                    }, 1000);
                } else {
                    throw new Error('Network response was not ok'); // Handle non-200 responses
                }
            } catch (error) {
                console.error('Fetch error:', error); // Log any errors encountered
                const errorMessage = { sender: "chatbot", text: "Sorry, something went wrong. Please try again later." };
                setMessages(prev => [...prev, errorMessage]); // Show an error message in case of failure
                setIsTyping(false); // Hide typing indicator
            }

            setInputMessage(''); // Clear the input field after the message is sent
        }
    };

    // Scroll to the bottom of the chat whenever messages or typing status changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Auto-scroll to the last message
        }
    }, [messages, isTyping]);

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <h2>Financial Assistant</h2> {/* Chatbot header */}
            </div>
            <div className="chat-window" ref={chatContainerRef}> {/* Chat window containing the conversation */}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.text} {/* Render each message */}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message chatbot typing"> {/* Show typing indicator when bot is processing */}
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span> {/* Dots for typing animation */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form className="input-area" onSubmit={(e) => e.preventDefault()}> {/* Input form */}
                <textarea
                    value={inputMessage} // Controlled input for user typing
                    onChange={(e) => setInputMessage(e.target.value)} // Update state on input change
                    onKeyDown={handleSend} // Send message on pressing Enter
                    placeholder="Type your message..."
                    rows={1} // Single line textarea
                />
                <button onClick={handleSend} aria-label="Send Message">➡️</button> {/* Send button */}
            </form>
        </div>
    );
};

export default Chatbot;