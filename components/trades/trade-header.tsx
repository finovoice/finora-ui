"use client"

import * as React from "react"
import TagPill from "@/components/trades/tag-pill"
import { ChevronDown, ChevronUp, Hourglass, Send } from "lucide-react"

export default function TradeHeader({ order, symbol, segment, horizon, placedAt, defaultOpen = false }: { order: "BUY" | "SELL" | string; symbol: string; segment: string; horizon?: string; placedAt: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen)
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium ${String(order).toUpperCase() === "BUY" ? "bg-[#e6f4d7] text-[#326212]" : "bg-[#ffe6e6] text-[#992020]"}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${String(order).toUpperCase() === "BUY" ? "bg-[#a6ef67]" : "bg-[#ff6666]"}`} aria-hidden />
          {String(order).toUpperCase()}
        </span>
        <div className="font-medium text-[#101828]">{symbol}</div>
        <TagPill>{segment}</TagPill>
        {horizon && (
          <TagPill>
            <Hourglass className="mr-1 inline h-3 w-3" /> {horizon}
          </TagPill>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs text-[#667085]">
          <Send className="h-4 w-4 text-[#98a2b3]" />
          {placedAt}
          <button className="rounded p-1 hover:bg-[#f2f4f7]" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Collapse" : "Expand"}>
            {open ? <ChevronUp className="h-4 w-4 text-[#98a2b3]" /> : <ChevronDown className="h-4 w-4 text-[#98a2b3]" />}
          </button>
        </div>
      </div>
    </div>
  )
}
