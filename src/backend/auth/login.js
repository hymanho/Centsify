/*

Login component, used to log a user into their account. A seperate function is made to log the current user's token, and sends it to a local server. 
Implements firebase/auth functions to acheive this.

*/

import { auth } from '../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user; 
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  export async function getCurrentUserToken() { 
    // authenticates currentUser using auth module from firebase
    const auth = getAuth();
    const user = auth.currentUser;
    
    // if user is not NULL, it fetches their tokenID
    if (user) {
      const token = await user.getIdToken();
      return token;
    } else {
      throw new Error("No user is logged in");
    }
  }