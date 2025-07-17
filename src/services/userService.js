import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc
} from "firebase/firestore";

const usersRef = collection(db, "users");

export const getUserById = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
};

export const getUserByEmail = async (email) => {
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const createUser = async (user) => {
  const docRef = doc(db, "users", user.id); 
  await setDoc(docRef, user, { merge: true });
  return docRef.id;
};
