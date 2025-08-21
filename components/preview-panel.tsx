"use client"

import * as React from "react"
import { X, Pencil, Send, Flag, Clock3 } from 'lucide-react'
import { RecipientsSelect, type Recipient } from "./recipients-select"
import { cn } from "@/lib/utils"

export type PreviewDraft = {
  side: "BUY" | "SELL" | "HOLD"
  scrip?: string
  segment?: "EQUITY" | "F&O"
  horizon?: "INTRADAY" | "SWING" | "LONGTERM"
  entryMin?: string
  entryMax?: string
  stoploss?: string
  targets?: string[]
  rr?: string
}

export default function PreviewPanel({
  open,
  onClose,
  draft,
}: {
  open: boolean
  onClose: () => void
  draft: PreviewDraft | null
}) {
  const [selected, setSelected] = React.useState<Recipient[]>([
    { id: "plan_xyz", label: "Plan-name_XYZ", group: "plan" },
  ])

  if (!open || !draft) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 flex items-start justify-center bg-black/30 px-4 py-10",
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl space-y-3">
        {/* Preview summary bar */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_0_0_rgba(15,23,42,0.02),0_12px_24px_-8px_rgba(2,6,23,0.1)]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#e6f4d7] bg-[#e6f4d7] px-2 py-1 text-xs font-medium text-[#326212]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#a6ef67]" />
                {draft.side}
              </span>
              <span className="text-lg font-semibold tracking-wide text-[#1f2937]">
                {draft.scrip ?? "RELIANCE"}
              </span>
              {draft.segment && (
                <span className="ml-1 inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-xs font-medium uppercase text-[#475467]">
                  {draft.segment}
                </span>
              )}
              {draft.horizon && (
                <span className="inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-xs font-medium uppercase text-[#475467]">
                  {draft.horizon}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#475467]">
                Preview <Pencil className="h-4 w-4 text-[#7f56d9]" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="rounded-md p-2 text-[#667085] hover:bg-[#f2f4f7]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t border-[#e9eaeb] px-4 py-3 sm:grid-cols-4">
            <Metric label="Entry" value={`${draft.entryMin ?? "1500"}${draft.entryMax ? ` - ${draft.entryMax}` : ""}`} />
            <Metric label="Stoploss" value={draft.stoploss ?? "1475"} />
            <Metric label="Target(s)" value={draft.targets?.filter(Boolean).join(" - ") || "1620 - 1710"} />
            <Metric label="Risk/Reward" value={draft.rr ?? "2/3"} />
          </div>
        </div>

        {/* Recipients + Post bar */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_0_0_rgba(15,23,42,0.02),0_12px_24px_-8px_rgba(2,6,23,0.1)]">
          <div className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <RecipientsSelect
                selected={selected}
                onChange={setSelected}
              />
            </div>
            <button
              onClick={() => {
                console.log("Post trade to:", selected)
                onClose()
              }}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#7f56d9] px-4 text-sm text-white hover:bg-[#6941c6]"
            >
              Post
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {label === "Target(s)" ? (
        <Flag className="h-4 w-4 text-[#98a2b3]" />
      ) : label === "Stoploss" ? (
        <Clock3 className="h-4 w-4 text-[#98a2b3] rotate-180" />
      ) : null}
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-[#475467]">{label}</div>
        <div className="text-base text-[#1f2937]">{value}</div>
      </div>
    </div>
  )
}
