// src/backend/createAccount.js

/*

creates an account upon signup and stores it into firestore

*/

import { firestore } from '../../firebase'; // Import your Firestore instance
import { doc, setDoc } from 'firebase/firestore';
import Account from '../../models/AccountDataModel'; // Import the Account class

// Function to store an Account object in Firestore
const storeAccount = async (account) => {
  try {
    // Convert the Account object to a plain object for Firestore
    const accountData = {
      name: account.name,
      email: account.email,
      username: account.username,
      balance: account.balance,
      currency: account.currency,
      preferences: account.preferences,
      transactions: account.transactions,
      security: account.security,
      settings: account.settings,
      backup: account.backup
    };

    // Store the Account object in Firestore using the email as the document ID
    const accountRef = doc(firestore, 'Accounts', account.email); // Update for modular API
    await setDoc(accountRef, accountData);
    console.log('Account stored successfully');
  } catch (error) {
    console.error('Error storing account:', error);
  }
};

// Function to retrieve an Account object from Firestore
const getAccount = async (email) => {
  try {
    const doc = await firestore.collection('accounts').doc(email).get();
    if (doc.exists) {
      const data = doc.data();
      return new Account(
        data.name,
        data.email,
        data.username,
        data.balance,
        data.currency,
        data.preferences,
        data.transactions,
        data.security,
        data.settings,
        data.backup
      );
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

export { storeAccount, getAccount };