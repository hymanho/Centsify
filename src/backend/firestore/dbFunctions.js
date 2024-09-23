/*

Firestore database functions for managing user data. This file contains a function to add a new user to the 'Accounts' collection in Firestore.

Uses Firestore's `collection` and `addDoc` methods to handle the addition of user documents.

*/

import { collection, addDoc } from 'firebase/firestore';  // Import necessary Firestore methods
import { firestore } from '../../firebase';  // Import Firestore instance from the Firebase configuration

// Function to add a new user to the 'Accounts' collection in Firestore
export const addUser = async (userData) => {
  try {
    // Add the user document to the 'Accounts' collection and return the document reference
    const docRef = await addDoc(collection(firestore, 'Accounts'), userData);

    // Log the ID of the newly added document
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    // Catch and log any errors that occur during the addition of the document
    console.error("Error adding document: ", error);
  }
};