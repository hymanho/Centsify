import React, { useEffect, useState } from 'react';
import { getExpenses } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import '../../../styles/Chatbot.css'; // Import CSS for styling

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", type: "bot" }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch expenses and generate alerts when the component mounts
    const fetchAndGenerateAlerts = async () => {
      const expenses = await getExpenses('user@example.com'); // Replace with actual user email
      const generatedAlerts = generateAlerts(expenses);
      setMessages(prevMessages => [
        ...prevMessages,
        ...generatedAlerts.map(alert => ({ text: alert, type: 'bot' }))
      ]);
    };

    fetchAndGenerateAlerts();
  }, []);

  const generateAlerts = (expenses) => {
    const alerts = [];
    if (expenses.length > 0) {
      alerts.push(`You have ${expenses.length} recorded expenses.`);
    }
    expenses.forEach((expense) => {
      if (expense.amount > 1000) {
        alerts.push(`High expense alert: ${expense.title} - $${expense.amount}`);
      }
    });
    const recentExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
      return expenseDate > oneWeekAgo;
    });
    if (recentExpenses.length > 5) {
      alerts.push(`You have added more than 5 expenses in the last 7 days.`);
    }
    return alerts;
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: input, type: 'user' }
      ]);
      setInput('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
