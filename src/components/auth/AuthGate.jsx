import { redirect } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";

function getFirebaseUser() {
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

export async function requireSignedIn({ location }) {
  const user = await getFirebaseUser();

  if (user) {
    return { user };
  }

  throw redirect({
    to: "/login",
    search: {
      returnTo: location.href,
      from_url: location.href,
    },
    reloadDocument: true,
  });
}

export function AuthGateError({ error }) {
  return <DefaultCatchBoundary error={error} />;
}