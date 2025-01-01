import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firestore";

const saveUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "telegramUsers", userId), {
      ...userData,
      energy: 100,
      time: Timestamp.now(),
    });
    console.log("User saved successfully!");
  } catch (error) {
    console.error("Error saving user in Firestore:", error);
  }
};

const fetchUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "telegramUsers", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Energy Remaining:", userData.energy);
      console.log("Time remaining:", userData.time?.toDate());
    } else {
      console.error("User does not exist.");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

// Пример использования
const userId = "user123";
const userData = { name: "John Doe", email: "john@example.com" };

saveUser(userId, userData);
fetchUser(userId);