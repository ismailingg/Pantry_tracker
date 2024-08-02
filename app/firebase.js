// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzv3JayNaoC8o5d64SObWHP2vaAjRY73g",
  authDomain: "pantrymanagement-99c2e.firebaseapp.com",
  projectId: "pantrymanagement-99c2e",
  storageBucket: "pantrymanagement-99c2e.appspot.com",
  messagingSenderId: "91622954413",
  appId: "1:91622954413:web:f82ff7152ef2fc9cd93d24",
  measurementId: "G-MHQL4PV6MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}