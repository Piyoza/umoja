
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// Default sensory and accessibility preferences.
export const DEFAULT_USER_PREFERENCES = {
  soundEffects: false,
  audioNarration: false,
  captions: true,
  reducedMotion: false,
  plainLanguage: false,
  highContrast: false,
  hapticFeedback: false,
};

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
      preferences: DEFAULT_USER_PREFERENCES,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return (await getDoc(profileRef)).data();
  }

  // Refresh account information without overwriting
  // existing learner data or preferences.
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

// Save accessibility preferences independently of profile and progress.
export async function saveUserPreferences(user, updates) {
  if (!user?.uid) {
    throw new Error("A signed-in user is required.");
  }

  const preferences = {};

  for (const key of Object.keys(DEFAULT_USER_PREFERENCES)) {
    if (typeof updates?.[key] === "boolean") {
      preferences[key] = updates[key];
    }
  }

  if (Object.keys(preferences).length === 0) {
    throw new Error("No valid preferences were provided.");
  }

  const profileRef = doc(db, "users", user.uid);

  await setDoc(
    profileRef,
    {
      preferences,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return (await getDoc(profileRef)).data();
}
