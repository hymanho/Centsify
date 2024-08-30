import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const res = await axios.post('http://127.0.0.1:5000/chat', { message });
      setResponses([...responses, { message, response: res.data.response }]);
      setMessage('');
    } catch (error) {
      console.error("There was an error sending the message!", error);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div>
        {responses.map((item, index) => (
          <div key={index}>
            <p><strong>You:</strong> {item.message}</p>
            <p><strong>Bot:</strong> {item.response}</p>
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbot;