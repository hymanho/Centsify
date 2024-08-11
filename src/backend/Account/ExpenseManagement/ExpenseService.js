// src/backend/ExpenseManagement/ExpenseService.js

import { firestore } from '../../../firebase'; // Correct path based on src directory structure
import Expense from '../../../models/ExpensesDataModel'; // Correct path based on src directory structure
import ExpenseContainer from '../../../models/ExpenseContainer'; // Correct path based on src directory structure
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Function to add a new expense
const addExpense = async (userEmail, expenseData) => {
  try {
    // Reference to the ExpenseContainer document in Firestore
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    let expenseContainer;

    if (containerDoc.exists()) {
      // If the container exists, create a new instance from the data
      expenseContainer = new ExpenseContainer(containerDoc.data().expenses || []);
    } else {
      // If the container does not exist, create a new one
      expenseContainer = new ExpenseContainer();
    }

    // Create an instance of the Expense class
    const expense = new Expense(
      Date.now().toString(), // Generate a unique ID for the expense
      expenseData.title,
      expenseData.amount,
      expenseData.date,
      expenseData.category,
      expenseData.description
    );

    // Add the new expense to the container
    expenseContainer.addExpense(expense);

    // Save the updated container back to Firestore
    await setDoc(containerRef, {
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
    // Reference to the ExpenseContainer document in Firestore
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    // Create an instance of ExpenseContainer from the data
    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Update the specific expense
    const updatedExpense = expenseContainer.editExpense(expenseId, updatedFields);

    if (!updatedExpense) {
      console.error('Expense not found for update');
      return;
    }

    // Save the updated container back to Firestore
    await setDoc(containerRef, {
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
    // Reference to the ExpenseContainer document in Firestore
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    // Create an instance of ExpenseContainer from the data
    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Delete the specific expense
    const deleted = expenseContainer.deleteExpense(expenseId);

    if (!deleted) {
      console.error('Expense not found for deletion');
      return;
    }

    // Save the updated container back to Firestore
    await setDoc(containerRef, {
      expenses: expenseContainer.getExpenses()
    });

    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

// Function to get all expenses
const getExpenses = async (userEmail) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.log('No expenses found');
      return [];
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);
    return expenseContainer.getExpenses();
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export { addExpense, editExpense, deleteExpense, getExpenses };
