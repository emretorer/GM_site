import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { authTokenStore, TOKEN_EVENT_NAME } from "../api/authTokenStore.js";
import { isMockModeEnabled } from "../mocks/mockMode.js";
import { resolveMockUserFromToken } from "../mocks/mockBackend.js";

let firebaseAppInstance = null;
let firebaseAuthInstance = null;
let mockAuthInstance = null;

function readFirebaseConfig() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  };

  if (!config.authDomain && config.projectId) {
    config.authDomain = `${config.projectId}.firebaseapp.com`;
  }

  const required = ["apiKey", "authDomain", "projectId"];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Firebase config missing: ${missing.join(", ")}. Set VITE_FIREBASE_* env vars.`
    );
  }

  return config;
}

function getFirebaseApp() {
  if (isMockModeEnabled()) {
    return { __mockFirebaseApp: true };
  }

  if (firebaseAppInstance) return firebaseAppInstance;
  firebaseAppInstance =
    getApps().length > 0 ? getApp() : initializeApp(readFirebaseConfig());
  return firebaseAppInstance;
}

function resolveMockCurrentUser() {
  const token = authTokenStore.get();
  const baseUser = resolveMockUserFromToken(token);
  if (!baseUser) return null;

  return {
    ...baseUser,
    async getIdToken() {
      return authTokenStore.get();
    },
  };
}

function getMockFirebaseAuthClient() {
  if (mockAuthInstance) return mockAuthInstance;

  mockAuthInstance = {
    get currentUser() {
      return resolveMockCurrentUser();
    },
    onAuthStateChanged(callback) {
      if (typeof callback !== "function") return () => {};

      callback(resolveMockCurrentUser());

      if (typeof window === "undefined") {
        return () => {};
      }

      const handler = () => {
        callback(resolveMockCurrentUser());
      };

      window.addEventListener(TOKEN_EVENT_NAME, handler);
      return () => {
        window.removeEventListener(TOKEN_EVENT_NAME, handler);
      };
    },
  };

  return mockAuthInstance;
}

function getFirebaseAuthClient() {
  if (isMockModeEnabled()) {
    return getMockFirebaseAuthClient();
  }

  if (firebaseAuthInstance) return firebaseAuthInstance;
  firebaseAuthInstance = getAuth(getFirebaseApp());
  return firebaseAuthInstance;
}

export { getFirebaseApp, getFirebaseAuthClient };
