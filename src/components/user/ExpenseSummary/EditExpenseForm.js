import React, { useState, useEffect } from 'react';
import { editExpense, deleteExpense, getExpense } from '../../../backend/Account/ExpenseManagement/ExpenseService';

const EditExpenseForm = ({ expenseId, onClose, userEmail }) => {
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    await editExpense(userEmail, expenseId, formData);
    onClose(); // Close the form after saving
  };

  const handleDelete = async () => {
    await deleteExpense(userEmail, expenseId);
    onClose(); // Close the form after deletion
  };

  return (
    <div className="edit-expense-form">
      <h3>Edit Expense</h3>
      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Amount:
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
      </label>
      <label>
        Date:
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
      </label>
      <label>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditExpenseForm;