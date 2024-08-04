// src/auth.js
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logOff = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging off:', error);
    throw error;
  }
};