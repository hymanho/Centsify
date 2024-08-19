import React, { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import EditExpenseForm from './EditExpenseForm';
import { getExpenseContainer, addExpense, analyzeSpendingPatterns, detectAnomalies } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import { auth } from '../../../firebase';
import '../../../styles/ExpenseSummaryField.css'; // Import the CSS file for styling
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'; // Icons for warning and success

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [spendingAnalysis, setSpendingAnalysis] = useState({});
  const [anomalyDetected, setAnomalyDetected] = useState(false);

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

          // Check for anomalies
          const anomaly = expensesList.some(expense => detectAnomalies(expensesList, expense));
          setAnomalyDetected(anomaly);
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

      // Re-run analysis and anomaly detection after adding a new expense
      const analysis = analyzeSpendingPatterns(updatedExpenses.expenses || []);
      setSpendingAnalysis(analysis);

      const anomaly = updatedExpenses.expenses.some(expense => detectAnomalies(updatedExpenses.expenses, expense));
      setAnomalyDetected(anomaly);
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
        <h3 className="card-title">Spending Analysis</h3>
        {Object.entries(spendingAnalysis).map(([category, average]) => (
          <div key={category} className="spending-item">
            <strong>{category}:</strong> Average spending: <span className="spending-amount">${average.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {anomalyDetected && (
        <div className="anomaly-warning card">
          <FaExclamationTriangle className="warning-icon" />
          <h3 className="card-title">Anomaly Detected!</h3>
          <p>We've detected some unusual spending patterns. Please review your recent expenses.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummaryField;
