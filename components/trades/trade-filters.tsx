"use client"

import * as React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function TradeFilters() {
  const [orderType, setOrderType] = React.useState<string>("all")
  const [horizon, setHorizon] = React.useState<string>("all")
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={orderType} onValueChange={setOrderType}>
        <SelectTrigger className="h-9 rounded-md border-[#e4e7ec]"><SelectValue placeholder="All order types" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All order types</SelectItem>
          <SelectItem value="buy">Buy</SelectItem>
          <SelectItem value="sell">Sell</SelectItem>
        </SelectContent>
      </Select>
      <Select value={horizon} onValueChange={setHorizon}>
        <SelectTrigger className="h-9 rounded-md border-[#e4e7ec]"><SelectValue placeholder="All horizons" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All horizons</SelectItem>
          <SelectItem value="intraday">Intraday</SelectItem>
          <SelectItem value="swing">Swing</SelectItem>
          <SelectItem value="positional">Positional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
