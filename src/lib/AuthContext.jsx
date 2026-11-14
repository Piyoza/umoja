
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
  reload,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/user-profile";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!active) return;

        setUser(firebaseUser);
        setProfile(null);
        setAuthError(null);

        if (!firebaseUser) {
          setIsLoadingAuth(false);
          return;
        }

        setIsLoadingAuth(true);

        try {
          const savedProfile = await ensureUserProfile(firebaseUser);

          if (
            active &&
            auth.currentUser?.uid === firebaseUser.uid
          ) {
            setProfile(savedProfile);
          }
        } catch (error) {
          console.error("Could not restore learner profile:", error);

          if (active) {
            setAuthError({
              type: "profile",
              message: "Could not load your saved profile.",
            });
          }
        } finally {
          if (active) {
            setIsLoadingAuth(false);
          }
        }
      },
      (error) => {
        if (!active) return;

        setAuthError({
          type: "unknown",
          message: error.message ?? "Failed to load session",
        });

        setIsLoadingAuth(false);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isLoadingAuth,
      authError,

      refresh: async () => {
        if (auth.currentUser) {
          await reload(auth.currentUser);

          const currentUser = auth.currentUser;
          setUser(currentUser);

          const savedProfile = await ensureUserProfile(currentUser);
          setProfile(savedProfile);
        }
      },

      logout: async () => {
        await signOut(auth);
        window.location.assign("/welcome");
      },

      navigateToLogin: () => {
        window.location.assign("/login");
      },
    }),
    [user, profile, isLoadingAuth, authError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }

  return context;
}
