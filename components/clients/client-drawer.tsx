"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Phone, Mail, PencilLine, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import TradeFilters from "@/components/trades/trade-filters"
import TradeHeader from "@/components/trades/trade-header"
import TradeCard from "@/components/trades/trade-card"

export type Client = {
  id: string
  name: string
  plan: "Elite" | "Lite"
  daysLeft: number
  totalDays: number
  rm?: string
  risk?: "Aggressive" | "Conservative" | "Moderate"
  phone?: string
  email?: string
}

export default function ClientDrawer({
  open,
  onOpenChange,
  client,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}) {
  const [tab, setTab] = React.useState("renewals")

  React.useEffect(() => {
    // When client changes or drawer opens, default to Renewals tab
    if (open) setTab("renewals")
  }, [client?.id, open])

  const name = client?.name ?? "Liam Anderson"
  const phone = client?.phone ?? "+91-9876543210"
  const email = client?.email ?? "liam.anderson@email.com"
  const plan = client?.plan ?? "Elite"
  const risk = client?.risk ?? "Aggressive"
  const daysLeft = client?.daysLeft ?? 20
  const totalDays = client?.totalDays ?? 90

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[840px] p-0 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e4e7ec] px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate text-[18px] font-semibold text-[#101828]">{name}</SheetTitle>
              <button className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]" aria-label="Edit name">
                <PencilLine className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#98a2b3]" />
                <span>{phone}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#98a2b3]" />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-start gap-2">
            <Badge text={plan} />
            <Badge text={risk ?? ""} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-[#e4e7ec] px-6 pt-2">
            <TabsList className="bg-transparent p-0 text-sm">
              <Tab value="chat" label="Chat" />
              <Tab value="trades" label="Trades" />
              <Tab value="contract" label="Contract" />
              <Tab value="renewals" label="Renewals" />
              <Tab value="notes" label="Notes" />
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="chat" className="px-6 py-5 text-sm text-[#667085]">Coming soon.</TabsContent>
            <TabsContent value="trades" className="space-y-4 px-6 py-5">
              <TradeFilters />

              {/* Example future trade (collapsed header style) */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <TradeHeader
                  order="BUY"
                  symbol="TATACHEM 25JAN FUT"
                  segment="EQUITY"
                  horizon="INTRADAY"
                  placedAt="24 Oct 2024 10:28:20 AM"
                  defaultOpen={false}
                />
              </div>

              {/* Section divider: Exited */}
              <div className="flex items-center gap-3 px-2">
                <div className="h-px w-full bg-[#e4e7ec]" />
                <div className="text-xs text-[#667085]">Exited</div>
                <div className="h-px w-full bg-[#e4e7ec]" />
              </div>

              {/* Example exited trade card */}
              <TradeCard
                order="Buy"
                symbol="TATACHEM"
                segment="EQUITY"
                horizon="SWING"
                returnPct={10}
                entryRange="80124 - 80312"
                stoploss="80000"
                exitFrom="82000"
                exitTo="103000"
                placedAt="24 Oct 2024\n11:15:58 AM"
                exitedAt="2 Nov 2024\n1:15:28 PM"
              />

              {/* Footer controls */}
              <div className="flex items-center justify-between border-t border-[#e4e7ec] px-2 pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                <div className="text-xs text-[#667085]">Showing 1-2 of 2 trades</div>
              </div>
            </TabsContent>
            <TabsContent value="contract" className="px-6 py-5 text-sm text-[#667085]">Coming soon.</TabsContent>
            <TabsContent value="notes" className="px-6 py-5 text-sm text-[#667085]">Coming soon.</TabsContent>

            {/* Renewals */}
            <TabsContent value="renewals" className="space-y-6 px-6 py-6">
              {/* Active plan card */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                  <div className="text-xs font-medium text-[#667085]">Active plan</div>
                  <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                    <RefreshCcw className="h-4 w-4" />
                    Renew
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 px-5 py-5 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-4">
                    <div className="text-xl font-semibold text-[#101828]">{plan}</div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Info label="Period" value="25th May 2025 - 23rd June 2025" />
                      <Info label="Amount received" value={<span>₹ 1500/-</span>} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ExpiryGauge daysLeft={daysLeft} totalDays={totalDays} />
                  </div>
                </div>
              </div>

              {/* Past plans */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <div className="border-b border-[#f2f4f7] px-5 py-3 text-xs font-medium text-[#667085]">Past plans</div>
                <div className="divide-y divide-[#f2f4f7]">
                  <Row plan="Elite" period="25th Apr 2025 - 24th May 2025" amount="₹ 1500/-" />
                  <Row plan="Elite" period="25th Mar 2025 - 24th Apr 2025" amount="₹ 1500/-" />
                  <Row plan="Lite" period="17th Mar 2025 - 24th Mar 2025" amount="₹ 100/-" />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}


function Tab({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-0 px-3 py-3 text-[#667085] data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]"
    >
      {label}
    </TabsTrigger>
  )
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-3 py-1 text-xs text-[#475467]">
      {text}
    </span>
  )
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-[#667085]">{label}</div>
      <div className="text-[#101828]">{value}</div>
    </div>
  )
}

function Row({ plan, period, amount }: { plan: string; period: string; amount: string }) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 px-5 py-4 sm:grid-cols-[1fr_1fr_auto]">
      <div className="text-[#101828]">{plan}</div>
      <div className="text-[#475467]">{period}</div>
      <div className="text-[#101828]">{amount}</div>
    </div>
  )
}

// Circular progress gauge for "Expires in X days"
function ExpiryGauge({ daysLeft, totalDays }: { daysLeft: number; totalDays: number }) {
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
