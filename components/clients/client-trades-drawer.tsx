"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@/components/ui/tabs"
import { ChevronDown, Mail, Phone, PencilLine, Send, Clock3, Flag, TrendingUp, LogOut, RefreshCcw } from 'lucide-react'
import PlanDetailsModal from "./plan-details-modal"

type Client = {
  id: string
  name: string
  phone?: string
  email?: string
  plan?: "Elite" | "Lite"
  risk?: "Aggressive" | "Moderate" | "Conservative"
}

export default function ClientTradesDrawer({
  open,
  onOpenChange,
  client,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}) {
  // Mock trades for preview
  const trades = [
    {
      id: "a",
      side: "BUY" as const,
      symbol: "TATACHEM 25JAN FUT",
      tags: ["EQUITY", "INTRADAY"],
      createdAt: "24 Oct 2024 10:28:20 AM",
      collapsed: true,
    },
    {
      id: "b",
      side: "Buy" as const,
      symbol: "TATACHEM",
      tags: ["EQUITY", "SWING"],
      pnl: "+ 10%",
      entry: "80124 - 80312",
      stoploss: "80000",
      exit: "82000 » 103000",
      createdAt: "24 Oct 2024 11:15:58 AM",
      exitedAt: "2 Nov 2024 1:15:28 PM",
      collapsed: false,
    },
  ]

  const [renewOpen, setRenewOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-[840px]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e4e7ec] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate text-[18px] font-semibold text-[#101828]">
                {client?.name ?? "Liam Anderson"}
              </SheetTitle>
              <button aria-label="Edit name" className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]">
                <PencilLine className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#98a2b3]" />{" "}
                <span>{client?.phone ?? "+91-9876543210"}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#98a2b3]" />{" "}
                <span className="truncate">{client?.email ?? "liam.anderson@email.com"}</span>
              </div>
            </div>
          </div>
          <div className="ml-3 mt-1 flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#1e40af]">
              {client?.plan ?? "Elite"}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-medium text-[#475467]">
              {client?.risk ?? "Aggressive"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#e4e7ec] px-5 pt-2">
          <Tabs defaultValue="renewals">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="chat" className="rounded-none px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">
                Chat
                <span className="ml-1 inline-grid h-4 min-w-4 place-items-center rounded-full bg-[#f2f4f7] px-1 text-[10px] text-[#475467]">
                  1
                </span>
              </TabsTrigger>
              <TabsTrigger value="trades" className="rounded-none px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">
                Trades
                <span className="ml-1 inline-grid h-4 min-w-4 place-items-center rounded-full bg-[#f2f4f7] px-1 text-[10px] text-[#475467]">
                  {trades.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-none px-3 py-3">
                Documents
              </TabsTrigger>
              <TabsTrigger value="renewals" className="rounded-none px-3 py-3">
                Renewals
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-none px-3 py-3">
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Chat placeholder */}
            <TabsContent value="chat">
              <div className="px-5 py-6 text-sm text-[#667085]">Chat coming soon.</div>
            </TabsContent>

            {/* Trades Tab */}
            <TabsContent value="trades">
              {/* Filters */}
              <div className="px-5 py-3">
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                  <FilterButton label="All order types" />
                  <FilterButton label="All horizons" />
                </div>
              </div>

              {/* Trades list */}
              <div className="space-y-3 px-5 pb-5">
                {/* Collapsed item */}
                <div className="rounded-lg border border-[#e4e7ec] bg-white">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <BuyPill />
                    <div className="font-medium text-[#344054]">TATACHEM 25JAN FUT</div>
                    <Tag>eQUITY</Tag>
                    <Tag>INTRADAY</Tag>
                    <div className="ml-auto flex items-center gap-2 text-xs text-[#667085]">
                      <Send className="h-4 w-4 text-[#98a2b3]" />
                      <span>24 Oct 2024 10:28:20 AM</span>
                      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                    </div>
                  </div>
                </div>

                {/* Divider "Exited" */}
                <div className="flex items-center gap-3 px-1">
                  <div className="h-px flex-1 bg-[#e9eaeb]" />
                  <span className="text-xs text-[#98a2b3]">Exited</span>
                  <div className="h-px flex-1 bg-[#e9eaeb]" />
                </div>

                {/* Expanded item */}
                <div className="rounded-lg border border-[#e4e7ec] bg-white">
                  {/* Header line */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[11px] text-[#475467]">
                      Buy
                    </span>
                    <div className="font-medium text-[#344054]">TATACHEM</div>
                    <Tag>EQUITY</Tag>
                    <Tag>SWING</Tag>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#e6f4d7] px-2 py-0.5 text-[11px] font-medium text-[#326212]">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {"+ 10%"}
                    </span>

                    <div className="ml-auto hidden items-center gap-3 pr-1 text-xs text-[#667085] sm:flex">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-[#98a2b3]" />
                        <div className="text-right">
                          <div>24 Oct 2024</div>
                          <div className="text-[11px] text-[#98a2b3]">11:15:58 AM</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 text-[#98a2b3]" />
                        <div className="text-right">
                          <div>2 Nov 2024</div>
                          <div className="text-[11px] text-[#98a2b3]">1:15:28 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="border-t border-[#e9eaeb] px-4 py-3 text-sm text-[#475467]">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#98a2b3] rotate-180" />
                        <span className="text-xs text-[#717680]">Entry</span>
                        <span className="font-medium text-[#344054]">80124 - 80312</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#98a2b3]" />
                        <span className="text-xs text-[#717680]">Stoploss</span>
                        <span className="font-medium text-[#344054]">80000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-[#98a2b3]" />
                        <span className="text-xs text-[#717680]">Exited</span>
                        <span className="font-medium text-[#344054]">82000 » 103000</span>
                      </div>
                    </div>

                    {/* Right-side times for small screens */}
                    <div className="mt-3 flex items-center justify-between sm:hidden">
                      <div className="flex items-center gap-1 text-xs text-[#667085]">
                        <Send className="h-4 w-4 text-[#98a2b3]" />
                        <span>24 Oct 2024 11:15:58 AM</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#667085]">
                        <LogOut className="h-4 w-4 text-[#98a2b3]" />
                        <span>2 Nov 2024 1:15:28 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-[#e4e7ec] px-1 pt-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#475467] hover:bg-[#f2f4f7]">
                      Previous
                    </button>
                    <button className="rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#475467] hover:bg-[#f2f4f7]">
                      Next
                    </button>
                  </div>
                  <div className="text-xs text-[#667085]">Showing 1–2 of 2 trades</div>
                </div>
              </div>
            </TabsContent>

            {/* Documents placeholder */}
            <TabsContent value="documents">
              <div className="px-5 py-6 text-sm text-[#667085]">Documents will appear here.</div>
            </TabsContent>

            {/* Notes placeholder */}
            <TabsContent value="notes">
              <div className="px-5 py-6 text-sm text-[#667085]">Notes will appear here.</div>
            </TabsContent>

            {/* Renewals Tab */}
            <TabsContent value="renewals">
              <div className="space-y-4 px-5 pb-6 pt-3">
                {/* Active plan */}
                <div className="rounded-xl border border-[#e4e7ec] bg-white">
                  <div className="flex items-center justify-between border-b border-[#eef2f7] px-4 py-3">
                    <div className="text-sm font-medium text-[#667085]">Active plan</div>
                    <button onClick={() => setRenewOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                      <RefreshCcw className="h-4 w-4 text-[#7f56d9]" />
                      Renew
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="text-2xl font-semibold text-[#101828]">Elite</div>
                      <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-[#475467] sm:grid-cols-2">
                        <div>
                          <div className="text-xs text-[#98a2b3]">Period</div>
                          <div className="mt-1 font-medium text-[#344054]">25th May 2025 - 23rd June 2025</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#98a2b3]">Amount received</div>
                          <div className="mt-1 font-medium text-[#344054]">₹ 1500/-</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-center sm:w-auto">
                      {/* Donut */}
                      <div className="relative h-28 w-28">
                        <svg viewBox="0 0 36 36" className="h-full w-full">
                          <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="#e9eaeb" strokeWidth="4" />
                          <path d="M18 2 a 16 16 0 1 1 0 32" fill="none" stroke="#7f56d9" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 100" />
                        </svg>
                        <div className="absolute inset-0 grid place-items-center text-center">
                          <div>
                            <div className="text-[10px] uppercase text-[#98a2b3]">Expires in</div>
                            <div className="text-2xl font-semibold text-[#101828]">20 days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Past plans */}
                <div className="overflow-hidden rounded-xl border border-[#e4e7ec] bg-white">
                  <div className="border-b border-[#eef2f7] px-4 py-3 text-sm font-medium text-[#667085]">Past plans</div>
                  <div className="hidden grid-cols-12 gap-4 px-4 py-2 text-xs text-[#98a2b3] sm:grid">
                    <div className="col-span-4">Plan</div>
                    <div className="col-span-5">Period</div>
                    <div className="col-span-3 text-right">Paid</div>
                  </div>
                  {[{ plan: "Elite", period: "25th Apr 2025 - 24th May 2025", amount: "₹ 1500/-" },{ plan: "Elite", period: "25th Mar 2025 - 24th Apr 2025", amount: "₹ 1500/-" },{ plan: "Lite", period: "17th Mar 2025 - 24th Mar 2025", amount: "₹ 100/-" }].map((row, i) => (
                    <div key={i} className="grid grid-cols-1 gap-2 border-t border-[#f2f4f7] px-4 py-3 text-sm text-[#344054] sm:grid-cols-12 sm:items-center">
                      <div className="font-medium sm:col-span-4">{row.plan}</div>
                      <div className="text-[#475467] sm:col-span-5">{row.period}</div>
                      <div className="sm:col-span-3 sm:text-right">{row.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <PlanDetailsModal open={renewOpen} onOpenChange={setRenewOpen} />
      </SheetContent>
    </Sheet>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
    </button>
  )
}

function BuyPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[#e6f4d7] bg-[#e6f4d7] px-2 py-1 text-xs font-medium text-[#326212]">
      <span className="inline-block h-2 w-2 rounded-full bg-[#a6ef67]" aria-hidden />
      BUY
    </span>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
      {children}
    </span>
  )
}
