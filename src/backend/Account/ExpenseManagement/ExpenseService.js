/*

Firestore integration for managing expenses. This file includes functions to add, edit, delete, and fetch expenses from the Firestore database. 
It also provides additional functionality for budget recommendations, anomaly detection, and analyzing spending patterns. 

Uses Firestore operations (`doc`, `getDoc`, `setDoc`) and an `ExpenseContainer` model to manage expenses within a user's account.

*/

import { firestore } from '../../../firebase';  // Import Firestore from the Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Import necessary Firestore methods
import ExpenseContainer from '../../../models/ExpenseContainer';  // Import the ExpenseContainer model

// Function to add a new expense to a user's account in Firestore
const addExpense = async (userEmail, expenseData) => {
  try {
    // Get a reference to the user's expense container document in Firestore
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    let expenseContainer;

    // If the document exists, create an ExpenseContainer object using the existing data
    if (containerDoc.exists()) {
      expenseContainer = new ExpenseContainer(containerDoc.data().expenses || []);
    } else {
      // If no document exists, initialize a new ExpenseContainer
      expenseContainer = new ExpenseContainer();
    }

    // Check if the new expense already exists in the container
    const existingExpense = expenseContainer.getExpenses().find(expense => 
      expense.title === expenseData.title &&
      expense.amount === expenseData.amount &&
      expense.date === expenseData.date &&
      expense.category === expenseData.category
    );

    // If the expense already exists, log a message and return the expense ID
    if (existingExpense) {
      console.log('Expense already exists:', existingExpense);
      return existingExpense.id;
    }

    // Create a new expense object with a unique ID and the provided data
    const expense = {
      id: Date.now().toString(),  // Generate a unique ID using the current timestamp
      title: expenseData.title,
      amount: expenseData.amount,
      date: expenseData.date,
      category: expenseData.category,
      description: expenseData.description,
    };

    // Calculate a recommended budget for the expense's category
    const recommendedBudget = recommendBudget(expenseContainer.getExpenses(), expense.category);
    console.log(`Recommended budget for ${expense.category}: ${recommendedBudget}`);

    // Detect anomalies in the new expense
    const isAnomaly = detectAnomalies(expenseContainer.getExpenses(), expense);
    if (isAnomaly) {
      console.log('Anomaly detected in the expense:', expense);
    }

    // Add the new expense to the container
    expenseContainer.addExpense(expense);

    // Save the updated expense container back to Firestore
    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense added successfully');
    return expense.id;
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Function to edit an existing expense in a user's account
const editExpense = async (userEmail, expenseId, updatedFields) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Edit the existing expense in the container
    const updatedExpense = expenseContainer.editExpense(expenseId, updatedFields);

    if (!updatedExpense) {
      console.error('Expense not found for update');
      return;
    }

    // Save the updated expense container to Firestore
    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

// Function to delete an expense from a user's account
const deleteExpense = async (userEmail, expenseId) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Delete the expense from the container
    const deleted = expenseContainer.deleteExpense(expenseId);

    if (!deleted) {
      console.error('Expense not found for deletion');
      return;
    }

    // Save the updated container after deletion
    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

// Function to fetch all expenses for a user from Firestore
const getExpenses = async (userEmail) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.log('No expenses found');
      return [];
    }

    // Return the list of expenses
    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);
    return expenseContainer.getExpenses();
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

// Function to get the expense container for a user (retrieves all expense data for that user)
const getExpenseContainer = async (userEmail) => {
  const expenseContainerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
  const expenseContainerDoc = await getDoc(expenseContainerRef);
  return expenseContainerDoc.exists() ? expenseContainerDoc.data() : null;
};

// Function to fetch a specific expense by its ID
const getExpense = async (userEmail, expenseId) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return null;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    // Find the expense by ID
    const expense = expenseContainer.getExpenses().find(exp => exp.id === expenseId);

    if (!expense) {
      console.error('Expense not found for ID:', expenseId);
      return null;
    }

    return expense;
  } catch (error) {
    console.error('Error fetching expense:', error);
    return null;
  }
};

// Function to recommend a budget based on previous expenses in a specific category
const recommendBudget = (expenses, category) => {
  const categoryExpenses = expenses.filter(exp => exp.category === category);
  const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  return total / categoryExpenses.length || 100; // Default budget if no previous data exists
};

// Function to detect anomalies in a new expense (based on amount compared to the average)
const detectAnomalies = (expenses, newExpense) => {
  const average = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
  const threshold = 1.5 * average;  // Anomaly threshold set to 1.5 times the average amount
  return newExpense.amount > threshold;
};

// Function to analyze spending patterns by calculating the average spend per category
const analyzeSpendingPatterns = (expenses) => {
  const patternAnalysis = {}; 
  expenses.forEach(expense => {
    if (!patternAnalysis[expense.category]) {
      patternAnalysis[expense.category] = {
        total: 0,
        count: 0
      };
    }
    patternAnalysis[expense.category].total += expense.amount;
    patternAnalysis[expense.category].count += 1;
  });

  const averageSpending = {};
  for (const category in patternAnalysis) {
    averageSpending[category] = patternAnalysis[category].total / patternAnalysis[category].count;
  }

  return averageSpending;
};

export { addExpense, editExpense, deleteExpense, getExpenses, getExpenseContainer, getExpense, analyzeSpendingPatterns, detectAnomalies };

