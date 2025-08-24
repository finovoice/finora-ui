"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loginAPI } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {startServerAPI} from "@/services";

export default function LoginPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        startServerAPI().then(() => {
            console.log("Server is running")
        }).catch((error) => {
            console.error("Error starting server:", error);
        });
    }, [])

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken")
            if (token) router.replace("/dashboard")
            if (token) router.replace("/")
        }
    }, [router])


    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)
        const email = String(formData.get("email") || "").trim()
        const password = String(formData.get("password") || "")

        if (!email || !password) {
            setError("Please enter your email and password.")
            setIsSubmitting(false)
            return
        }

        try {
            const res = await loginAPI(email, password)
            if (res?.valid && res?.token) {
                // Persist token
                localStorage.setItem("accessToken", res.token as string)
                // Navigate to the dashboard
                // router.replace("/dashboard")
                router.replace("/")
            } else {
                setError("Invalid credentials. Please try again.")
            }
        } catch (err: any) {
            setError(err?.message || "Unable to sign in. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter your email and password to continue.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error ? (
                            <div
                                role="alert"
                                className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-3 py-2"
                            >
                                {error}
                            </div>
                        ) : null}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

