// src/backend/Account.js
import ExpenseContainer from './ExpenseContainer'

/*

Data strucuture for Account -- Account class

*/

class Account {
  constructor(name, email, username, balance = 0, currency = 'USD', preferences = {}, alerts = {}, settings = {}, reports = {}) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.balance = balance;
    this.currency = currency;
    this.preferences = preferences;
    this.alerts = alerts;
    this.settings = settings;
    this.reports = reports;
    // Initialize expenses as an instance of ExpenseContainer
    this.expenses = new ExpenseContainer();
  }

  // Method to update balance
  updateBalance(amount) {
    this.balance += amount;
  }

  // Method to add an expense
  

  // Method to get all expenses
  getExpenses() {
    return this.expenses.getExpenses(); // Retrieve all expenses from the ExpenseContainer
  }

  // Additional methods as needed
}

export default Account;