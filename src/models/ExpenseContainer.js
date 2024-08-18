class ExpenseContainer {
  constructor(expenses = []) {
    this.expenses = expenses; // Initialize with given expenses or an empty array
  }

  // Method to convert expenses to a plain object array for Firestore storage
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

  // Method to add a new expense
  addExpense(expense) {
    this.expenses.push(expense);
  }

  // Method to edit an existing expense
  editExpense(expenseId, updatedFields) {
    const index = this.expenses.findIndex(expense => expense.id === expenseId);
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updatedFields };
      return true;
    }
    return false;
  }

  // Method to delete an expense by its ID
  deleteExpense(expenseId) {
    const initialLength = this.expenses.length;
    this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    return this.expenses.length < initialLength; // Returns true if an expense was deleted
  }

  // Method to get all expenses
  getExpenses() {
    return this.expenses;
  }

  // Method to find an expense by its ID
  findExpenseById(expenseId) {
    return this.expenses.find(expense => expense.id === expenseId);
  }
}

export default ExpenseContainer;
