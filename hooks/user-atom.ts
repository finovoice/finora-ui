"use client";

import { atom, useAtom, useSetAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Shape of user_data coming from the backend
export type UserData = {
  id: number;
  email: string;
  phone_number?: string;
  organisation?: number;
  organisation_name?: string;
  permissions?: string[];
  type?: string;
  type_display?: string;
  is_admin?: boolean;
  is_org_admin?: boolean;
  is_verified?: boolean;
  date_joined?: string;
  last_login?: string;
  // Allow unknown extra fields without breaking
  [key: string]: any;
} | null;

// Key used in storage
export const USER_DATA_KEY = "user_data";
export const TOKEN_STORAGE = "accessToken";

// Use sessionStorage by default; can be switched to localStorage if desired
const storageUserData = createJSONStorage<UserData>(() => {
  if (typeof window === "undefined") return undefined as any;
  // Change to localStorage to persist across browser sessions
  return window.localStorage;
});

const storageToken = createJSONStorage<string | null>(() => {
  if (typeof window === "undefined") return undefined as any;
  return window.localStorage;
});

// Atom that persists to storage and hydrates on client init
export const userAtom = atomWithStorage<UserData>(
  USER_DATA_KEY,
  null,
  storageUserData
);

// Convenience hook
export function useUserAtom() {
  return useAtom(userAtom);
}

//token atom
export const accessTokenAtom = atomWithStorage<string | null>(
  TOKEN_STORAGE,
  null,
  storageToken
);

export function useAccessTokenAtom() {
  return useAtom(accessTokenAtom);
}

// Helper to clear user data (e.g., on sign out)
export const clearUserAtom = atom(null, (_get, set) => {
  set(userAtom, null);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(USER_DATA_KEY);
    } catch (_) {}
  }
});

export const clearAccessTokenAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
});
