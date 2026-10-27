/**
 * Firebase web configuration for SokoTZ.
 *
 * Verified from the Android app (github.com/daudikalunde91/sokoTZ):
 *  - Firebase project ID:   gen-lang-client-0905574889   (app/google-services.json)
 *  - Named Firestore DB ID: ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929
 *                           (app/src/main/res/values/firebase_applet_config.xml, firebase.json)
 *  - Sender / project no.:  276149702266
 *
 * The project has NO "(default)" Firestore database, so the named database must
 * always be selected explicitly. The Web API key and Web App ID come from the
 * Firebase Web App registration (Firebase Console → Project settings → Your apps)
 * and are supplied via VITE_ env vars — they are publishable values, not secrets.
 */
export const ANDROID_PROJECT_ID = "gen-lang-client-0905574889";
export const ANDROID_FIRESTORE_DATABASE_ID =
  "ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929";
export const ANDROID_SENDER_ID = "276149702266";

type Env = Record<string, string | boolean | undefined>;

export interface SokoFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId: string;
  storageBucket: string;
}

export interface ResolvedFirebaseSettings {
  config: SokoFirebaseConfig;
  databaseId: string;
  useEmulators: boolean;
  /** True when the web app keys needed to talk to the real project are present. */
  configured: boolean;
  missing: string[];
}

function str(env: Env, key: string): string {
  const v = env[key];
  return typeof v === "string" ? v.trim() : "";
}

/** Pure resolver so it can be unit tested with any env object. */
export function resolveFirebaseSettings(env: Env): ResolvedFirebaseSettings {
  const useEmulators = str(env, "VITE_FIREBASE_USE_EMULATORS") === "true";
  const projectId = str(env, "VITE_FIREBASE_PROJECT_ID") || ANDROID_PROJECT_ID;
  const apiKey = str(env, "VITE_FIREBASE_API_KEY");
  const appId = str(env, "VITE_FIREBASE_APP_ID");
  const missing: string[] = [];
  if (!apiKey) missing.push("VITE_FIREBASE_API_KEY");
  if (!appId) missing.push("VITE_FIREBASE_APP_ID");

  return {
    config: {
      // The emulator accepts any key; production requires the real Web API key.
      apiKey: apiKey || (useEmulators ? "emulator-api-key" : ""),
      authDomain: str(env, "VITE_FIREBASE_AUTH_DOMAIN") || `${projectId}.firebaseapp.com`,
      projectId,
      appId: appId || (useEmulators ? "1:000000000000:web:emulator" : ""),
      messagingSenderId: str(env, "VITE_FIREBASE_MESSAGING_SENDER_ID") || ANDROID_SENDER_ID,
      storageBucket: str(env, "VITE_FIREBASE_STORAGE_BUCKET") || `${projectId}.firebasestorage.app`,
    },
    // Never fall back to "(default)": it does not exist in this project.
    databaseId: str(env, "VITE_FIREBASE_FIRESTORE_DATABASE_ID") || ANDROID_FIRESTORE_DATABASE_ID,
    useEmulators,
    configured: useEmulators || missing.length === 0,
    missing: useEmulators ? [] : missing,
  };
}

export const firebaseSettings = resolveFirebaseSettings(import.meta.env as unknown as Env);
