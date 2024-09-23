/*

Logoff component, used to log a user off of their account.
Implements firebase/auth functions to acheive this. 

*/


import { auth } from '../../firebase';
import {signOut} from 'firebase/auth';

export const logOff = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging off:', error);
      throw error;
    }
  };