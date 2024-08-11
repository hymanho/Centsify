class ExpenseContainer {
    constructor() {
      this.expenses = []; // Array to hold Expense objects
    }

    toPlainArray() {
      return this.expenses.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      }));
    }
  
    // Method to add a new expense
    addExpense(expense) {
      this.expenses.push(expense);
    }
  
    // Method to remove an expense by its ID
    removeExpense(expenseId) {
      this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    }
  
    // Method to edit an existing expense
    editExpense(expenseId, updatedFields) {
      const index = this.expenses.findIndex(expense => expense.id === expenseId);
      if (index !== -1) {
        this.expenses[index] = { ...this.expenses[index], ...updatedFields };
      }
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