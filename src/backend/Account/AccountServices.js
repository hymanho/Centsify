/*

Creates an account from the AccountDataModel, and stores it in Firestore with default parameter values upon signup. 

*/

import { firestore } from '../../firebase'; // Import your Firestore instance
import { doc, setDoc } from 'firebase/firestore';
import Account from '../../models/AccountDataModel'; // Import the Account class

// Function to store an Account object in Firestore
const storeAccount = async (account) => {
  try {
    // Convert the Account object to a plain object for Firestore
    const accountData = {
      uid: account.uid,
      name: account.name,
      email: account.email,
      username: account.username,
      balance: account.balance,
      currency: account.currency,
      preferences: account.preferences,
      alerts: account.alerts,
      expenses: account.expenses.toPlainArray(), // Convert ExpenseContainer to plain array
      settings: account.settings,
      reports: account.reports,
    };

    // Store the Account object in Firestore using the email as the document ID
    const accountRef = doc(firestore, 'Accounts', account.uid);
    await setDoc(accountRef, accountData);
    console.log('Account stored successfully');
  } catch (error) {
    console.error('Error storing account:', error);
  }
};

// Function to retrieve an Account object from Firestore
const getAccount = async (uid) => {
  try {
    const doc = await firestore.collection('Accounts').doc(uid).get(); // Access the collection on Firestore
    if (doc.exists) {
      const data = doc.data();
      return new Account(
        data.uid,
        data.name,
        data.email,
        data.username,
        data.balance,
        data.currency,
        data.preferences,
        data.expenses,
        data.alerts,
        data.settings,
        data.reports,
        
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