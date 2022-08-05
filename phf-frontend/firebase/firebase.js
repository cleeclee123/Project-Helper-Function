// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFrIGWwrx1Oun0oFL-sc3um60GQR-x9XM",
  authDomain: "project-helper-function.firebaseapp.com",
  projectId: "project-helper-function",
  storageBucket: "project-helper-function.appspot.com",
  messagingSenderId: "530597922940",
  appId: "1:530597922940:web:c4ddfd833d28a81eb461f9",
  measurementId: "G-PV9LCYY02W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
