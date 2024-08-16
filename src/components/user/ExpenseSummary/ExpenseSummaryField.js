// src/components/ExpenseSummaryField.js
import React, { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import EditExpenseForm from './EditExpenseForm';
import { getExpenseContainer, addExpense } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import { auth } from '../../../firebase';
import '../../../styles/ExpenseSummaryField.css'; // Import the CSS file for styling

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
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
  }, [userEmail]);

  const handleAddExpense = async (newExpense) => {
    if (userEmail) {
      await addExpense(userEmail, newExpense);
      const updatedExpenses = await getExpenseContainer(userEmail);
      setExpenses(updatedExpenses.expenses || []);
      setShowAddForm(false);
    }
  };

  const handleEditExpense = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedExpenseId(null);
  };

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add Expense'}
      </button>
      {showAddForm && <AddExpenseForm onAddExpense={handleAddExpense} />}
      {showEditForm && 
        <EditExpenseForm 
          expenseId={selectedExpenseId} 
          onClose={handleCloseEditForm} 
          userEmail={userEmail}
        />
      }
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-bar">
            <span className="expense-title">{expense.title}</span>
            <span className="expense-amount">${expense.amount}</span>
            <span className="expense-date">{expense.date}</span>
            <span className="expense-category">{expense.category}</span>
            <span className="expense-description">{expense.description}</span>
            <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseSummaryField;