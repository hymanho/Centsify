import React, { useEffect, useState } from 'react';
import { getExpenses } from '../../../backend/Account/ExpenseManagement/ExpenseService';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch expenses and generate alerts
    const fetchAndGenerateAlerts = async () => {
      const expenses = await getExpenses('user@example.com'); // Replace with the actual user email
      console.log("Fetched Expenses:", expenses); // Log the expenses fetched
      const generatedAlerts = generateAlerts(expenses);
      console.log("Generated Alerts:", generatedAlerts); // Log the generated alerts
      setAlerts(generatedAlerts);
    };

    fetchAndGenerateAlerts();
  }, []);

  const generateAlerts = (expenses) => {
    const alerts = [];

    // Simple condition to ensure alerts are being generated
    if (expenses.length > 0) {
      alerts.push(`You have ${expenses.length} recorded expenses.`);
    }

    // Example condition: Alert if any expense exceeds $1000
    expenses.forEach((expense) => {
      if (expense.amount > 1000) {
        alerts.push(`High expense alert: ${expense.title} - $${expense.amount}`);
      }
    });

    // Example condition: Alert if more than 5 expenses added in the last 7 days
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

  return (
    <div>
      <h2>Alerts</h2>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      ) : (
        <p>No alerts at this time.</p>
      )}
    </div>
  );
};

export default Alerts;
