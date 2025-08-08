"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BadgePercent, Check, ChevronDown, ChevronUp, Clock3, Edit3, EllipsisVertical, Flag, LogOut, RefreshCcw, Search, Send, Settings, Share2, ShoppingBag, Users, LayoutDashboard, Waypoints } from 'lucide-react'
import Sidebar from "@/components/sidebar"
import TradeItem from "@/components/trade-item"
import CreateTradeDialog from "@/components/create-trade-dialog"
import { useState } from "react"

export default function Page() {
  const trades = [
    {
      id: "t1",
      side: "BUY" as const,
      symbol: "TATACHEM 25JAN FUT",
      segment: "F&O",
      intraday: true,
      equity: false,
      expanded: false,
      time: "24 Oct 2024 11:15:58 AM",
    },
    {
      id: "t2",
      side: "BUY" as const,
      symbol: "TATACHEM 25JAN FUT",
      segment: "F&O",
      intraday: true,
      equity: false,
      expanded: true,
      time: "24 Oct 2024 11:15:58 AM",
      entryRange: "80124 - 80312",
      stoploss: "80000",
      targets: "82000 » 103000",
      riskReward: "2/3",
    },
    {
      id: "t3",
      side: "BUY" as const,
      symbol: "TATACHEM 25JAN FUT",
      segment: "EQUITY",
      intraday: true,
      equity: true,
      expanded: false,
      time: "24 Oct 2024 11:15:58 AM",
    },
  ]

  const [createOpen, setCreateOpen] = useState(false)
  const [initialSymbol, setInitialSymbol] = useState<string | undefined>(undefined)

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-[#fafafa] border-b border-[#e4e7ec]">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-[#101828]">Trades</h1>
                <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium bg-[#f9f5ff] text-[#6941c6] border border-[#e9d7fe]">
                  Live
                </span>
                <button className="text-sm text-[#667085] hover:text-[#475467]">Completed</button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="h-9 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                  type="button"
                  onClick={() => { setInitialSymbol(undefined); setCreateOpen(true) }}
                >
                  <Send className="h-4 w-4" />
                  Send trade
                </Button>
              </div>
            </div>
            {/* Filters */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                <FilterButton label="All Orders" />
                <FilterButton label="All Time Horizons" />
                <button className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[#667085] hover:bg-[#f2f4f7]">
                  <RefreshCcw className="h-4 w-4" />
                  <span>Reset filters</span>
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98a2b3]" />
                    <Input
                      className="w-[320px] pl-8 h-9 rounded-md border-[#e4e7ec] placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Search stock"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* List */}
          <section className="px-6 py-4">
            <div className="flex flex-col gap-3">
              {trades.map((t) => (
                <TradeItem key={t.id} trade={t} onOpen={() => { setInitialSymbol(t.symbol.split(" ")[0]); setCreateOpen(true) }} />
              ))}
            </div>
          </section>

          {/* Dialog */}
          <CreateTradeDialog open={createOpen} onOpenChange={setCreateOpen} initialSymbol={initialSymbol} />
        </main>
      </div>
    </div>
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
