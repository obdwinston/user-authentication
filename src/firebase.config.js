import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "user-authentication-342da.firebaseapp.com",
  projectId: "user-authentication-342da",
  storageBucket: "user-authentication-342da.appspot.com",
  messagingSenderId: "195513212213",
  appId: "1:195513212213:web:099332f4d51230a95e407c",
};

// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
