import React, { useState, useEffect } from 'react';

const ExpenseSummary = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        // Here, fetch data from your backend or API
        fetch('/api/expenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error fetching expenses:', error));
    }, []);

    return (
        <div>
            <h2>Expense Summary</h2>
            <ul>
                {expenses.map((expense, index) => (
                    <li key={index}>{expense.category}: ${expense.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseSummary;
