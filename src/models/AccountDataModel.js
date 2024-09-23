/*
 
Defines the Account class which handles user account data, including balance, currency, preferences, and expenses.

*/

import ExpenseContainer from './ExpenseContainer';

class Account {
  constructor(name, email, username, balance = 0, currency = 'USD', preferences = {}, alerts = {}, settings = {}, reports = {}) {
    // Initializes the account with provided user details and an empty ExpenseContainer.
    this.name = name;
    this.email = email;
    this.username = username;
    this.balance = balance;
    this.currency = currency;
    this.preferences = preferences;
    this.alerts = alerts;
    this.settings = settings;
    this.reports = reports;
    this.expenses = new ExpenseContainer();
  }

  // Updates the account balance by adding the specified amount.
  updateBalance(amount) {
    this.balance += amount;
  }

  // Retrieves all expenses associated with the account.
  getExpenses() {
    return this.expenses.getExpenses();
  }
}

export default Account;
