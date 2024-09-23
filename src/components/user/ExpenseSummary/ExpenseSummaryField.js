// src/components/user/ExpenseSummary/ExpenseSummaryField.js

/*

Defines the ExpenseSummaryField component, which displays a summary of the user's expenses. 
It allows users to add, edit, and view expenses. The component also includes spending analysis 
based on the user's expense data and detects anomalies in spending patterns. TensorFlow.js 
and a custom anomaly detection function are integrated to enhance spending analysis.

*/

import React, { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import EditExpenseForm from './EditExpenseForm';
import { getExpenseContainer, addExpense, analyzeSpendingPatterns, detectAnomalies } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import { auth } from '../../../firebase';
import '../../../styles/ExpenseSummaryField.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [spendingAnalysis, setSpendingAnalysis] = useState({});
  const [anomalyDetected, setAnomalyDetected] = useState(false);

  // Fetch expenses and analyze spending patterns on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        setUserEmail(email);
        const expenseContainer = await getExpenseContainer(email);
        if (expenseContainer) {
          const expensesList = expenseContainer.expenses || [];
          setExpenses(expensesList);

          // Analyze spending patterns
          const analysis = analyzeSpendingPatterns(expensesList);
          setSpendingAnalysis(analysis);

          // Check for anomalies in expenses
          const anomaly = expensesList.some(expense => detectAnomalies(expensesList, expense));
          setAnomalyDetected(anomaly);
        }
      }
    };

    fetchExpenses();
  }, [userEmail]);

  // Handle adding a new expense
  const handleAddExpense = async (newExpense) => {
    if (userEmail) {
      await addExpense(userEmail, newExpense);
      const updatedExpenses = await getExpenseContainer(userEmail);
      setExpenses(updatedExpenses.expenses || []);
      setShowAddForm(false);

      // Re-analyze spending and detect anomalies
      const analysis = analyzeSpendingPatterns(updatedExpenses.expenses || []);
      setSpendingAnalysis(analysis);

      const anomaly = updatedExpenses.expenses.some(expense => detectAnomalies(updatedExpenses.expenses, expense));
      setAnomalyDetected(anomaly);
    }
  };

  // Handle editing an existing expense
  const handleEditExpense = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowEditForm(true);
  };

  // Close the edit form
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedExpenseId(null);
  };

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <button className="add-expense-btn" onClick={() => setShowAddForm(!showAddForm)}>
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
          <div key={expense.id} className="expense-card">
            <span className="expense-title">{expense.title}</span>
            <span className="expense-amount">${expense.amount}</span>
            <span className="expense-date">{expense.date}</span>
            <span className="expense-category">{expense.category}</span>
            <span className="expense-description">{expense.description}</span>
            <button className="edit-btn" onClick={() => handleEditExpense(expense.id)}>Edit</button>
          </div>
        ))}
      </div>
      
      <div className="spending-analysis card">
        <h3>Spending Analysis</h3>
        {Object.entries(spendingAnalysis).map(([category, average]) => (
          <div key={category} className="spending-item">
            <strong>{category}:</strong> Average spending: <span className="spending-amount">${average.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {anomalyDetected && (
        <div className="anomaly-warning card">
          <FaExclamationTriangle className="warning-icon" />
          <h3>Anomaly Detected!</h3>
          <p>We've detected some unusual spending patterns. Please review your recent expenses.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummaryField;
