// src/dbFunctions.js
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Import Firestore instance

export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(firestore, 'Accounts'), userData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};