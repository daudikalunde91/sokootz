/**
 * Firebase Auth session for the website — the same Auth project the Android app
 * uses, so one account works on both. Firebase (IndexedDB persistence) is the
 * only session authority; nothing about the session is kept in localStorage.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  verifyPasswordResetCode,
  type User,
} from "firebase/auth";
import { getFirebase, isFirebaseConfigured } from "@/lib/firebase/client";
import { profileService } from "@/lib/api/services";
import type { UserProfileView } from "@/lib/api/types";

export interface RegistrationDetails {
  displayName: string;
  phoneNumber: string;
  role: "CUSTOMER" | "BUSINESS_OWNER";
  hasAcceptedTerms: boolean;
}

interface AuthState {
  configured: boolean;
  /** True until Firebase restores (or rules out) a persisted session. */
  loading: boolean;
  user: User | null;
  profile: UserProfileView | null;
  profileError: unknown;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string, details: RegistrationDetails) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmReset: (code: string, password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileView | null>(null);
  const [profileError, setProfileError] = useState<unknown>(null);
  const pending = useRef<RegistrationDetails | null>(null);

  /** Same flow as Android AuthManager.loadOrCreateUserProfile: read users/{uid}, create if missing. */
  const syncProfile = useCallback(async (u: User) => {
    setProfileError(null);
    try {
      const existing = await profileService.get(u.uid);
      if (existing) {
        setProfile(existing);
      } else {
        const p = pending.current;
        const created = await profileService.create(u.uid, {
          displayName: p?.displayName || u.displayName || "Mwanachama SokoTZ",
          email: u.email ?? "",
          phoneNumber: p?.phoneNumber || u.phoneNumber || "",
          role: p?.role ?? "CUSTOMER",
          photoUrl: u.photoURL ?? "",
          aiPreferredName: p?.displayName || u.displayName || "",
          hasAcceptedTerms: p?.hasAcceptedTerms ?? true,
        });
        setProfile(created);
      }
    } catch (e) {
      setProfile(null);
      setProfileError(e);
    } finally {
      pending.current = null;
    }
  }, []);

  useEffect(() => {
    if (!configured) return;
    const { auth } = getFirebase();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await syncProfile(u);
      else setProfile(null);
      setLoading(false);
    });
  }, [configured, syncProfile]);

  const value = useMemo<AuthState>(
    () => ({
      configured,
      loading,
      user,
      profile,
      profileError,
      signInEmail: async (email, password) => {
        await signInWithEmailAndPassword(getFirebase().auth, email.trim(), password);
      },
      registerEmail: async (email, password, details) => {
        pending.current = details;
        try {
          const cred = await createUserWithEmailAndPassword(
            getFirebase().auth,
            email.trim(),
            password,
          );
          if (details.displayName)
            await updateProfile(cred.user, { displayName: details.displayName }).catch(
              () => undefined,
            );
        } catch (e) {
          pending.current = null;
          throw e;
        }
      },
      signInGoogle: async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(getFirebase().auth, provider);
      },
      signOut: async () => {
        await fbSignOut(getFirebase().auth);
      },
      sendReset: async (email) => {
        await sendPasswordResetEmail(getFirebase().auth, email.trim());
      },
      verifyResetCode: (code) => verifyPasswordResetCode(getFirebase().auth, code),
      confirmReset: async (code, password) => {
        await confirmPasswordReset(getFirebase().auth, code, password);
      },
      refreshProfile: async () => {
        const u = getFirebase().auth.currentUser;
        if (u) await syncProfile(u);
      },
    }),
    [configured, loading, user, profile, profileError, syncProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
