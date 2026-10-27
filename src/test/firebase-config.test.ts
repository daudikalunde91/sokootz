import { describe, expect, it } from "vitest";
import {
  ANDROID_FIRESTORE_DATABASE_ID,
  ANDROID_PROJECT_ID,
  resolveFirebaseSettings,
} from "@/lib/firebase/config";

describe("Firebase configuration", () => {
  it("targets the Android app's Firebase project by default", () => {
    const s = resolveFirebaseSettings({});
    expect(s.config.projectId).toBe("gen-lang-client-0905574889");
    expect(ANDROID_PROJECT_ID).toBe("gen-lang-client-0905574889");
  });

  it("selects the Android app's named Firestore database, never (default)", () => {
    const s = resolveFirebaseSettings({ VITE_FIREBASE_API_KEY: "k", VITE_FIREBASE_APP_ID: "a" });
    expect(s.databaseId).toBe("ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929");
    expect(s.databaseId).toBe(ANDROID_FIRESTORE_DATABASE_ID);
    expect(s.databaseId).not.toBe("(default)");
  });

  it("is not configured until the web API key and app ID are supplied", () => {
    const s = resolveFirebaseSettings({});
    expect(s.configured).toBe(false);
    expect(s.missing).toEqual(["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_APP_ID"]);
  });

  it("is configured with web API key and app ID and derives the auth domain", () => {
    const s = resolveFirebaseSettings({
      VITE_FIREBASE_API_KEY: "key",
      VITE_FIREBASE_APP_ID: "1:276149702266:web:abc",
    });
    expect(s.configured).toBe(true);
    expect(s.config.authDomain).toBe("gen-lang-client-0905574889.firebaseapp.com");
  });

  it("emulator mode works without production keys", () => {
    const s = resolveFirebaseSettings({ VITE_FIREBASE_USE_EMULATORS: "true" });
    expect(s.configured).toBe(true);
    expect(s.useEmulators).toBe(true);
  });
});
