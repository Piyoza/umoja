import {
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { safeReturnTo } from "@/lib/authReturnTo";

const PROVIDERS = {
  google: () => new GoogleAuthProvider(),
  microsoft: () => new OAuthProvider("microsoft.com"),
  facebook: () => new FacebookAuthProvider(),
  apple: () => new OAuthProvider("apple.com"),
};

export async function signInWithProvider(
  providerName,
  returnTo,
  { manage = false } = {}
) {
  if (manage) {
    throw new Error(
      "Two-factor account management is not yet connected to Firebase."
    );
  }

  const createProvider = PROVIDERS[providerName];

  if (!createProvider) {
    throw new Error(`Unsupported sign-in provider: ${providerName}`);
  }

  const provider = createProvider();

  if (providerName === "google") {
    provider.setCustomParameters({ prompt: "select_account" });
  }

  await signInWithPopup(auth, provider);

  const destination = returnTo || safeReturnTo() || "/";
  window.location.assign(destination);
}

export async function loadSignInOptions() {
  return {
    name: "Junior Astronaut Mission Trainer",
    auth_config: {
      enable_google_login: true,
      enable_microsoft_login: false,
      enable_facebook_login: false,
      enable_apple_login: false,
      enable_sso_login: false,
      use_workspace_sso: false,
      enable_username_password: true,
    },
  };
}

export async function resumeMfa() {
  return null;
}

export async function signInToManageMfa() {
  throw new Error(
    "Two-factor account management is not yet connected to Firebase."
  );
}

export function finishSignIn(_accessToken, returnTo) {
  window.location.assign(returnTo || "/");
}

function mfaNotAvailable() {
  throw new Error(
    "This MFA feature still needs to be implemented using Firebase Authentication."
  );
}

export function mfaSession() {
  return {
    verify: mfaNotAvailable,
    sendSignInCode: mfaNotAvailable,
    setupAuthenticator: mfaNotAvailable,
    confirmAuthenticator: mfaNotAvailable,
    sendPhoneCode: mfaNotAvailable,
    confirmPhone: mfaNotAvailable,
    status: mfaNotAvailable,
    sendProofCode: mfaNotAvailable,
    removeMethod: mfaNotAvailable,
    forgetDevices: mfaNotAvailable,
  };
}