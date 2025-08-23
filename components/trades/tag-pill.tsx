"use client"

import * as React from "react"

export default function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
      {children}
    </span>
  )
}
