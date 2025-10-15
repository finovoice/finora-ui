"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccessTokenAtom } from "@/hooks/user-atom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token] = useAccessTokenAtom();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initial check is complete after first render
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (isChecking) return;

    const isLoginPage = pathname === "/login";

    // Only redirect if we're sure about the token state
    if (token === null && !isLoginPage) {
      sessionStorage.setItem("lastPath", pathname);
      router.replace("/login");
      return;
    }

    if (token && isLoginPage) {
      const lastPath = sessionStorage.getItem("lastPath") || "/";
      router.replace(lastPath);
    }
  }, [token, pathname, router, isChecking]);

  // Show loading only during initial check
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If we're redirecting to login, show nothing briefly
  if (token === null && pathname !== "/login") {
    return null;
  }

  // If we're redirecting from login, show nothing briefly  
  if (token && pathname === "/login") {
    return null;
  }

  // Otherwise, show the content
  return <>{children}</>;
}