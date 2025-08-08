"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronsUpDown, Send } from 'lucide-react'
import { cn } from "@/lib/utils"

export type Recipient = { id: string; label: string; group: "plan" | "risk" }

const PLAN_OPTIONS: Recipient[] = [
  { id: "plan_xyz", label: "Plan-name_XYZ", group: "plan" },
  { id: "plan_abc", label: "Plan-name_ABC", group: "plan" },
  { id: "plan_def", label: "Plan-name_DEF", group: "plan" },
  { id: "plan_ghi", label: "Plan-name_GHI", group: "plan" },
]

const RISK_OPTIONS: Recipient[] = [
  { id: "risk_conservative", label: "Conservative", group: "risk" },
  { id: "risk_moderate", label: "Moderate", group: "risk" },
  { id: "risk_aggressive", label: "Aggressive", group: "risk" },
]

export function RecipientsSelect({
  selected,
  onChange,
  onPost,
  className,
  open,
  onOpenChange,
  placeholder = "Select recipients",
}: {
  selected: Recipient[]
  onChange: (next: Recipient[]) => void
  onPost?: () => void
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = typeof open === "boolean"
  const isOpen = isControlled ? open : internalOpen
  const setOpen = (v: boolean) => {
    if (isControlled && onOpenChange) onOpenChange(v)
    else setInternalOpen(v)
  }

  const toggle = (opt: Recipient) => {
    if (selected.find((r) => r.id === opt.id)) {
      onChange(selected.filter((r) => r.id !== opt.id))
    } else {
      onChange([...selected, opt])
    }
  }

  const remove = (id: string) => onChange(selected.filter((r) => r.id !== id))

  const countByGroup = (group: Recipient["group"]) =>
    selected.filter((r) => r.group === group).length

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-12 w-full items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 text-left",
            className,
          )}
        >
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {selected.length === 0 ? (
              <span className="text-[#98a2b3]">{placeholder}</span>
            ) : (
              selected.map((r) => (
                <Chip key={r.id} label={r.label} onRemove={() => remove(r.id)} />
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 text-[#98a2b3]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="border-b border-[#e4e7ec] px-4 py-2">
          <Tabs defaultValue="plans">
            <div className="flex items-center justify-between">
              <TabsList className="h-9 bg-transparent p-0">
                <TabsTrigger className="px-3 data-[state=active]:text-[#7f56d9]" value="plans">
                  Plans <Badge count={countByGroup("plan")} />
                </TabsTrigger>
                <TabsTrigger className="px-3 data-[state=active]:text-[#7f56d9]" value="risk">
                  Risk profile <Badge count={countByGroup("risk")} />
                </TabsTrigger>
              </TabsList>
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
        </div>
        <div className="flex items-center justify-end gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-[#667085] hover:text-[#475467]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onPost?.()
            }}
            className="inline-flex items-center gap-2 rounded-md bg-[#7f56d9] px-3 py-2 text-sm text-white hover:bg-[#6941c6]"
          >
            Post
            <Send className="h-4 w-4" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
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

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#e4e7ec] bg-[#f9fafb] px-2 py-1 text-xs text-[#344054]">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        className="rounded p-0.5 hover:bg-[#e4e7ec]"
        onClick={onRemove}
      >
        <X className="h-3 w-3 text-[#98a2b3]" />
      </button>
    </span>
  )
}

function Badge({ count }: { count: number }) {
  return (
    <span className="ml-2 inline-grid h-5 min-w-5 place-items-center rounded-full bg-[#eef2ff] px-1 text-xs text-[#7f56d9]">
      {count}
    </span>
  )
}
