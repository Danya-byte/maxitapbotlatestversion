//* Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

//* Add the Web App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgJtj9bjBMiGvKzQMrkv5ik8yY1AKeqxg",
  authDomain: "maxtap-d1684.firebaseapp.com",
  databaseURL: "https://maxtap-d1684-default-rtdb.firebaseio.com",
  projectId: "maxtap-d1684",
  storageBucket: "maxtap-d1684.firebasestorage.app",
  messagingSenderId: "404275512977",
  appId: "1:404275512977:web:7974eabc47e7086da2e130",
  measurementId: "G-243SLRR134"
};

//* Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

//* Initialize Firebase Auth and set persistence
const auth = getAuth(firebase_app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Failed to set session persistence:", error);
  });

export { auth };
export default firebase_app;
