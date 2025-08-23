"use client"

import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ChevronDown, MessageSquare, RefreshCcw, Search, Upload } from 'lucide-react'
import { useState } from "react"
import ClientDrawer from "@/components/clients/client-drawer"

type ClientRow = {
  id: string
  name: string
  plan: "Elite" | "Lite"
  daysLeft: number
  totalDays: number
  rm: string
  risk: "Aggressive" | "Conservative" | "Moderate"
  phone?: string
  email?: string
  noContract?: boolean
  unread?: boolean
}

const clients: ClientRow[] = [
  { id: "1", name: "Liam Anderson", plan: "Elite", daysLeft: 29, totalDays: 90, rm: "Olivia Rhye", risk: "Aggressive", unread: true, phone: "+91-9876543210", email: "liam.anderson@email.com" },
  { id: "2", name: "Roopkumari Shankar", plan: "Elite", daysLeft: 29, totalDays: 90, rm: "Olivia Rhye", risk: "Aggressive", noContract: true, phone: "+91-9876500001", email: "r.shankar@email.com" },
  { id: "3", name: "Coop Cooper", plan: "Elite", daysLeft: 29, totalDays: 90, rm: "Olivia Rhye", risk: "Aggressive", phone: "+91-9876500002", email: "coop.cooper@email.com" },
  { id: "4", name: "Shawn Hennasey", plan: "Elite", daysLeft: 29, totalDays: 90, rm: "Olivia Rhye", risk: "Aggressive", phone: "+91-9876500003", email: "shawn.h@email.com" },
  { id: "5", name: "Shawn Hennasey", plan: "Elite", daysLeft: 29, totalDays: 90, rm: "Virendra Pal", risk: "Conservative", phone: "+91-9876500004", email: "shawn2@email.com" },
]

export default function ClientsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientRow | null>(null)

  function openActionsDrawer(client: ClientRow) {
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
                      <div className="truncate text-[14px] text-[#1f2937]">{c.name}</div>
                      {c.noContract && (
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
                          <span className="font-semibold">{c.daysLeft} days</span>
                        </div>
                      </div>
                    </div>

                    {/* RM */}
                    <div className="text-sm text-[#475467]">{c.rm}</div>

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
                        {c.unread && (
                          <span className="absolute right-1 top-1 inline-block h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                        )}
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
            client={activeClient as any}
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

function progressPct(c: ClientRow) {
  const elapsed = Math.max(c.totalDays - c.daysLeft, 0)
  const pct = (elapsed / c.totalDays) * 100
  return Math.max(2, Math.min(100, pct))
}
