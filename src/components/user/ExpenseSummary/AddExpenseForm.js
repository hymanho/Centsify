// src/components/user/ExpenseSummary/AddExpenseForm.js

/*

Defines the AddExpenseForm component, which allows users to add a new expense.
It includes fields for title, amount, date, category, and description. The component integrates
with Firebase for user authentication and uses TensorFlow.js with the Universal Sentence Encoder
to suggest a category based on the title input.

*/

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { addExpense } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import Expense from '../../../models/ExpensesDataModel';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import '../../../styles/AddExpenseForm.css';

const AddExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [user] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [model, setModel] = useState(null);

  // Load the TensorFlow model and set the backend
  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      await tf.ready();

      if (tf.getBackend() !== 'webgl') {
        console.warn('WebGL backend not available, switching to CPU backend.');
        await tf.setBackend('cpu');
        await tf.ready();
      }

      const loadedModel = await use.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Suggest category based on the title using TensorFlow embeddings
  const suggestCategory = async (title) => {
    if (!model) return;

    if (!title || title.trim() === '') {
      console.warn('Title is empty or undefined.');
      return;
    }

    const embeddings = await model.embed([title]);

    if (!embeddings || embeddings.length === 0) {
      console.warn('Embeddings are undefined or empty.');
      return;
    }

    const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities'];
    const suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
    setCategory(suggestedCategory);
  };

  // Handle title input changes and trigger category suggestion
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    suggestCategory(e.target.value);
  };

  // Handle form submission to add a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newExpense = new Expense(
      null,
      title,
      parseFloat(amount),
      date,
      category,
      description
    );

    console.log('Submitting new expense:', newExpense);

    const expenseId = await addExpense(user.email, newExpense);

    onAddExpense({ ...newExpense, id: expenseId });

    // Reset form fields
    setTitle('');
    setAmount('');
    setDate('');
    setCategory('');
    setDescription('');
    setIsSubmitting(false);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          required
          className="input-field"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="input-field"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        ></textarea>
        <button
          type="submit"
          disabled={isSubmitting}
          className="custom-button add-button"
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
