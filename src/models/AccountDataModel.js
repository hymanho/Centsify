// src/backend/Account.js

/*

Data strucuture for Account -- Account class

*/

class Account {
    constructor(name, email, username, balance = 0, currency = 'USD', preferences = {}, expenses = {}, security = {}, settings = {}) {
      this.name = name;
      this.email = email;
      this.username = username;
      this.balance = balance;
      this.currency = currency;
      this.preferences = preferences; // reports object
      this.transactions = expenses; // expenses object
      this.security = security; // alerts object
      this.settings = settings;
     // could throw away -- this.backup = backup;
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