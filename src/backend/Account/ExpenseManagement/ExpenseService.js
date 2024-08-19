import { firestore } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ExpenseContainer from '../../../models/ExpenseContainer';

// Function to add a new expense
const addExpense = async (userEmail, expenseData) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    let expenseContainer;

    if (containerDoc.exists()) {
      expenseContainer = new ExpenseContainer(containerDoc.data().expenses || []);
    } else {
      expenseContainer = new ExpenseContainer();
    }

    const existingExpense = expenseContainer.getExpenses().find(expense => 
      expense.title === expenseData.title &&
      expense.amount === expenseData.amount &&
      expense.date === expenseData.date &&
      expense.category === expenseData.category
    );

    if (existingExpense) {
      console.log('Expense already exists:', existingExpense);
      return existingExpense.id;
    }

    const expense = {
      id: Date.now().toString(),
      title: expenseData.title,
      amount: expenseData.amount,
      date: expenseData.date,
      category: expenseData.category,
      description: expenseData.description,
    };

    // Budget recommendation logic
    const recommendedBudget = recommendBudget(expenseContainer.getExpenses(), expense.category);
    console.log(`Recommended budget for ${expense.category}: ${recommendedBudget}`);

    // Anomaly detection logic
    const isAnomaly = detectAnomalies(expenseContainer.getExpenses(), expense);
    if (isAnomaly) {
      console.log('Anomaly detected in the expense:', expense);
    }

    expenseContainer.addExpense(expense);

    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense added successfully');
    return expense.id;
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Function to edit an existing expense
const editExpense = async (userEmail, expenseId, updatedFields) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    const updatedExpense = expenseContainer.editExpense(expenseId, updatedFields);

    if (!updatedExpense) {
      console.error('Expense not found for update');
      return;
    }

    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

// Function to delete an expense
const deleteExpense = async (userEmail, expenseId) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

    const deleted = expenseContainer.deleteExpense(expenseId);

    if (!deleted) {
      console.error('Expense not found for deletion');
      return;
    }

    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
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

// Function to get the expense container for a user
const getExpenseContainer = async (userEmail) => {
  const expenseContainerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
  const expenseContainerDoc = await getDoc(expenseContainerRef);
  return expenseContainerDoc.exists() ? expenseContainerDoc.data() : null;
};

const getExpense = async (userEmail, expenseId) => {
  try {
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    if (!containerDoc.exists()) {
      console.error('Expense container not found');
      return null;
    }

    const expenseContainer = new ExpenseContainer(containerDoc.data().expenses);

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

// Budget recommendation function
const recommendBudget = (expenses, category) => {
  const categoryExpenses = expenses.filter(exp => exp.category === category);
  const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  return total / categoryExpenses.length || 100; // Default budget if no previous data
};

// Anomaly detection function
const detectAnomalies = (expenses, newExpense) => {
  const average = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
  const threshold = 1.5 * average;
  return newExpense.amount > threshold;
};

export { addExpense, editExpense, deleteExpense, getExpenses, getExpenseContainer, getExpense };
