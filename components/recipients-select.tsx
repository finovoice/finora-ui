// 



"use client"

import * as React from "react"
import { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronsUpDown, Send } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export type Recipient = { id: string; label: string; group: "plan" | "risk" }

const PLAN_OPTIONS: Recipient[] = [
  { id: "STANDARD", label: "STANDARD-name_XYZ", group: "plan" },
  { id: "PREMIUM", label: "PREMIUM-name_ABC", group: "plan" },
  { id: "ELITE", label: "ELITE-name_DEF", group: "plan" },
]

const RISK_OPTIONS: Recipient[] = [
  { id: "CONSERVATIVE", label: "Conservative", group: "risk" },
  { id: "AGGRESSIVE", label: "Aggressive", group: "risk" },
  { id: "HIGH", label: "High", group: "risk" },
]

export function RecipientsSelect({
  selected,
  onChange,
}: {
  selected: Recipient[]
  onChange: (recipents: Recipient[]) => void
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = React.useState("plans")
  const [toggleTab, setToggleTab] = useState(false)
  const recipientSelectRef = useRef<HTMLDivElement>(null);

  useClickOutside(recipientSelectRef, () => setToggleTab(false));

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
    <div
      className="relative w-full max-w-xs"
      ref={recipientSelectRef}
    >
      <div className="flex flex-nowrap overflow-x-auto items-center gap-1 border rounded px-2 py-1 focus-within:ring-1 focus-within:ring-blue-500 thin-scrollbar">
        {selected.map((item) => (
          <span
            key={item.id}
            className="shrink-0 border-1 text-gray-600 px-2 py-0.5 rounded-sm text-sm flex items-center gap-1"
          >
            {item.label}
            <button
              type="button"
              onClick={() => toggle(item)}
              className="text-lg m-1 text-gray-500 hover:text-blue-700"
            >
              ×
            </button>
          </span>
        ))}
        <input
          onClick={() => setToggleTab(true)}
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={selected[0] ? "" : "Select Recipients"}
          className="min-w-0 flex-grow outline-none py-1 px-2"
        />
      </div>

      {toggleTab &&
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-1 rounded mb-5 absolute bottom-full bg-white left-0">
          <div className="border-b border-[#e4e7ec] px-4 pt-2">
            <div className="flex items-center justify-between">
              <TabsList className="h-auto bg-transparent p-0">
                <TabsTrigger
                  className="px-3 py-2 text-sm text-gray-600 hover:text-[#7f56d9] data-[state=active]:text-[#7f56d9] data-[state=active]:border-b-2 data-[state=active]:border-[#7f56d9] rounded-none bg-transparent data-[state=active]:bg-transparent shadow-none data-[state=active]:shadow-none"
                  value="plans"
                  onClick={() => setActiveTab("plans")}
                >
                  Plans <Badge count={countByGroup("plan")} />
                </TabsTrigger>
                <TabsTrigger
                  className="px-3 py-2 text-sm text-gray-600 hover:text-[#7f56d9] data-[state=active]:text-[#7f56d9] data-[state=active]:border-b-2 data-[state=active]:border-[#7f56d9] rounded-none bg-transparent data-[state=active]:bg-transparent shadow-none data-[state=active]:shadow-none"
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
        </Tabs>}
    </div>

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
    <div className="max-h-64 text-sm overflow-auto">
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
