// src/components/user/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Chatbot.css';  // Create a corresponding CSS file for styling

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    const newMessage = { sender: 'user', text: userInput };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post('/api/chatbot', { input: userInput });
      const aiMessage = { sender: 'bot', text: response.data.response };
      setMessages([...messages, newMessage, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI chatbot:', error);
    }

    setUserInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;