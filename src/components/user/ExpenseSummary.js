// src/components/user/ExpenseSummary.js

import React, { useState } from 'react';
import AddExpenseForm from './Expenses/AddExpenseForm';

const ExpenseSummary = () => {
    const [expenses, setExpenses] = useState([]); // Initialize with an empty array
    const [showForm, setShowForm] = useState(false);

    const handleAddExpense = (newExpense) => {
        setExpenses([...expenses, newExpense]);
        setShowForm(false); // Close the form upon successfully adding an expense
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