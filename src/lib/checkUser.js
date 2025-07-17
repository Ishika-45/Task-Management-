import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
export const checkUser = async (user) => {
  if (!user) {
    console.warn("No user provided to checkUser");
    return null;
  }

  const userId = user.id;
  const userRef = doc(db, "users", userId);

  try {
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const userData = {
        id: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress.emailAddress,
        imageUrl: user.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(userRef, userData, { merge: true });
      return userData;
    } else {
      console.log("User already exists in Firestore");
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
