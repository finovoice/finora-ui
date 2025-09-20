import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import "react-datepicker/dist/react-datepicker.css";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <div id="__app_root">
          {/* App Providers */}
          <div suppressHydrationWarning>
            {/* Providers must be client component */}
            {/* eslint-disable-next-line @next/next/no-head-element */}
          </div>
          {/* Wrap app content */}
          {/* Providers component mounts ToastManager globally */}
          {/* Using dynamic import is optional; direct use works */}
          {/* @ts-expect-error Async Server Component boundary wraps client children */}
          <Providers>
            {/* Client-side auth guard to redirect to login when token is missing */}
            <AuthGuard>{children}</AuthGuard>
          </Providers>
        </div>
      </body>
    </html>
  )
}
