
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function ensureUserProfile(user) {
  if (!user?.uid) {
    throw new Error("A signed-in user is required.");
  }

  const profileRef = doc(db, "users", user.uid);
  const profileSnapshot = await getDoc(profileRef);

  if (!profileSnapshot.exists()) {
    await setDoc(profileRef, {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      role: "trainee",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return (await getDoc(profileRef)).data();
  }

  // Refresh basic account information without overwriting
  // the learner's existing profile or progress.
  await setDoc(
    profileRef,
    {
      email: user.email ?? "",
      ...(user.displayName ? { displayName: user.displayName } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return (await getDoc(profileRef)).data();
}

export async function saveUserProfile(user, updates) {
  if (!user?.uid) {
    throw new Error("A signed-in user is required.");
  }

  const profileRef = doc(db, "users", user.uid);
  const displayName = String(updates.displayName ?? "").trim();

  await setDoc(
    profileRef,
    {
      displayName,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return (await getDoc(profileRef)).data();
}
