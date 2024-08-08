// src/backend/Account.js

/*

Data strucuture for Account -- Account class

*/

class Account {
    constructor(name, email, username, balance = 0, currency = 'USD', preferences = {}, expenses = {}, alerts = {}, settings = {}, reports = {}) {
      this.name = name;
      this.email = email;
      this.username = username;
      this.balance = balance;
      this.currency = currency;
      this.preferences = preferences;
      this.alerts = alerts;
      this.expenses = expenses;
      this.reports = reports;
      this.settings = settings;
      
    }
  
    // Method to update balance
    updateBalance(amount) {
      this.balance += amount;
    }
  
    // Method to add a transaction
    addTransaction(expenses) {
      this.transactions.push(expenses);
    }
  
    // Additional methods as needed
  }
  
  export default Account;