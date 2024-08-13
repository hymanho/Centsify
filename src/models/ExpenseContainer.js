// ExpenseContainer.js
import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense, editExpense, deleteExpense } from './ExpenseService'; // Adjust the path as necessary

const ExpenseContainer = ({ userEmail }) => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenseList = await getExpenses(userEmail); // Fetch expenses for the specific user
        setExpenses(expenseList);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };

    fetchExpenses();
  }, [userEmail]); // Re-fetch if userEmail changes

  // Add an expense
  const handleAddExpense = async (expenseData) => {
    try {
      await addExpense(userEmail, expenseData);
      setExpenses((prevExpenses) => [...prevExpenses, expenseData]);
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  // Edit an expense
  const handleEditExpense = async (expenseId, updatedFields) => {
    try {
      await editExpense(userEmail, expenseId, updatedFields);
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === expenseId ? { ...expense, ...updatedFields } : expense
        )
      );
    } catch (error) {
      console.error("Error editing expense: ", error);
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(userEmail, expenseId);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.title} - ${expense.amount} ({expense.category})
            <button onClick={() => handleEditExpense(expense.id, { /* updated fields */ })}>Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Example of adding an expense */}
      <button onClick={() => handleAddExpense({ id: Date.now().toString(), title: 'New Expense', amount: 50, date: new Date().toISOString(), category: 'Food', description: 'Lunch' })}>Add Expense</button>
    </div>
  );
};

export default ExpenseContainer;
