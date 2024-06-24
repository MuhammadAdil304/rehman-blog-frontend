// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhY4tkCVBnTAq2fpL9TYjRDo1ML9QNgm0",
  authDomain: "mern-blog-bd175.firebaseapp.com",
  projectId: "mern-blog-bd175",
  storageBucket: "mern-blog-bd175.appspot.com",
  messagingSenderId: "145084046251",
  appId: "1:145084046251:web:d7674981e863699d5510ee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);