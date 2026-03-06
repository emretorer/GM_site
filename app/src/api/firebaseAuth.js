import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { authTokenStore } from "./authTokenStore.js";
import { getFirebaseAuthClient } from "../firebase/clientApp.js";
import { isMockModeEnabled } from "../mocks/mockMode.js";
import { mockCreateUser, mockSignIn } from "../mocks/mockBackend.js";

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Bu e-posta adresi zaten kullaniliyor.",
  "auth/invalid-credential": "E-posta veya sifre hatali.",
  "auth/invalid-email": "Gecerli bir e-posta adresi girin.",
  "auth/missing-password": "Sifre zorunludur.",
  "auth/user-disabled": "Bu hesap devre disi birakilmis.",
  "auth/too-many-requests": "Cok fazla deneme yapildi. Lutfen biraz sonra tekrar deneyin.",
  "auth/network-request-failed": "Ag hatasi olustu. Internet baglantisini kontrol edin.",
  "auth/operation-not-allowed": "Bu giris yontemi Firebase tarafinda aktif degil.",
  "auth/invalid-api-key": "Firebase ayarlari gecersiz gorunuyor.",
  "auth/weak-password": "Sifre en az 6 karakter olmali.",
};

function toReadableAuthError(error, fallbackMessage) {
  const errorCode = typeof error?.code === "string" ? error.code : "";
  if (!errorCode) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallbackMessage;
  }

  return (
    AUTH_ERROR_MESSAGES[errorCode] ||
    fallbackMessage
  );
}

export async function signInAndStoreToken(email, password) {
  try {
    if (isMockModeEnabled()) {
      const result = mockSignIn(email, password);
      authTokenStore.set(result.token);
      return result;
    }

    const auth = getFirebaseAuthClient();
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken(true);
    authTokenStore.set(token);
    return {
      token,
      user: credentials.user,
    };
  } catch (error) {
    authTokenStore.clear();
    const normalizedError = new Error(
      toReadableAuthError(
        error,
        "Giris basarisiz. Lutfen bilgilerinizi kontrol edin."
      )
    );
    if (typeof error?.code === "string") {
      normalizedError.code = error.code;
    }
    throw normalizedError;
  }
}

export async function createUserAndStoreToken(email, password, displayName = "") {
  try {
    if (isMockModeEnabled()) {
      const result = mockCreateUser(email, password, displayName);
      authTokenStore.set(result.token);
      return result;
    }

    const auth = getFirebaseAuthClient();
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const safeDisplayName = String(displayName || "").trim();

    if (safeDisplayName) {
      await updateProfile(credentials.user, {
        displayName: safeDisplayName,
      }).catch(() => null);
    }

    const token = await credentials.user.getIdToken(true);
    authTokenStore.set(token);
    return {
      token,
      user: credentials.user,
    };
  } catch (error) {
    authTokenStore.clear();
    const normalizedError = new Error(
      toReadableAuthError(
        error,
        "Kayit olusturulamadi. Lutfen bilgilerinizi kontrol edin."
      )
    );
    if (typeof error?.code === "string") {
      normalizedError.code = error.code;
    }
    throw normalizedError;
  }
}

export async function deleteCurrentUserAndClearToken() {
  if (isMockModeEnabled()) {
    authTokenStore.clear();
    return;
  }

  const auth = getFirebaseAuthClient();
  const user = auth.currentUser;

  try {
    if (user) {
      await deleteUser(user);
    }
  } finally {
    authTokenStore.clear();
  }
}

export async function signOutAndClearToken() {
  if (isMockModeEnabled()) {
    authTokenStore.clear();
    return;
  }

  try {
    const auth = getFirebaseAuthClient();
    await signOut(auth);
  } finally {
    authTokenStore.clear();
  }
}
