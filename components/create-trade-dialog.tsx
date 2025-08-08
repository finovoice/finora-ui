"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Flag, Clock3, Target, Ban, Bike, Layers3, Send, UsersRound } from 'lucide-react'
import ScripCombobox from "./scrip-combobox"
import type { PreviewDraft } from "./preview-panel"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSymbol?: string
  onRecipientsClick?: (draft: PreviewDraft) => void
}

export default function CreateTradeDialog({ open, onOpenChange, initialSymbol, onRecipientsClick }: Props) {
  const [order, setOrder] = useState<"BUY" | "SELL" | "HOLD">("BUY")
  const [horizon, setHorizon] = useState<"INTRADAY" | "SWING" | "LONGTERM">("INTRADAY")
  const [scrip, setScrip] = useState<string | undefined>(initialSymbol)
  const [segment, setSegment] = useState<"EQUITY" | "F&O">("EQUITY")
  const [entryMin, setEntryMin] = useState<string>("")
  const [entryMax, setEntryMax] = useState<string>("")
  const [useRange, setUseRange] = useState<boolean>(false)
  const [stoploss, setStoploss] = useState<string>("")
  const [targets, setTargets] = useState<string[]>([""])

  function updateTarget(idx: number, val: string) {
    setTargets((t) => t.map((v, i) => (i === idx ? val : v)))
  }

  function addTarget() {
    setTargets((t) => [...t, ""])
  }

  function onSend() {
    // demo only
    console.log("send draft")
    onOpenChange(false)
  }

  function handoffToRecipients() {
    const draft: PreviewDraft = {
      side: order,
      scrip,
      segment,
      horizon,
      entryMin,
      entryMax: useRange ? entryMax : undefined,
      stoploss,
      targets,
      rr: "2/3",
    }
    onOpenChange(false)
    onRecipientsClick?.(draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4">
          <DialogTitle className="text-xl text-[#101828]">Create trade</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Order */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Bike className="h-4 w-4" />} text="Order" />
            <RadioGroup
              className="flex gap-6"
              value={order}
              onValueChange={(v: "BUY" | "SELL" | "HOLD") => setOrder(v)}
            >
              <RadioItem value="BUY" label="BUY" />
              <RadioItem value="SELL" label="SELL" />
              <RadioItem value="HOLD" label="HOLD" />
            </RadioGroup>
          </div>

          {/* Scrip */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Layers3 className="h-4 w-4" />} text="Scrip" />
            <ScripCombobox value={scrip} onChange={setScrip} placeholder="Search" />
          </div>

          {/* Horizon */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Clock3 className="h-4 w-4" />} text="Horizon" />
            <RadioGroup
              className="flex flex-wrap gap-x-6 gap-y-2"
              value={horizon}
              onValueChange={(v: "INTRADAY" | "SWING" | "LONGTERM") => setHorizon(v)}
            >
              <RadioItem value="INTRADAY" label="INTRADAY" />
              <RadioItem value="SWING" label="SWING" />
              <RadioItem value="LONGTERM" label="LONGTERM" />
            </RadioGroup>
          </div>

          {/* Entry */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Clock3 className="h-4 w-4 rotate-180" />} text="Entry" />
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CurrencyInput
                  placeholder="Min"
                  value={entryMin}
                  onChange={(e) => setEntryMin(e.target.value)}
                />
                <CurrencyInput
                  placeholder="Max"
                  value={entryMax}
                  onChange={(e) => setEntryMax(e.target.value)}
                  disabled={!useRange}
                />
              </div>
              <div className="flex items-center gap-2 self-end">
                <Switch id="range" checked={useRange} onCheckedChange={setUseRange} />
                <Label htmlFor="range" className="text-sm text-[#667085]">
                  Range
                </Label>
              </div>
            </div>
          </div>

          {/* Stoploss */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Ban className="h-4 w-4" />} text="Stoploss" />
            <CurrencyInput
              placeholder=""
              value={stoploss}
              onChange={(e) => setStoploss(e.target.value)}
            />
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Flag className="h-4 w-4" />} text="Target(s)" />
            <div className="space-y-2">
              {targets.map((t, i) => (
                <CurrencyInput
                  key={i}
                  placeholder=""
                  value={t}
                  onChange={(e) => updateTarget(i, e.target.value)}
                />
              ))}
              <button
                className="text-sm text-[#667085] hover:text-[#475467] inline-flex items-center gap-2"
                onClick={addTarget}
                type="button"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#e4e7ec] bg-white">
                  +
                </span>
                Add target
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e4e7ec] bg-[#0b1220] bg-opacity-[0.04] px-4 py-4">
          <div className="mx-2 flex items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-2 py-2">
            <button
              type="button"
              onClick={handoffToRecipients}
              className="flex flex-1 items-center gap-2 rounded-md px-2 text-left"
            >
              <UsersRound className="ml-1 h-4 w-4 text-[#98a2b3]" />
              <span className="text-sm text-[#98a2b3]">Select recipients</span>
            </button>
            <Button
              type="button"
              onClick={onSend}
              className="h-10 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FieldLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[#344054] font-medium">
      <span className="text-[#667085]">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function RadioItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem id={value} value={value} />
      <Label htmlFor={value} className="text-sm text-[#475467]">
        {label}
      </Label>
    </div>
  )
}

function CurrencyInput(
  props: React.ComponentProps<typeof Input> & { disabled?: boolean },
) {
  const { className, disabled, ...rest } = props
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
        {'₹'}
      </span>
      <Input
        {...rest}
        disabled={disabled}
        className={`h-10 pl-8 rounded-md border-[#e4e7ec] placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
      />
    </div>
  )
}
