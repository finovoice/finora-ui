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
import { createTradeAPI, partialUpdateTradeAPI } from "@/services/trades"
import { showToast } from './ui/toast-manager';
import Error from "next/error"



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
  const [blankStoplossWarning, setBlankStoplossWarning] = useState<boolean>(false)
  const [blankTargetWarning, setBlankTargetWarning] = useState<boolean>(false)
  const [targets, setTargets] = useState<string[]>(initial.targets?.length ? initial.targets : [""])
  const [sending, setSending] = useState(false)

  // Sync when a different trade is opened
  useEffect(() => {
    setOrder(initial.side)
    setHorizon(initial.horizon)
    setEntryMin(initial.entryMin ?? "")
    setEntryMax(initial.entryMax ?? "")
    setUseRange(!!initial.useRange)
    setStoploss(initial.stoploss ?? "")
    setTargets(initial.targets?.length ? initial.targets : [""])
    setBlankStoplossWarning(false)
    setBlankTargetWarning(false)
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

  async function handleSubmit() {
    const cleanedTargets = targets.map(t => t.trim()).filter(Boolean)

    setBlankStoplossWarning(!stoploss);
    setBlankTargetWarning(cleanedTargets.length === 0)

    if (!stoploss || cleanedTargets.length === 0) {
      console.warn("Please fill all required fields: stoploss, at least one target")
      showToast({
        title: 'Warning',
        description: "Please fill all required fields: stoploss, at least one target",
        type: 'warning',
        duration: 3000
      })
      return
    }
    setSending(true)
    const updatedPayload: EditableTrade = {
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
    try {
      const response = await partialUpdateTradeAPI(updatedPayload as EditableTrade, trade?.id)
      showToast({
        title: 'Success',
        description: "Successfully edited the Trade",
        type: 'success',
        duration: 3000
      })
    } catch (e) {
      console.warn(e)
      showToast({
        title: 'Error',
        description: 'An error has occured',
        type: 'error',
        duration: 3000
      })
    } finally {
      setSending(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-3">
          <DialogTitle className="text-sm text-[#101828]">Edit trade</DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4 space-y-3">
          {/* Order */}
          <Row>
            <FieldLabel icon={<Bike className="h-4 w-4" />} text="Order" />
            <RadioGroup
              className="flex gap-6 text-sm"
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
            <FieldLabel icon={<Layers3 className="h-4 w-4 text-gray-400" />} lock text="Scrip" />
            <Input
              value={initial.scrip}
              readOnly
              className="h-8 rounded-md border-[#e4e7ec] bg-[#f9fafb] text-gray-400"
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

          {/* Entry (locked) */}
          <Row>
            <FieldLabel icon={<Clock3 className="h-4 w-4 rotate-180 text-gray-400" />} lock text="Entry" />
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CurrencyInput
                  placeholder="Min"
                  value={entryMin}
                  disabled />
                <CurrencyInput
                  placeholder="Max"
                  value={entryMax}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2 self-end">
                <Switch id="range-edit" checked={false} />
                <Label htmlFor="range-edit" className="text-sm text-gray-400">
                  Range
                </Label>
              </div>
            </div>
          </Row>

          {/* Stoploss */}
          <Row>
            <FieldLabel icon={<Ban className="h-4 w-4" />} text="Stoploss" />
            <CurrencyInput blankInputWarning={blankStoplossWarning} placeholder="" value={stoploss} onChange={(e) => setStoploss(e.target.value)} />
          </Row>

          {/* Targets */}
          <Row>
            <FieldLabel icon={<Flag className="h-4 w-4" />} text="Target(s)" />
            <div className="space-y-2">
              {targets.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CurrencyInput
                    blankInputWarning={blankTargetWarning}
                    placeholder=""
                    value={t}
                    onChange={(e) => updateTarget(i, e.target.value)}
                    className="flex-1"
                  />
                  {targets.length > 1 ?
                    <button
                      type="button"
                      onClick={() => removeTarget(i)}
                      aria-label="Remove target"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md  text-[#667085] hover:bg-[#f2f4f7]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    : ''}
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
              disabled={sending}
              className="h-10 w-full justify-center gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]"
            >
              <span>{sending ? "Sending..." : "Send Update"}</span>
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

function FieldLabel({ icon, text, lock = false }: { icon: React.ReactNode; text: string, lock?: boolean }) {
  return (
    <div className={`flex items-center gap-2  text-sm ${lock ? 'text-gray-400' : ''}`}>
      <span className="text-[#667085]">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function RadioItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem id={`edit-${value}`} value={value} />
      <Label htmlFor={`edit-${value}`} className="text-xs text-[#475467]">
        {label}
      </Label>
    </div>
  )
}

function CurrencyInput(props: React.ComponentProps<typeof Input> & { disabled?: boolean; blankInputWarning?: boolean }) {
  const { className, disabled, blankInputWarning = false, ...rest } = props
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">{"₹"}</span>
      <Input
        type="number"
        {...rest}
        disabled={disabled}
        className={`h-8 pl-8 rounded-md ${blankInputWarning ? 'border-red-500' : 'border-[#e4e7ec]'} placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
      />
    </div>
  )
}
