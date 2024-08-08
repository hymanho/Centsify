// src/models/Expense.js

class Expense {
    constructor(id, title, amount, date, category, description) {
      this.id = id;
      this.title = title;
      this.amount = amount;
      this.date = date;
      this.category = category;
      this.description = description;
    }
  
    // Method to update expense details
    updateExpense({ title, amount, date, category, description }) {
      if (title !== undefined) this.title = title;
      if (amount !== undefined) this.amount = amount;
      if (date !== undefined) this.date = date;
      if (category !== undefined) this.category = category;
      if (description !== undefined) this.description = description;
    }
  }
  
  export default Expense;
  