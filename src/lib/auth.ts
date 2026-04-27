import type { AuthUser } from "@/types";

const STORAGE_KEY = "hc:auth-user";

function readUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeUser(u: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function buildUser(email: string): AuthUser {
  return {
    uid: `local-${btoa(email).slice(0, 12)}`,
    email,
    displayName: email.split("@")[0],
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!email || !password) throw new Error("Email and password are required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const user = buildUser(email);
  writeUser(user);
  return user;
}

export async function signUp(email: string, password: string): Promise<AuthUser> {
  return signIn(email, password);
}

export async function signOut(): Promise<void> {
  writeUser(null);
}

export function onAuthStateChanged(cb: (u: AuthUser | null) => void): () => void {
  cb(readUser());
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(readUser());
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
