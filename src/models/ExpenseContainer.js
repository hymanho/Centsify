/*

Defines the ExpenseContainer class which handles storing, adding, editing, deleting, 
and retrieving expenses. It also converts expenses into a format suitable for Firestore storage.

*/

class ExpenseContainer {
  constructor(expenses = []) {
    // Initialize with given expenses or an empty array
    this.expenses = expenses;
  }

  // Converts expenses to a plain object array for Firestore storage
  toPlainArray() {
    return this.expenses.map(expense => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.description,
    }));
  }

  // Adds a new expense to the container
  addExpense(expense) {
    this.expenses.push(expense);
  }

  // Edits an existing expense by its ID
  editExpense(expenseId, updatedFields) {
    const index = this.expenses.findIndex(expense => expense.id === expenseId);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updatedFields };
      return true;
    }
    return false;
  }

  // Deletes an expense by its ID
  deleteExpense(expenseId) {
    const initialLength = this.expenses.length;
    this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    return this.expenses.length < initialLength; // Returns true if an expense was deleted
  }

  // Retrieves all expenses from the container
  getExpenses() {
    return this.expenses;
  }

  // Finds an expense by its ID
  findExpenseById(expenseId) {
    return this.expenses.find(expense => expense.id === expenseId);
  }
}

export default ExpenseContainer;
