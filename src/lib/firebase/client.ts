/**
 * Lazily initialised Firebase client (browser only). Nothing here runs during
 * SSR: callers invoke getFirebase() from effects, event handlers or queries.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { ApiError } from "@/lib/api/client";
import { firebaseSettings } from "./config";

let cached: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

export function isFirebaseConfigured() {
  return firebaseSettings.configured;
}

export function getFirebase() {
  if (cached) return cached;
  if (typeof window === "undefined") {
    throw new ApiError("not_configured", "Firebase is only available in the browser.");
  }
  if (!firebaseSettings.configured) {
    throw new ApiError("not_configured", "The SokoTZ marketplace connection is not set up yet.");
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseSettings.config);
  const auth = getAuth(app);
  // Explicitly select the Android app's named database (there is no default DB).
  const db = getFirestore(app, firebaseSettings.databaseId);
  if (firebaseSettings.useEmulators) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8085);
  }
  cached = { app, auth, db };
  return cached;
}
