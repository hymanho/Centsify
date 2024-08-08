// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import auth functions if needed
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import firestore functions if needed

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "moneytracker-19a89.firebaseapp.com",
  projectId: "moneytracker-19a89",
  storageBucket: "moneytracker-19a89.appspot.com",
  messagingSenderId: "156663744299",
  appId: "1:156663744299:web:9a362642f255352136276e",
  measurementId: "G-KY38DR9GRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get instances of services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export instances to use in other parts of your app
export { auth, firestore };
