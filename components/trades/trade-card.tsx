"use client"

import * as React from "react"
import TagPill from "@/components/trades/tag-pill"
import DateStack from "@/components/trades/date-stack"
import TradeStat from "@/components/trades/trade-stat"
import { ArrowRight, Clock, Flag, Hourglass, Send, Target } from "lucide-react"

export default function TradeCard({ order, symbol, segment, horizon, returnPct, entryRange, stoploss, exitFrom, exitTo, placedAt, exitedAt }: { order: string; symbol: string; segment: string; horizon?: string; returnPct?: number; entryRange: string; stoploss: string; exitFrom: string; exitTo: string; placedAt: string; exitedAt: string }) {
  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white">
      <div className="px-4 pt-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium bg-[#e6f4d7] text-[#326212]"><span className="inline-block h-2 w-2 rounded-full bg-[#a6ef67]" />{order}</span>
          <div className="text-base font-medium text-[#101828]">{symbol}</div>
          <TagPill>{segment}</TagPill>
          {horizon && <TagPill><Hourglass className="mr-1 inline h-3 w-3" /> {horizon}</TagPill>}
          {typeof returnPct === "number" && (
            <span className="ml-1 inline-flex items-center rounded-md bg-[#e9f9ee] text-[#067647] px-2 py-0.5 text-[10px] font-semibold">↗ {returnPct}%</span>
          )}
          <div className="ml-auto flex items-center gap-2 text-xs text-[#667085]">
            <DateStack top={placedAt.split("\n")[0]} bottom={placedAt.split("\n")[1] ?? ""} icon={<Send className="h-4 w-4 text-[#98a2b3]" />} />
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 items-start gap-4 px-4 pb-4 sm:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <TradeStat icon={<Clock className="h-4 w-4 text-[#98a2b3]" />} label="Entry" value={<span>{entryRange}</span>} />
          <TradeStat icon={<Target className="h-4 w-4 text-[#98a2b3]" />} label="Stoploss" value={<span>{stoploss}</span>} />
          <TradeStat icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} label="Exited" value={<span className="inline-flex items-center gap-2">{exitFrom} <ArrowRight className="h-3 w-3 text-[#98a2b3]" /> {exitTo}</span>} />
        </div>
        <div className="hidden sm:flex flex-col items-end gap-4 pr-1">
          <DateStack top={exitedAt.split("\n")[0]} bottom={exitedAt.split("\n")[1] ?? ""} icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} />
        </div>
      </div>
    </div>
  )
}
