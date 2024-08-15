import React, { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import { getExpenseContainer } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import { auth } from '../../../firebase';
import '../../../styles/ExpenseSummaryField.css'; // Import the CSS file for styling

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        setUserEmail(email);
        const expenseContainer = await getExpenseContainer(email);
        if (expenseContainer) {
          setExpenses(expenseContainer.expenses || []);
        }
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense) => {
    if (userEmail) {
      await addExpense(userEmail, newExpense);
      setExpenses([...expenses, newExpense]);
      setShowForm(false); // Hide the form after adding the expense
    }
  };

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Expense'}
      </button>
      {showForm && <AddExpenseForm onAddExpense={handleAddExpense} />}
      <div className="expense-list">
        {expenses.map((expense, index) => (
          <div key={index} className="expense-bar">
            <span className="expense-title">{expense.title}</span>
            <span className="expense-amount">${expense.amount}</span>
            <span className="expense-date">{expense.date}</span>
            <span className="expense-category">{expense.category}</span>
            <span className="expense-description">{expense.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseSummaryField;
