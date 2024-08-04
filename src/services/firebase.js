// src/firebase.js
// firebase configurations
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwlifNvruX1aNiD7NTY0JEvgzzB320grk",
  authDomain: "moneytracker-19a89.firebaseapp.com",
  projectId: "moneytracker-19a89",
  storageBucket: "moneytracker-19a89.appspot.com",
  messagingSenderId: "156663744299",
  appId: "1:156663744299:web:9a362642f255352136276e",
  measurementId: "G-KY38DR9GRQ"
};

const app = initializeApp(firebaseConfig);
console.log('Firebase initialized:', app); // Debug logging
export const auth = getAuth(app);
export const db = getFirestore(app);