"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronsUpDown, Send } from 'lucide-react'
import { cn } from "@/lib/utils"

export type Recipient = { id: string; label: string; group: "plan" | "risk" }

const PLAN_OPTIONS: Recipient[] = [
  { id: "STANDARD", label: "STANDARD-name_XYZ", group: "plan" },
  { id: "PREMIUM", label: "PREMIUM-name_ABC", group: "plan" },
  { id: "ELITE", label: "ELITE-name_DEF", group: "plan" },
]

const RISK_OPTIONS: Recipient[] = [
  { id: "CONSERVATIVE", label: "CONSERVATIVE", group: "risk" },
  { id: "AGGRESSIVE", label: "AGGRESSIVE", group: "risk" },
  { id: "HIGH", label: "HIGH", group: "risk" },
]

export function RecipientsSelect({
  selected,
  onChange,
}: {
  selected: Recipient[]
  onChange: (next: Recipient[]) => void
}) {
  const [activeTab, setActiveTab] = React.useState("plans")

  const toggle = (opt: Recipient) => {
    if (selected.find((r) => r.id === opt.id)) {
      onChange(selected.filter((r) => r.id !== opt.id))
    } else {
      onChange([...selected, opt])
    }
  }

  const countByGroup = (group: Recipient["group"]) =>
    selected.filter((r) => r.group === group).length

  return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-1">
            <div className="border-b border-[#e4e7ec] px-4 py-2">
                <div className="flex items-center justify-between">
                    <TabsList className="h-auto bg-transparent p-0">
                        <TabsTrigger
                            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#7f56d9] data-[state=active]:text-[#7f56d9] data-[state=active]:border-b-2 data-[state=active]:border-[#7f56d9] rounded-none bg-transparent data-[state=active]:bg-transparent shadow-none data-[state=active]:shadow-none"
                            value="plans"
                            onClick={() => setActiveTab("plans")}
                        >
                            Plans <Badge count={countByGroup("plan")} />
                        </TabsTrigger>
                        <TabsTrigger
                            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#7f56d9] data-[state=active]:text-[#7f56d9] data-[state=active]:border-b-2 data-[state=active]:border-[#7f56d9] rounded-none bg-transparent data-[state=active]:bg-transparent shadow-none data-[state=active]:shadow-none"
                            value="risk"
                            onClick={() => setActiveTab("risk")}
                        >
                            Risk profile <Badge count={countByGroup("risk")} />
                        </TabsTrigger>
                    </TabsList>
                </div>
            </div>
            <TabsContent value="plans" className="m-0">
                <OptionList
                    options={PLAN_OPTIONS}
                    selected={selected}
                    onToggle={toggle}
                />
            </TabsContent>
            <TabsContent value="risk" className="m-0">
                <OptionList
                    options={RISK_OPTIONS}
                    selected={selected}
                    onToggle={toggle}
                />
            </TabsContent>
        </Tabs>
  )
}

function OptionList({
  options,
  selected,
  onToggle,
}: {
  options: Recipient[]
  selected: Recipient[]
  onToggle: (opt: Recipient) => void
}) {
  return (
    <div className="max-h-64 overflow-auto">
      {options.map((opt) => {
        const checked = !!selected.find((s) => s.id === opt.id)
        return (
          <label
            key={opt.id}
            className="flex cursor-pointer items-center gap-3 border-t border-[#f2f4f7] px-4 py-3 first:border-t-0 hover:bg-[#f9fafb]"
          >
            <Checkbox checked={checked} onCheckedChange={() => onToggle(opt)} />
            <span className="text-[#344054]">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-[#eef2ff] px-1 text-xs text-[#7f56d9]">
      {count}
    </span>
  )
}
