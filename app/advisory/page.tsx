"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/sidebar"
import TradeItem from "@/components/trade-item"
import CreateTradeDialog from "@/components/create-trade-dialog"
import EditTradeDialog, { type EditableTrade } from "@/components/edit-trade-dialog"
import { useEffect, useState } from "react"
import { ChevronDown, RefreshCcw, Search, Send } from "lucide-react"
import PreviewPanel, { type PreviewDraft } from "@/components/preview-panel"
import { startServerAPI } from "@/services";
import { getTradesAPI } from "@/services/trades"
import type { TradeType } from "@/constants/types"
import ExitTradeDialog from "@/components/exit-trade-dialog"
import TimelineDisplay from "@/components/timeline-display"
import { ToastManager } from "@/components/ui/toast-manager"
import { showToast } from "@/components/ui/toast-manager"

export default function Page() {
  const [trades, setTrades] = useState<TradeType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [initialSymbol, setInitialSymbol] = useState<string | undefined>(undefined)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [timelineTrade, setTimelineTrade] = useState<TradeType | null>(null)
  const [exitOpen, setExitOpen] = useState(false)
  const [exitTrade, setExitTrade] = useState<TradeType | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editTrade, setEditTrade] = useState<EditableTrade | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        await startServerAPI()
        const data = await getTradesAPI()
        if (!mounted) return
        setTrades(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!mounted) return
        console.error("Error fetching trades:", e)
        setError(e?.message || "Failed to load trades")
        showToast({
          title: "Error",
          description: `Error: Failed to load trades`,
          type: 'error',
          duration: 3000
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  function openCreate(symbol?: string) {
    setInitialSymbol(symbol)
    setCreateOpen(true)
  }

  function openExit(trade: TradeType) {
    setExitTrade(trade)
    setExitOpen(true)
  }

  function openEdit(t: TradeType) {
    const editable: EditableTrade = {
      id: t.id,
      side: t.order,
      scrip: t.stock_name,
      horizon: (t.timehorizon).toUpperCase() as any,
      entryMin: t.entry,
      entryMax: "Max",
      useRange: true,
      stoploss: t.stoploss || undefined,
      targets: Array.isArray(t.targets) ? t.targets : ["82000", "103000"],
    }
    setEditTrade(editable)
    setEditOpen(true)
  }

  function openTimeline(trade: TradeType) {
    setTimelineOpen(true)
    setTimelineTrade(trade)
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />
        <main className="flex-1">
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
                  onClick={() => openCreate(undefined)}
                >
                  <Send className="h-4 w-4" />
                  Send trade
                </Button>
              </div>
            </div>

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

          <section className="px-6 py-4">
            <div className="flex flex-col gap-3">
              {loading && (
                <div className="text-sm text-[#667085]">Loading trades…</div>
              )}
              {!loading && error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              {!loading && !error && trades.length === 0 && (
                <div className="text-sm text-[#667085]">No trades available.</div>
              )}
              {!loading && !error && trades.length > 0 && trades.map((t) => (
                <TradeItem
                  key={t.id}
                  trade={t}
                  onOpen={() => openCreate(t.stock_name.split(" ")[0])}
                  onExit={() => openExit(t)}
                  onEdit={() => openEdit(t)}
                  onPreview={() => openTimeline(t)}
                />
              ))}
            </div>
          </section>

          <CreateTradeDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            initialSymbol={initialSymbol}
          />

          <EditTradeDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            trade={editTrade}
            onSubmit={(updated) => {
            }}
          />

          <ExitTradeDialog
            open={exitOpen}
            onOpenChange={setExitOpen}
            trade={exitTrade}
          />

          <TimelineDisplay
            open={timelineOpen}
            onOpenChange={setTimelineOpen}
            trade={timelineTrade}
          />

          <ToastManager />
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
