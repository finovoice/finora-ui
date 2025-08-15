"use client"

import React from "react"
import Link from "next/link"
import {usePathname, useRouter} from "next/navigation"
import { LayoutDashboard, Waypoints, Users, ShoppingBag, Settings, LogOut } from "lucide-react"
import Brand from "@/components/brand"
import {signOut} from "@/lib/axiosClient";
import ConfirmDialog from "@/components/confirm-dialog"

type Item = {
  id: string
  label: string
  icon: any
  href: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [loggingOut, setLoggingOut] = React.useState(false)

  const nav: Item[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { id: "trades", label: "Trades", icon: Waypoints, href: "/advisory" },
    { id: "clients", label: "Clients", icon: Users, href: "/clients" },
    { id: "sales", label: "Sales", icon: ShoppingBag, href: "/sales" },
  ]

  return (
    <>
      <aside
        className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-[208px] flex-col border-r border-[#e4e7ec] bg-white h-screen z-20"
        aria-label="Sidebar"
      >
        <div className="px-4 py-4">
          <Brand />
        </div>
        <nav className="px-2">
          <ul className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
              const activeClasses = isActive
                ? "bg-[#f9f5ff] text-[#6941c6] border border-[#e9d7fe]"
                : "text-[#344054] hover:bg-[#f2f4f7]"
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${activeClasses}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto px-2 pb-4 pt-6">
          <ul className="space-y-1">
            <li>
              <Link href="/settings" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#344054] hover:bg-[#f2f4f7]" onClick={() => setLogoutOpen(true)}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="hidden md:block w-[208px] shrink-0" aria-hidden />
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out?"
        description="You will be signed out of your account. You can sign back in anytime."
        confirmText={loggingOut ? "Logging out..." : "Logout"}
        cancelText="Cancel"
        onConfirm={async () => {
          setLoggingOut(true)
          try {
            await Promise.resolve(signOut())
          } finally {
            setLoggingOut(false)
            router.push("/login")
          }
        }}
      />
    </>
  )
}
