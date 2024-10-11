// src/components/user/ExpenseSummary/EditExpenseForm.js

/*

Defines the EditExpenseForm component, which allows users to edit or delete an existing expense.
It retrieves the expense data based on the provided expenseId and userEmail. The form includes
fields for title, amount, date, category, and description. After editing or deleting the expense,
the form is closed upon saving or deletion.

*/

import React, { useState, useEffect } from 'react';
import {
  editExpense,
  deleteExpense,
  getExpense,
} from '../../../backend/Account/ExpenseManagement/ExpenseService';
import '../../../styles/Account/Expenses/EditExpenseForm.css';

const EditExpenseForm = ({ expenseId, onClose, userEmail }) => {
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
  });

  // Fetch the expense data when the component mounts
  useEffect(() => {
    const fetchExpense = async () => {
      const fetchedExpense = await getExpense(userEmail, expenseId);
      if (fetchedExpense) {
        setExpense(fetchedExpense);
        setFormData({
          title: fetchedExpense.title,
          amount: fetchedExpense.amount,
          date: fetchedExpense.date,
          category: fetchedExpense.category,
          description: fetchedExpense.description,
        });
      }
    };
    fetchExpense();
  }, [expenseId, userEmail]);

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle saving the edited expense
  const handleSave = async () => {
    await editExpense(userEmail, expenseId, formData);
    onClose(); // Close the form after saving
  };

  // Handle deleting the expense
  const handleDelete = async () => {
    await deleteExpense(userEmail, expenseId);
    onClose(); // Close the form after deletion
  };

  return (
    <div className="card">
      <h3 className="card-title">Edit Expense</h3>
      <form className="form-container">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-field"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
        ></textarea>
        <div className="button-group">
          <button
            type="button"
            onClick={handleSave}
            className="custom-button save-button"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="custom-button delete-button"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="custom-button cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExpenseForm;
