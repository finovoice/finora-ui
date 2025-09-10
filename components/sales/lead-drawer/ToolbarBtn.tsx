"use client"

import React from "react"

export default function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" aria-label={label} className="rounded-md p-1.5 hover:bg-[#eef2f6]">
      {icon}
    </button>
  )
}
