// src/models/Account.js
import { firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

class Account {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Method to save the account to Firestore
  async save() {
    try {
      const userRef = doc(firestore, 'users', this.username);
      await setDoc(userRef, {
        username: this.username,
        password: this.password, // Ideally, you should hash passwords before storing them
      });
      console.log('Account saved to Firestore');
    } catch (error) {
      console.error('Error saving account to Firestore:', error);
    }
  }

  // Method to update account information in Firestore
  async update(newInfo) {
    try {
      const userRef = doc(firestore, 'users', this.username);
      await setDoc(userRef, newInfo, { merge: true });
      console.log('Account updated in Firestore');
    } catch (error) {
      console.error('Error updating account in Firestore:', error);
    }
  }
}

export default Account;