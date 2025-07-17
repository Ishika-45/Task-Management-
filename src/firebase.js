import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ7OK1Zhj8thxJTBmeNjTZUJAR1DkvGnQ",
  authDomain: "planpilot-28e57.firebaseapp.com",
  projectId: "planpilot-28e57",
  storageBucket: "planpilot-28e57.appspot.com",
  messagingSenderId: "902605099605",
  appId: "1:902605099605:web:7d73ead909bc666cb6fadc",
  measurementId: "G-2EFNS13ZX0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
