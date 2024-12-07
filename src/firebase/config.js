//* Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

//* Add the Web App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVQpdChpJdj0_ofFfP34zh9Z2Xv0noJfw",
  authDomain: "maxitape-288d3.firebaseapp.com,"
  projectId: "maxitape-288d3",
  storageBucket: "maxitape-288d3.firebasestorage.app",
  messagingSenderId: "231511867504",
  appId: "1:231511867504:web:1373b04eeafbe37b5ab4b5",
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
