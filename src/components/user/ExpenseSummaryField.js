// src/components/user/ExpenseSummary.js

import React, { useState } from 'react';
import AddExpenseForm from './ExpenseSummary/AddExpenseForm';

const ExpenseSummary = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, category: 'Food', amount: 120, date: '2023-08-01' },
        { id: 2, category: 'Utilities', amount: 80, date: '2023-08-05' }
    ]);
    const [showForm, setShowForm] = useState(false);

    const handleAddExpense = (newExpense) => {
        setExpenses([...expenses, newExpense]);
    };

    return (
        <div>
            <h2>Expense Summary</h2>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Expense'}
            </button>
            {showForm && <AddExpenseForm onAddExpense={handleAddExpense} />}
            <ul>
                {expenses.map(expense => (
                    <li key={expense.id}>
                        {expense.category}: ${expense.amount} on {expense.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseSummary;