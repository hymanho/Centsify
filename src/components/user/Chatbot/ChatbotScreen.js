import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/ChatbotScreen.css'; // Import your CSS file for styling

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleMessageSend = async () => {
    if (message.trim() === '') return;

    setChatHistory([...chatHistory, { text: message, type: 'user' }]);

    try {
      const response = await axios.post('/api/chat', { message });
      const botReply = response.data.reply;
      setChatHistory([...chatHistory, { text: message, type: 'user' }, { text: botReply, type: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
  };

  return (
    <div className="chatbot-screen">
      <div className="chat-history">
        {chatHistory.map((entry, index) => (
          <div key={index} className={`chat-entry ${entry.type}`}>
            {entry.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotScreen;