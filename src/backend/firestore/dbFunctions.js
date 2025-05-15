/*

Firestore database functions for managing user data. This file contains a function to add a new user to the 'Accounts' collection in Firestore.

Uses Firestore's `collection` and `addDoc` methods to handle the addition of user documents.

*/

import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

// userData should include a 'uid' property (Firebase Auth UID)
export const addUser = async (userData) => {
  try {
    // Use the userId (Firebase UID) as the document ID
    const docRef = doc(firestore, 'Accounts', userData.uid); // assuming userId field contains UID

    // Set the document with the account data
    await setDoc(docRef, {
      uid: userData.uid,
      username: userData.username,
      email: userData.email,
      displayName: userData.displayName,
      balance: userData.balance,
      currency: userData.currency,
      preferences: userData.preferences,
      alerts: userData.alerts,
      settings: userData.settings,
      reports: userData.reports,
    });

    console.log('Account stored with UID as document ID:', userData.uid);
  } catch (error) {
    console.error('Error storing account:', error);
  }
};