import { auth, firestore } from '../../firebase';  // Make sure firestore is imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore document for this user
    await setDoc(doc(firestore, 'Accounts', user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
      // add other fields as needed
    });

    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};
