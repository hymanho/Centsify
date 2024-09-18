import { auth } from '../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';

export const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

export const getCurrentUserId = () => {
    try {
        const user = auth.currentUser;
        if (user) {
            return user.uid;
        } else {
            throw new Error('No user is currently logged in.');
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
};