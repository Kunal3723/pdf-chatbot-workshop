// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCxgebccC8zYvhbr0YUdoDEw4qXyIvyo3A",
    authDomain: "pdf-chatbot-78c29.firebaseapp.com",
    projectId: "pdf-chatbot-78c29",
    storageBucket: "pdf-chatbot-78c29.appspot.com",
    messagingSenderId: "108950910161",
    appId: "1:108950910161:web:ad13f4e04dfeaaf06b81f0",
    measurementId: "G-M3W3PB5SLD"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export { auth, signInWithGoogle, signOutUser };
