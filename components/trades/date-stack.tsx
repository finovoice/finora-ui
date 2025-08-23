"use client"

import * as React from "react"

export default function DateStack({ top, bottom, icon }: { top: string; bottom: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-[#475467]">
      {icon}
      <div className="text-right">
        <div className="whitespace-pre leading-tight">{top}</div>
        <div className="whitespace-pre leading-tight text-[#98a2b3]">{bottom}</div>
      </div>
    </div>
  )
}
