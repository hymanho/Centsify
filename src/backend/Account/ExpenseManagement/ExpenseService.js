import { firestore } from '../../../firebase'; // Adjust the path based on your directory structure
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ExpenseContainer from '../../../models/ExpenseContainer'; // Correct path based on your directory structure

// Function to add a new expense
const addExpense = async (userEmail, expenseData) => {
  try {
    // Reference to the user's expense container document in Firestore
    const containerRef = doc(firestore, 'Accounts', userEmail, 'expenses', 'expenseContainer');
    const containerDoc = await getDoc(containerRef);

    let expenseContainer;

    if (containerDoc.exists()) {
      expenseContainer = new ExpenseContainer(containerDoc.data().expenses || []);
    } else {
      expenseContainer = new ExpenseContainer();
    }

    // Check if the expense already exists
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

    // Create a new expense object
    const expense = {
      id: Date.now().toString(), // Generate a unique ID for the expense
      title: expenseData.title,
      amount: expenseData.amount,
      date: expenseData.date,
      category: expenseData.category,
      description: expenseData.description,
    };

    expenseContainer.addExpense(expense);

    // Save the updated container back to Firestore
    await setDoc(containerRef, {
      expenses: expenseContainer.toPlainArray()
    });

    console.log('Expense added successfully');
    return expense.id; // Return the unique ID of the added expense
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Function to edit an existing expense
const editExpense = async (userEmail, expenseId, updatedFields) => {
  try {
    // Reference to the user's expense container document in Firestore
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
    // Reference to the user's expense container document in Firestore
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

export { addExpense, editExpense, deleteExpense, getExpenses, getExpenseContainer };
