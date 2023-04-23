// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAELGsChcinYAYfqv6DDSqc_uqp5cpoPmA",
  authDomain: "remonder-b2363.firebaseapp.com",
  projectId: "remonder-b2363",
  storageBucket: "remonder-b2363.appspot.com",
  messagingSenderId: "861122774814",
  appId: "1:861122774814:web:97b5d952ba8ca3dd92eb0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);