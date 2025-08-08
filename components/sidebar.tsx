"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Waypoints, Users, ShoppingBag, Settings, LogOut } from 'lucide-react'
import Brand from "@/components/brand"

export default function Sidebar() {
  const nav = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: false },
      { id: "trades", label: "Trades", icon: Waypoints, active: true },
      { id: "clients", label: "Clients", icon: Users, active: false },
      { id: "sales", label: "Sales", icon: ShoppingBag, active: false },
    ],
    [],
  )

  return (
    <aside
      className="hidden md:flex w-[208px] shrink-0 flex-col border-r border-[#e4e7ec] bg-white"
      aria-label="Sidebar"
    >
      <div className="px-4 py-4">
        <Brand />
      </div>
      <nav className="px-2">
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            const activeClasses = item.active
              ? "bg-[#f9f5ff] text-[#6941c6] border border-[#e9d7fe]"
              : "text-[#344054] hover:bg-[#f2f4f7]"
            return (
              <li key={item.id}>
                <button
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${activeClasses}`}
                  aria-current={item.active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-auto px-2 pb-4 pt-6">
        <ul className="space-y-1">
          <li>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#344054] hover:bg-[#f2f4f7]">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#344054] hover:bg-[#f2f4f7]">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
