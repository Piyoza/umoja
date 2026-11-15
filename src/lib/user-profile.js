import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// Languages ASTRA can use for text and spoken responses.
export const ASTRA_LANGUAGES = [
  { code: "en", label: "English", speechLocale: "en-ZA" },
  { code: "zu", label: "isiZulu", speechLocale: "zu-ZA" },
  { code: "xh", label: "isiXhosa", speechLocale: "xh-ZA" },
  { code: "st", label: "Sesotho", speechLocale: "st-ZA" },
  { code: "af", label: "Afrikaans", speechLocale: "af-ZA" },
  { code: "fr", label: "French", speechLocale: "fr-FR" },
  { code: "es", label: "Spanish", speechLocale: "es-ES" },
  { code: "pt", label: "Portuguese", speechLocale: "pt-PT" },
  { code: "ar", label: "Arabic", speechLocale: "ar-SA" },
  { code: "hi", label: "Hindi", speechLocale: "hi-IN" },
  { code: "sw", label: "Swahili", speechLocale: "sw-KE" },
];

// Default sensory, accessibility and language preferences.
export const DEFAULT_USER_PREFERENCES = {
  soundEffects: false,
  audioNarration: false,
  captions: true,
  reducedMotion: false,
  plainLanguage: false,
  highContrast: false,
  hapticFeedback: false,
  language: "en",
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

// Save accessibility and language preferences independently
// of the learner's profile and progress.
export async function saveUserPreferences(user, updates) {
  if (!user?.uid) {
    throw new Error("A signed-in user is required.");
  }

  const preferences = {};
  const supportedLanguages = ASTRA_LANGUAGES.map(
    (language) => language.code
  );

  for (const key of Object.keys(DEFAULT_USER_PREFERENCES)) {
    if (key === "language") {
      if (
        typeof updates?.language === "string" &&
        supportedLanguages.includes(updates.language)
      ) {
        preferences.language = updates.language;
      }
    } else if (typeof updates?.[key] === "boolean") {
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