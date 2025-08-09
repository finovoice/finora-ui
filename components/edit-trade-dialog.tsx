"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Ban, Bike, Clock3, Flag, Layers3, Send, X } from "lucide-react"

export type EditableTrade = {
  id?: string
  side: "BUY" | "SELL" | "HOLD"
  scrip: string
  horizon: "INTRADAY" | "SWING" | "LONGTERM"
  entryMin?: string
  entryMax?: string
  useRange?: boolean
  stoploss?: string
  targets?: string[]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trade?: EditableTrade | null
  onSubmit?: (updated: EditableTrade) => void
}

export default function EditTradeDialog({ open, onOpenChange, trade, onSubmit }: Props) {
  const initial = useMemo<EditableTrade>(() => {
    return (
      trade ?? {
        side: "BUY",
        scrip: "",
        horizon: "INTRADAY",
        entryMin: "",
        entryMax: "",
        useRange: false,
        stoploss: "",
        targets: [""],
      }
    )
  }, [trade])

  const [order, setOrder] = useState<"BUY" | "SELL" | "HOLD">(initial.side)
  const [horizon, setHorizon] = useState<"INTRADAY" | "SWING" | "LONGTERM">(initial.horizon)
  const [entryMin, setEntryMin] = useState<string>(initial.entryMin ?? "")
  const [entryMax, setEntryMax] = useState<string>(initial.entryMax ?? "")
  const [useRange, setUseRange] = useState<boolean>(!!initial.useRange)
  const [stoploss, setStoploss] = useState<string>(initial.stoploss ?? "")
  const [targets, setTargets] = useState<string[]>(initial.targets?.length ? initial.targets : [""])

  // Sync when a different trade is opened
  useEffect(() => {
    setOrder(initial.side)
    setHorizon(initial.horizon)
    setEntryMin(initial.entryMin ?? "")
    setEntryMax(initial.entryMax ?? "")
    setUseRange(!!initial.useRange)
    setStoploss(initial.stoploss ?? "")
    setTargets(initial.targets?.length ? initial.targets : [""])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id, open])

  function updateTarget(idx: number, val: string) {
    setTargets((t) => t.map((v, i) => (i === idx ? val : v)))
  }
  function addTarget() {
    setTargets((t) => [...t, ""])
  }
  function removeTarget(idx: number) {
    setTargets((t) => t.filter((_, i) => i !== idx))
  }

  function handleSubmit() {
    const updated: EditableTrade = {
      id: trade?.id,
      side: order,
      scrip: initial.scrip,
      horizon,
      entryMin,
      entryMax: useRange ? entryMax : undefined,
      useRange,
      stoploss,
      targets,
    }
    onSubmit?.(updated)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4">
          <DialogTitle className="text-xl text-[#101828]">Edit trade</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Order */}
          <Row>
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
          </Row>

          {/* Scrip (locked) */}
          <Row>
            <FieldLabel icon={<Layers3 className="h-4 w-4" />} text="Scrip" />
            <Input
              value={initial.scrip}
              readOnly
              className="h-10 rounded-md border-[#e4e7ec] bg-[#f9fafb] text-[#475467]"
            />
          </Row>

          {/* Horizon */}
          <Row>
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
          </Row>

          {/* Entry */}
          <Row>
            <FieldLabel icon={<Clock3 className="h-4 w-4 rotate-180" />} text="Entry" />
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CurrencyInput placeholder="Min" value={entryMin} onChange={(e) => setEntryMin(e.target.value)} />
                <CurrencyInput
                  placeholder="Max"
                  value={entryMax}
                  onChange={(e) => setEntryMax(e.target.value)}
                  disabled={!useRange}
                />
              </div>
              <div className="flex items-center gap-2 self-end">
                <Switch id="range-edit" checked={useRange} onCheckedChange={setUseRange} />
                <Label htmlFor="range-edit" className="text-sm text-[#667085]">
                  Range
                </Label>
              </div>
            </div>
          </Row>

          {/* Stoploss */}
          <Row>
            <FieldLabel icon={<Ban className="h-4 w-4" />} text="Stoploss" />
            <CurrencyInput placeholder="" value={stoploss} onChange={(e) => setStoploss(e.target.value)} />
          </Row>

          {/* Targets */}
          <Row>
            <FieldLabel icon={<Flag className="h-4 w-4" />} text="Target(s)" />
            <div className="space-y-2">
              {targets.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CurrencyInput
                    placeholder=""
                    value={t}
                    onChange={(e) => updateTarget(i, e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeTarget(i)}
                    aria-label="Remove target"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#e4e7ec] text-[#667085] hover:bg-[#f2f4f7]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
          </Row>
        </div>

        {/* Footer (no recipients) */}
        <div className="border-t border-[#e4e7ec] px-4 py-4">
          <div className="mx-2">
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-10 w-full justify-center gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]"
            >
              <span>Send update</span>
              <Send className="h-4 w-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-[#667085]">Update will be sent to the same clients</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 items-start sm:grid-cols-[140px_1fr]">{children}</div>
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
      <RadioGroupItem id={`edit-${value}`} value={value} />
      <Label htmlFor={`edit-${value}`} className="text-sm text-[#475467]">
        {label}
      </Label>
    </div>
  )
}

function CurrencyInput(props: React.ComponentProps<typeof Input> & { disabled?: boolean }) {
  const { className, disabled, ...rest } = props
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">{"₹"}</span>
      <Input
        {...rest}
        disabled={disabled}
        className={`h-10 pl-8 rounded-md border-[#e4e7ec] placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
      />
    </div>
  )
}
