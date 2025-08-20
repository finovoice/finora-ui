"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Clock3, Edit3, EllipsisVertical, Flag, LogOut, Share2 } from "lucide-react"
import type { TradeType } from "@/constants/types"

type Props = {
  trade: TradeType;
  onOpen?: () => void;
  onExit?: (trade: TradeType) => void;
  onEdit?: (trade: TradeType) => void
}

export default function TradeItem({ trade, onOpen, onEdit, onExit }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const side = trade.order
  const symbol = trade.stock_name
  const segment = trade.segment === "EQUITY" ? "EQUITY" : "F&O"
  const intraday = (trade.timehorizon || "").toUpperCase() === "INTRADAY"
  const entryRange = trade.entry_display || trade.entry
  const stoploss = trade.stoploss ?? undefined
  const targets = Array.isArray(trade.targets) ? trade.targets.join(" » ") : undefined
  const time = useMemo(() => new Date(trade.created_at).toLocaleString(), [trade.created_at])

  return (
    <Card className="w-full border-[#e4e7ec] bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={() => onOpen?.()} className="flex flex-1 items-center gap-3 text-left">
          {/* BUY/SELL pill with dot */}
          <span className="inline-flex items-center gap-2 rounded-md border border-[#e6f4d7] bg-[#e6f4d7] px-2 py-1 text-xs font-medium text-[#326212]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#a6ef67]" aria-hidden />
            {side}
          </span>

          <div className="font-medium text-[#344054]">{symbol}</div>

          {/* Tags */}
          <span className="ml-1 inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
            {segment}
          </span>
          {intraday && (
            <span className="inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
              INTRADAY
            </span>
          )}
        </button>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 text-[#667085]">
          {!open && (
            <>
              <button
                className="rounded-md p-2 hover:bg-[#f2f4f7]"
                aria-label="Exit">
                <LogOut className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    onExit?.(trade)
                  }}
                />
              </button>
              <button
                className="rounded-md p-2 hover:bg-[#f2f4f7]"
                aria-label="Edit"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(trade)
                }}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 hover:bg-[#f2f4f7]" aria-label="History">
                <Clock3 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            className="rounded-md p-2 hover:bg-[#f2f4f7]"
            onClick={(e) => {
              e.stopPropagation()
              setOpen((s) => !s)
            }}
            aria-expanded={open}
            aria-label={open ? "Collapse trade details" : "Expand trade details"}
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-[#e9eaeb] px-4 py-3 text-sm text-[#475467]">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#717680]">Entry</span>
              <span className="font-medium text-[#344054]">{entryRange ?? "80124 - 80312"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#98a2b3]" />
              <span className="text-xs text-[#717680]">Stoploss</span>
              <span className="font-medium text-[#344054]">{stoploss ?? "80000"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-[#98a2b3]" />
              <span className="text-xs text-[#717680]">Target(s)</span>
              <span className="font-medium text-[#344054]">{targets ?? "82000 » 103000"}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <EllipsisVertical className="h-4 w-4 text-[#98a2b3]" aria-hidden />
              <span className="text-xs text-[#717680]">Risk/Reward</span>
              <span className="font-medium text-[#344054]">{"2/3"}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#667085]">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{time}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
