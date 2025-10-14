"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { accessTokenAtom, useAccessTokenAtom } from "@/hooks/user-atom";

/**
 * AuthGuard ensures that users without an access token are redirected to the login screen.
 * It allows the /login route to be accessed without a token.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [token] = useAccessTokenAtom(); // Subscribe to atom here

  useEffect(() => {
    async function checkAuth() {
      if (token === null) {
        // Token is still loading, do nothing and wait
        return;
      }
      const isLoginPage = pathname === "/login";

      if (token && isLoginPage) {
        // If logged in and on login page, redirecting to previous path or dashboard
        router.replace(sessionStorage.getItem("lastPath") || "/");
      } else if (!token && !isLoginPage) {
        // Save the last path to return after login
        sessionStorage.setItem("lastPath", pathname);
        router.replace("/login");
      } else {
        setChecked(true);
      }
    }

    checkAuth();
  }, [pathname, router, token]);

  // Avoid content flash before decision
  if (!checked) return null;

  return <>{children}</>;
}
