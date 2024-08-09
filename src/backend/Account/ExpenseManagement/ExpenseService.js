// src/backend/ExpenseManagement.js

import { firestore } from '../../../firebase'; // Import your Firestore instance
import Expense from '../../../models/ExpensesDataModel'; // Import the Expense class
import ExpenseContainer from '../../../models/ExpenseContainer'; // Adjust the path as needed

// Function to add a new expense
const addExpense = async (userEmail, expenseData) => {
  try {
    // Fetch the existing ExpenseContainer from Firestore
    const containerRef = firestore.collection('Accounts').doc(userEmail).collection('expenses').doc('expenseContainer');
    const containerDoc = await containerRef.get();

    let expenseContainer;

    if (containerDoc.exists) {
      // If the container exists, create a new instance from the data
      expenseContainer = new ExpenseContainer(containerDoc.data().expenses);
    } else {
      // If the container does not exist, create a new one
      expenseContainer = new ExpenseContainer();
    }

    // Create an instance of the Expense class
    const expense = new Expense(
      expenseData.title,
      expenseData.amount,
      expenseData.date,
      expenseData.category,
      expenseData.description
    );

    // Add the new expense to the container
    expenseContainer.addExpense(expense);

    // Save the updated container back to Firestore
    await containerRef.set({
      expenses: expenseContainer.getExpenses()
    });

    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Function to edit an existing expense
const editExpense = async (userEmail, expenseId, updatedFields) => {
  try {
    // Fetch the existing ExpenseContainer from Firestore
    const containerRef = firestore.collection('Accounts').doc(userEmail).collection('expenses').doc('expenseContainer');
    const containerDoc = await containerRef.get();

    if (!containerDoc.exists) {
      console.error('Expense container not found');
      return;
    }

    // Create an instance of ExpenseContainer from the data
    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Update the specific expense
    expenseContainer.editExpense(expenseId, updatedFields);

    // Save the updated container back to Firestore
    await containerRef.set({
      expenses: expenseContainer.getExpenses()
    });

    console.log('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

// Function to delete an expense
const deleteExpense = async (userEmail, expenseId) => {
  try {
    // Fetch the existing ExpenseContainer from Firestore
    const containerRef = firestore.collection('Accounts').doc(userEmail).collection('expenses').doc('expenseContainer');
    const containerDoc = await containerRef.get();

    if (!containerDoc.exists) {
      console.error('Expense container not found');
      return;
    }

    // Create an instance of ExpenseContainer from the data
    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Delete the specific expense
    expenseContainer.deleteExpense(expenseId);

    // Save the updated container back to Firestore
    await containerRef.set({
      expenses: expenseContainer.getExpenses()
    });

    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

export { addExpense, editExpense, deleteExpense };