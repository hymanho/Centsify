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
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const token = await user.getIdToken();
      return token;
    } else {
      throw new Error("No user is logged in");
    }
  }