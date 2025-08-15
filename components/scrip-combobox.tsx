"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { stocks } from "@/lib/stocks"

export default function ScripCombobox({
  value,
  onChange,
  blankInputWarning = false,
  placeholder = "Search",
}: {
  value?: string
  onChange: (v: string | undefined) => void
  placeholder?: string
  blankInputWarning?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const selected = React.useMemo(() => stocks.find((s) => s.ticker === value), [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            `flex w-full items-center justify-between rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-left text-sm ${blankInputWarning ? 'border-red-500' : 'border-[#e4e7ec]'}`,
            "hover:bg-[#f9fafb]",
          )}
        >
          <span className={cn("truncate text-[#344054]", !value && "text-[#98a2b3]")}>
            {value ? `${selected?.name ?? value}` : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-[#98a2b3]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={true}>
          <div className="px-2 pb-2 pt-2">
            <CommandInput placeholder="Search" />
          </div>
          <CommandList className="max-h-64 ml-2">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {stocks.map((s) => (
                <CommandItem
                  key={s.ticker}
                  value={`${s.name} ${s.ticker}`}
                  onSelect={() => {
                    onChange(s.ticker)
                    setOpen(false)
                  }}
                >
                  <div className="flex w-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1f2937]">{s.name}</span>
                      {value === s.ticker && <Check className="h-4 w-4 text-[#7f56d9]" />}
                    </div>
                    <span className="text-xs text-[#667085]">{s.ticker}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
