import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore/lite'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_OtGwExSWok51CrZbbWi6Iejpig1L5Nk",
  authDomain: "dynamictimetable-ebd1d.firebaseapp.com",
  projectId: "dynamictimetable-ebd1d",
  storageBucket: "dynamictimetable-ebd1d.appspot.com",
  messagingSenderId: "33867548746",
  appId: "1:33867548746:web:5d183b16a32311ca4bbeb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;