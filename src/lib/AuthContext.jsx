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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setAuthError(null);
        setIsLoadingAuth(false);
      },
      (error) => {
        setAuthError({
          type: "unknown",
          message: error.message ?? "Failed to load session",
        });
        setIsLoadingAuth(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoadingAuth,
      authError,

      refresh: async () => {
        if (auth.currentUser) {
          await reload(auth.currentUser);
          setUser(auth.currentUser);
        }
      },

      logout: async () => {
        await signOut(auth);
      },

      navigateToLogin: () => {
        window.location.assign("/login");
      },
    }),
    [user, isLoadingAuth, authError]
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