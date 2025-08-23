"use client"

import * as React from "react"

export default function TradeStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="inline-flex items-center gap-2 text-xs text-[#667085]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[#101828]">{value}</div>
    </div>
  )
}
