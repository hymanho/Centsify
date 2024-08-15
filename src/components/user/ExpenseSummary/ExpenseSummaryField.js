import React, { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import { getExpenseContainer, addExpense } from '../../../backend/Account/ExpenseManagement/ExpenseService';
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
        console.log('Fetching expenses for:', email);  // Debugging log
        const expenseContainer = await getExpenseContainer(email);
        if (expenseContainer) {
          console.log('Expenses fetched:', expenseContainer.expenses);  // Debugging log
          setExpenses(expenseContainer.expenses || []);
        }
      }
    };

    fetchExpenses();
  }, [userEmail]);  // Fetch data whenever the userEmail changes

  const handleAddExpense = async (newExpense) => {
    if (userEmail) {
      console.log('Adding new expense:', newExpense);  // Debugging log
      // Add the new expense to Firebase
      await addExpense(userEmail, newExpense);
      
      // Fetch the updated list of expenses from Firebase
      const updatedExpenses = await getExpenseContainer(userEmail);
      console.log('Updated expenses from Firebase:', updatedExpenses.expenses);  // Debugging log
      
      setExpenses(updatedExpenses.expenses || []);
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
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-bar">
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
