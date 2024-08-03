// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwlifNvruX1aNiD7NTY0JEvgzzB320grk",
  authDomain: "moneytracker-19a89.firebaseapp.com",
  projectId: "moneytracker-19a89",
  storageBucket: "moneytracker-19a89.appspot.com",
  messagingSenderId: "156663744299",
  appId: "1:156663744299:web:9a362642f255352136276e",
  measurementId: "G-KY38DR9GRQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export services for use in other files
export const auth = firebase.auth();
export const firestore = firebase.firestore();