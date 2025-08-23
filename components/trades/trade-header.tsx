"use client"

import * as React from "react"
import TagPill from "@/components/trades/tag-pill"
import { ChevronDown, ChevronUp, Hourglass, Send } from "lucide-react"

export default function TradeHeader({ order, symbol, segment, horizon, placedAt, defaultOpen = false, children }: { order: "BUY" | "SELL" | string; symbol: string; segment: string; horizon?: string; placedAt: string; defaultOpen?: boolean; children?: React.ReactNode }) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen)
  const contentId = React.useId()
  return (
    <div>
      <button
        type="button"
        className="w-full px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
      >
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
            {open ? <ChevronUp className="h-4 w-4 text-[#98a2b3]" /> : <ChevronDown className="h-4 w-4 text-[#98a2b3]" />}
          </div>
        </div>
      </button>
      {children && open ? (
        <div id={contentId} className="border-t border-[#f2f4f7] px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  )
}
