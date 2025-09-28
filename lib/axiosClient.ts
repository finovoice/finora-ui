import {
  TOKEN_STORAGE,
  useAccessTokenAtom,
  useUserAtom,
  userAtom,
  accessTokenAtom,
  USER_DATA_KEY,
} from "@/hooks/user-atom";
import axios from "axios";
import { getDefaultStore, useAtom } from "jotai";

const store = getDefaultStore();

const ApiClient = () => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    let accessToken = null;
    try {
      accessToken = getAuthToken();
    } catch (error) {
      console.error("Error parsing session from localStorage", error);
    }
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      if (typeof window !== "undefined" && status === 401) {
        try {
          // Clear token and redirect to login
          signOut();
        } catch (_) {}
        try {
          const currentPath = window.location?.pathname || "";
          if (!currentPath.startsWith("/login")) {
            window.location.replace("/login");
          }
        } catch (_) {}
      }
      throw {
        ...error,
        status,
        message: error?.response?.data?.message,
      };
    }
  );

  return instance;
};

const getAuthToken = (): string | null => {
  try {
    const token = store.get(accessTokenAtom);
    return String(token);
  } catch (error) {
    console.error("Failed to get token from Jotai atom", error);
    return null;
  }
};

export const signOut = () => {
  if (typeof window === "undefined") return;

  try {
    store.set(userAtom, null);
    store.set(accessTokenAtom, null);
  } catch (_) {}
};

export default ApiClient;
