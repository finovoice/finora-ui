"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * AuthGuard ensures that users without an access token are redirected to the login screen.
 * It allows the /login route to be accessed without a token.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Allow login route without checks
    if (!pathname || pathname.startsWith("/login")) {
      setChecked(true)
      return
    }

    // Client-side token check
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      if (!token) {
        // Redirect to login if token absent
        router.replace("/login")
        return
      }
    } catch (e) {
      // In case of any localStorage errors, fail closed to login
      router.replace("/login")
      return
    } finally {
      setChecked(true)
    }
  }, [pathname, router])

  // Avoid content flash before decision
  if (!checked) return null

  return <>{children}</>
}
