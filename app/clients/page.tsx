"use client"

import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ChevronDown, MessageSquare, RefreshCcw, Search, Upload } from 'lucide-react'
import { useEffect, useState } from "react"
import ClientDrawer from "@/components/clients/client-drawer"
import { getClientsAPI } from "@/services/clients"
import type { ClientType } from "@/constants/types"
import type { Client as DrawerClient } from "@/components/clients/client-drawer"
import {startServerAPI} from "@/services";



export default function ClientsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientType | null>(null)
  const [clients, setClients] = useState<ClientType[]>([])

  useEffect(() => {
      startServerAPI().then(() => { console.log("Starting clients") })
      getClientsAPI("?is_converted_to_client=true").then((responseData) => {
          setClients(responseData.data)
      });
  }, [])

  function openActionsDrawer(client: ClientType) {
    setActiveClient(client)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />

        <main className="flex-1">
          {/* Top header */}
          <header className="sticky top-0 z-10 border-b border-[#e4e7ec] bg-[#fafafa]">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">Clients</h1>
                <Tabs defaultValue="active">
                  <TabsList className="bg-transparent p-0">
                    <TabsTrigger value="active" className="rounded-md bg-[#f9f5ff] px-2 py-1 text-xs font-medium text-[#6941c6] data-[state=active]:shadow-none">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="churned" className="rounded-md px-2 py-1 text-xs text-[#667085]">
                      Churned
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button className="h-9 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]">
                <Upload className="h-4 w-4" />
                Import clients
              </Button>
            </div>

            {/* Filters */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                <FilterButton label="All Plans" />
                <FilterButton label="All Risk Profiles" />
                <FilterButton label="Olivia Rhye, Virendra Pal & 2 more" />
                <button className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[#667085] hover:bg-[#f2f4f7]">
                  <RefreshCcw className="h-4 w-4" />
                  <span>Reset filters</span>
                </button>
                <div className="ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98a2b3]" />
                    <Input
                      placeholder="Search"
                      className="h-9 w-[320px] rounded-md border-[#e4e7ec] pl-8 placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Table */}
          <section className="px-6 py-4">
            <div className="overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
              {/* Table head */}
              <div className="grid grid-cols-[1.4fr_2fr_1fr_1fr_64px] items-center border-b border-[#e4e7ec] bg-[#fafafa] px-4 py-2 text-xs font-medium text-[#667085]">
                <div>Client</div>
                <div>Plan | Time to renewal (days)</div>
                <div>Assigned RM</div>
                <div>Risk profile</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              <ul role="list" className="divide-y divide-[#f2f4f7]">
                {clients.map((c) => (
                  <li key={c.id} className="grid grid-cols-[1.4fr_2fr_1fr_1fr_64px] items-center px-4 py-3">
                    {/* Client */}
                    <div className="min-w-0">
                      <div className="truncate text-[14px] text-[#1f2937]">{displayName(c)}</div>
                      {!c.signed_contract_url && (
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-[#b54708]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>No contract</span>
                        </div>
                      )}
                    </div>

                    {/* Plan + progress + label */}
                    <div className="flex items-center gap-4">
                      <div className="min-w-[72px] shrink-0 text-sm text-[#475467]">{c.plan}</div>
                      <div className="relative h-1.5 w-full rounded-full bg-[#e5e7eb]">
                        <div
                          className="absolute left-0 top-0 h-1.5 rounded-full bg-[#98a2b3]"
                          style={{ width: `${progressPct(c)}%` }}
                          aria-label="elapsed"
                        />
                      </div>
                      <div className="shrink-0 text-right text-xs text-[#344054]">
                        <div className="leading-4">
                          <span className="text-[#667085]">Renewal in</span>{" "}
                          <span className="font-semibold">{daysLeft(c)} days</span>
                        </div>
                      </div>
                    </div>

                    {/* RM */}
                    <div className="text-sm text-[#475467]">{c.assigned_rm?.email ?? "—"}</div>

                    {/* Risk */}
                    <div className="text-sm text-[#475467]">{c.risk}</div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="relative rounded-md p-2 text-[#667085] hover:bg-[#f2f4f7]"
                        aria-label="Open actions"
                        title="Open actions"
                        onClick={() => openActionsDrawer(c)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* Drawer */}
          <ClientDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            client={activeClient ? toDrawerClient(activeClient) : null}
          />
        </main>
      </div>
    </div>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
      <span className="truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
    </button>
  )
}

function parseDate(s?: string | null): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function diffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  // Floor difference to avoid partial day inflation
  return Math.floor((b.getTime() - a.getTime()) / msPerDay)
}

function totalDays(c: ClientType): number {
  const start = parseDate(c.start_date)
  const end = parseDate(c.end_date)
  if (start && end) {
    const total = diffDays(start, end)
    return Math.max(1, total)
  }
  // Fallback duration if end not available
  return 30
}

function daysLeft(c: ClientType): number {
  const today = new Date()
  const end = parseDate(c.end_date)
  if (end) {
    return Math.max(0, diffDays(today, end))
  }
  // If end date is missing, assume full period left
  return totalDays(c)
}

function displayName(c: ClientType): string {
  const parts = [c.first_name?.trim(), c.last_name?.trim()].filter(Boolean)
  const name = parts.join(" ").trim()
  return name || c.profile || c.email || c.phone_number || String(c.id)
}

function progressPct(c: ClientType) {
  const total = totalDays(c)
  const elapsed = Math.max(total - daysLeft(c), 0)
  const pct = (elapsed / total) * 100
  return Math.max(2, Math.min(100, pct))
}

function toDrawerClient(c: ClientType): DrawerClient {
  const plan = (c.plan === "Elite" || c.plan === "Lite") ? (c.plan as any) : "Elite"
  const risk = (c.risk === "Aggressive" || c.risk === "Conservative" || c.risk === "Moderate") ? (c.risk as any) : undefined
  return {
    id: String(c.id),
    name: displayName(c),
    plan,
    daysLeft: daysLeft(c),
    totalDays: totalDays(c),
    risk,
    phone: c.phone_number,
    email: c.email,
    rm: c.assigned_rm?.email, 
  }
}
