// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseVariables from "../env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseVariables.firebaseAPIKey,
  authDomain: firebaseVariables.authDomain,
  projectId: firebaseVariables.projectId,
  storageBucket: firebaseVariables.storageBucket,
  messagingSenderId: firebaseVariables.messagingSenderId,
  appId: firebaseVariables.appId,
  measurementId: firebaseVariables.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
