/*

Sign up component, used to register a user onto the Firestore Database. 
Implements firebase/auth functions to acheive this. 

*/

import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };