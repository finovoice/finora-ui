"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LeadCard, { type LeadCardProps } from "@/components/sales/lead-card"
import Sidebar from "@/components/sidebar"
import { ChevronDown, Upload, RotateCcw, Search } from 'lucide-react'

export default function SalesPage() {
  const columns: {
    id: string
    title: string
    leads: LeadCardProps[]
  }[] = [
    {
      id: "leads",
      title: "Leads",
      leads: [
        { name: "Liam Anderson", hot: false, tier: undefined },
        { name: "Mia Wilson", hot: false, tier: undefined },
      ],
    },
    {
      id: "contacted",
      title: "Contacted",
      leads: [
        { name: "Noah Thompson", hot: true, tier: "Elite" },
        { name: "Fenton Jinwell", hot: false, tier: undefined },
      ],
    },
    {
      id: "onboarding",
      title: "Onboarding",
      leads: [{ name: "Aiden Carter", hot: true, tier: "Elite" }],
    },
    {
      id: "awaiting",
      title: "Awaiting payment",
      leads: [{ name: "Sophie Vergara", hot: false, tier: "Elite" }],
    },
  ]

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto flex">
        <Sidebar />

        <div className="flex-1">
          <header className="sticky top-0 z-10 border-b border-[#e4e7ec] bg-[#fafafa]">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-lg font-semibold text-[#101828]">Sales</h1>
              <Button className="h-9 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]">
                <Upload className="h-4 w-4" />
                Import leads
              </Button>
            </div>
            <div className="px-6 pb-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                <FilterButton label="All Plans" />
                <FilterButton label="All Sources" />
                <FilterButton label="All Lead quality" />
                <button className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[#667085] hover:bg-[#f2f4f7]">
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <div className="ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98a2b3]" />
                    <Input
                      className="h-9 w-[320px] rounded-md border-[#e4e7ec] pl-8 placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Search by name"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 py-4">
            {/* Vertically stacked stages */}
            <div className="flex flex-col gap-4">
              {columns.map((col) => (
                <section key={col.id} className="rounded-lg border border-[#e4e7ec] bg-white">
                  <div className="flex items-center justify-between px-3 py-2">
                    <h2 className="text-sm font-medium text-[#1f2937]">
                      {col.title}{" "}
                      <span className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-[#f2f4f7] px-1 text-xs text-[#475467]">
                        {col.leads.length}
                      </span>
                    </h2>
                    <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                  </div>
                  <div className="space-y-3 border-t border-[#f2f4f7] p-3">
                    {col.leads.map((lead) => (
                      <LeadCard key={lead.name} {...lead} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
    </button>
  )
}
