// src/backend/ExpenseManagement.js

import { firestore } from '../../../firebase'; // Import your Firestore instance
import Expense from '../../../models/ExpensesDataModel'; // Import the Expense class

// Function to add a new expense
const addExpense = async (userEmail, expense) => {
  try {
    await firestore.collection('Accounts').doc(userEmail).collection('transactions').add({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.description,
    });
    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Function to edit an existing expense
const editExpense = async (userEmail, expenseId, updatedFields) => {
  try {
    const expenseRef = firestore.collection('Accounts').doc(userEmail).collection('expenses').doc(expenseId);
    await expenseRef.update(updatedFields);
    console.log('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

// Function to delete an expense
const deleteExpense = async (userEmail, expenseId) => {
  try {
    const expenseRef = firestore.collection('Accounts').doc(userEmail).collection('expenses').doc(expenseId);
    await expenseRef.delete();
    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

export { addExpense, editExpense, deleteExpense };