// src/components/user/ExpenseSummaryField.js

import React, { useState, useEffect } from 'react';
import AddExpenseForm from '../AddExpenseForm'; // Update this path if the location is different
import { getExpenses } from '../../backend/ExpenseManagement/ExpenseService'; // Correct import for ExpenseService functions

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      const userEmail = "user@example.com"; // Replace with actual email from context or props
      const userExpenses = await getExpenses(userEmail);
      setExpenses(userExpenses);
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    setShowForm(false); // Hide the form after adding the expense
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
            {expense.title}: ${expense.amount} on {expense.date} in {expense.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummaryField;
