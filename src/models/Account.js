// src/backend/Account.js
class Account {
    constructor(name, email, username, balance = 0, currency = 'USD', preferences = {}, transactions = [], security = {}, settings = {}, backup = {}) {
      this.name = name;
      this.email = email;
      this.username = username;
      this.balance = balance;
      this.currency = currency;
      this.preferences = preferences;
      this.transactions = transactions;
      this.security = security;
      this.settings = settings;
      this.backup = backup;
    }
  
    // Method to update balance
    updateBalance(amount) {
      this.balance += amount;
    }
  
    // Method to add a transaction
    addTransaction(transaction) {
      this.transactions.push(transaction);
    }
  
    // Additional methods as needed
  }
  
  export default Account;