"use client"

import * as React from "react"

interface ExpiryGaugeProps {
  daysLeft: number
  totalDays: number
}

export default function ExpiryGauge({ daysLeft, totalDays }: ExpiryGaugeProps) {
  const radius = 56
  const stroke = 12
  const size = radius * 2 + stroke
  const normalizedRadius = radius
  const circumference = 2 * Math.PI * normalizedRadius
  const elapsed = Math.max(totalDays - daysLeft, 0)
  const progress = Math.min(Math.max(elapsed / totalDays, 0), 1)
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#f9fafb] px-4 py-3">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="round"
          opacity={0.8}
        />
        <circle
          stroke="#7F56D9"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-right">
        <div className="text-xs text-[#667085]">Expires in</div>
        <div className="text-2xl font-semibold text-[#101828]">{daysLeft} days</div>
      </div>
    </div>
  )
}
