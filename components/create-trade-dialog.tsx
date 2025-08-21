"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Flag, Clock3, Ban, Bike, Layers3, Send, X } from 'lucide-react'
import ScripCombobox from "./scrip-combobox"
import { RecipientsSelect, type Recipient } from "./recipients-select"
import { createTradeAPI } from "@/services/trades"
import { createCohortAPI } from "@/services/trades"
import { showToast } from './ui/toast-manager'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSymbol?: string
}

export default function CreateTradeDialog({ open, onOpenChange, initialSymbol }: Props) {
  const [order, setOrder] = useState<"BUY" | "SELL" | "HOLD">("BUY")
  const [horizon, setHorizon] = useState<"INTRADAY" | "SWING" | "LONGTERM">("INTRADAY")
  const [scrip, setScrip] = useState<string | undefined>(initialSymbol)
  const [segment, setSegment] = useState<"EQUITY" | "F&O">("EQUITY")
  const [entryMin, setEntryMin] = useState<string>("")
  const [entryMax, setEntryMax] = useState<string>("")
  const [useRange, setUseRange] = useState<boolean>(false)
  const [stoploss, setStoploss] = useState<string>("")
  const [targets, setTargets] = useState<string[]>([""])
  const [blankScripWarning, setBlankScripWarning] = useState<boolean>(false)
  const [blankEntryWarning, setBlankEntryWarning] = useState<boolean>(false)
  const [blankStoplossWarning, setBlankStoplossWarning] = useState<boolean>(false)
  const [blankTargetWarning, setBlankTargetWarning] = useState<boolean>(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [sending, setSending] = useState<boolean>(false)
  const [toggleRecipientsMenu, setToggleRecipientsMenu] = useState(false)

  function updateTarget(idx: number, val: string) {
    setTargets((t) => t.map((v, i) => (i === idx ? val : v)))
  }

  function addTarget() {
    setTargets((t) => [...t, ""])
  }

  function removeTarget(index: number) {
    setTargets((t) => t.filter((_, i) => i !== index))
  }

  async function onSend() {
    const cleanedTargets = targets.map(t => t.trim()).filter(Boolean)

    setBlankScripWarning(!scrip);
    setBlankEntryWarning(!entryMin);
    setBlankStoplossWarning(!stoploss);
    setBlankTargetWarning(cleanedTargets.length === 0);

    if (!scrip || !entryMin || !stoploss || cleanedTargets.length === 0) {
      console.warn("Please fill all required fields: scrip, entry, stoploss, at least one target")
      showToast({
        title: 'Warning',
        description: 'Please fill all required fields: scrip, entry, stoploss, at least one target',
        type: 'warning',
        duration: 3000
      })
      return
    }
    if (order === "HOLD") {
      console.warn("Please select BUY or SELL")
      showToast({
        title: 'Warning',
        description: 'Please select BUY or SELL',
        type: 'warning',
        duration: 3000
      })
      return
    }

    const plans: string[] = [];
    const risk: string[] = [];

    // Iterate through the data array and populate the new arrays
    recipients.forEach(item => {
      if (item.group === 'plan') {
        plans.push(item.id);
      } else if (item.group === 'risk') {
        risk.push(item.id);
      }
    });

    setSending(true)
    let createdCohort;
    try {
      const cohortPayload: any = {
        name: "New Cohort name 2",
        description: "Cohort description",
        is_active: true,
        client_phone_numbers: [],
        risk_profiles: risk,
        plans: plans
      }
      createdCohort = await createCohortAPI(cohortPayload as any)

      const tradePayload: any = {
        stock_name: scrip,
        entry: entryMin,
        entry_display: useRange && entryMax ? `${entryMin}-${entryMax}` : entryMin,
        stoploss,
        targets: cleanedTargets,
        segment,
        timehorizon: horizon === "LONGTERM" ? "POSITIONAL" : horizon,
        order: order,
        status: "ACTIVE",
        is_active: true,
        cohort: createdCohort?.id
      }
      const response = await createTradeAPI(tradePayload as any)
      showToast({
        title: 'Success',
        description: 'Successfully created the Trade',
        type: 'success',
        duration: 3000
      })
      onOpenChange(false)
    } catch (e) {
      console.error("An error occurred during API calls: ", e)
      showToast({
        title: 'Error',
        description: `An error has occured`,
        type: 'error',
        duration: 3000
      })
    } finally {
      setSending(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-white border">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-3">
          <DialogTitle className="text-sm text-[#101828]">Create trade</DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4 space-y-3">
          {/* Order */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
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
          </div>

          {/* Scrip */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Layers3 className="h-4 w-4" />} text="Scrip" />
            <ScripCombobox
              value={scrip}
              onChange={setScrip}
              blankInputWarning={blankScripWarning}
              placeholder="Search" />
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
              <div className="flex flex-row sm:grid-cols-2 gap-3">
                <CurrencyInput
                  placeholder="Min"
                  value={entryMin}
                  blankInputWarning={blankEntryWarning}
                  onChange={(e) => setEntryMin(e.target.value)}
                />
                <CurrencyInput
                  placeholder="Max"
                  value={!useRange ? '' : entryMax}
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
            <span className="flex flex-col">
              <CurrencyInput
                placeholder=""
                blankInputWarning={blankStoplossWarning}
                value={stoploss}
                onChange={(e) => setStoploss(e.target.value)}
              />
            </span>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] items-start">
            <FieldLabel icon={<Flag className="h-4 w-4" />} text="Target(s)" />
            <div className="space-y-2">
              {targets.map((t, i) => (
                <span key={i} className="flex flex-row">
                  <CurrencyInput
                    blankInputWarning={blankTargetWarning}
                    key={i}
                    placeholder=""
                    value={t}
                    onChange={(e) => updateTarget(i, e.target.value)}
                  />
                  {targets.length > 1 ?
                    <button
                      className="flex items-center justify-center ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeTarget(i)}
                    >
                      <X className="font-semibold" size={15} />
                    </button> : ''
                  }
                </span>
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
        <div className="backgroud-transparent border-t border-[#e4e7ec] px-6 py-4">
          <div className="mx-2 flex items-center gap-3  bg-white px-2 py-2">
            <RecipientsSelect
              selected={recipients}
              onChange={setRecipients}
            />
            <Button
              type="button"
              onClick={onSend}
              disabled={sending || !recipients.length}
              className="h-10 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{sending ? "Sending..." : "Send"}</span>
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
    <div className="flex items-center gap-2 text-[#344054] text-sm">
      <span className="text-[#667085]">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function RadioItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem id={value} value={value} />
      <Label htmlFor={value} className="text-xs text-[#475467]">
        {label}
      </Label>
    </div>
  )
}

function CurrencyInput(
  props: React.ComponentProps<typeof Input> & { disabled?: boolean; blankInputWarning?: boolean },
) {
  const { className, disabled, blankInputWarning, ...rest } = props
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
        {'₹'}
      </span>
      <Input
        type="number"
        {...rest}
        disabled={disabled}
        className={`h-8 pl-8 w-[10vw] rounded-md placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0 ${blankInputWarning ? 'border-red-500' : 'border-[#e4e7ec]'} ${className ?? ""}`}
      />
    </div>
  )
}
