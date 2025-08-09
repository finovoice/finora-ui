"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

// Types
export type Plan = "Elite" | "Lite"
export type Period = "Monthly" | "Quarterly" | "Yearly"

export type PlanDetails = {
  plan: Plan
  amount: number
  period: Period
}

export type PlanDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: PlanDetails
  onConfirm?: (details: PlanDetails) => void
}

export default function PlanDetailsModal({ open, onOpenChange, initial = { plan: "Elite", amount: 1500, period: "Monthly" }, onConfirm }: PlanDetailsModalProps) {
  const [mode, setMode] = React.useState<"summary" | "edit">("summary")
  const [form, setForm] = React.useState<PlanDetails>(initial)

  React.useEffect(() => {
    if (open) {
      // reset to summary each time opened
      setMode("summary")
      setForm(initial)
    }
  }, [open])

  function handleConfirm() {
    onConfirm?.(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4">
          <DialogTitle className="text-2xl font-semibold text-[#101828]">Plan details</DialogTitle>
        </DialogHeader>

        {mode === "summary" ? (
          <SummaryView details={form} onConfirm={handleConfirm} onEdit={() => setMode("edit")} />
        ) : (
          <EditView value={form} onChange={setForm} onConfirm={handleConfirm} onBack={() => setMode("summary")} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function SummaryView({ details, onConfirm, onEdit }: { details: PlanDetails; onConfirm: () => void; onEdit: () => void }) {
  return (
    <div className="px-6 py-6">
      <div className="rounded-2xl bg-[#f9fafb] p-5 border border-[#eef2f7]">
        <dl className="space-y-5">
          <div>
            <dt className="text-sm text-[#667085]">Chosen plan</dt>
            <dd className="mt-1 text-xl font-semibold text-[#344054]">{details.plan}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#667085]">Amount paid</dt>
            <dd className="mt-1 text-xl font-semibold text-[#344054]">₹ {details.amount.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#667085]">Renewal duration</dt>
            <dd className="mt-1 text-xl font-semibold text-[#344054]">{details.period}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-3">
        <Button className="w-full h-11 bg-[#7f56d9] hover:bg-[#6941c6] text-white" onClick={onConfirm}>Confirm</Button>
        <button className="w-full h-11 rounded-md border border-[#e4e7ec] bg-white text-[#344054]" onClick={onEdit}>Edit</button>
      </div>
    </div>
  )
}

function EditView({ value, onChange, onConfirm, onBack }: { value: PlanDetails; onChange: (v: PlanDetails) => void; onConfirm: () => void; onBack: () => void }) {
  function set<K extends keyof PlanDetails>(key: K, v: PlanDetails[K]) {
    onChange({ ...value, [key]: v })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onConfirm()
      }}
      className="px-6 py-6 space-y-5"
    >
      {/* Plan */}
      <LabeledField label="Plan" required>
        <SelectLike
          value={value.plan}
          options={["Elite", "Lite"]}
          onChange={(v) => set("plan", v as Plan)}
        />
      </LabeledField>

      {/* Amount */}
      <LabeledField label="Amount received" required>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">₹</span>
          <Input
            value={value.amount}
            onChange={(e) => set("amount", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
            className="h-11 pl-8 rounded-md border-[#e4e7ec]"
            inputMode="numeric"
            required
          />
        </div>
      </LabeledField>

      {/* Period */}
      <LabeledField label="Renewal period" required>
        <SelectLike
          value={value.period}
          options={["Monthly", "Quarterly", "Yearly"]}
          onChange={(v) => set("period", v as Period)}
        />
      </LabeledField>

      <div className="sticky bottom-0 -mx-6 border-t border-[#e4e7ec] bg-white px-6 py-4 space-y-3">
        <Button type="submit" className="w-full h-11 bg-[#7f56d9] hover:bg-[#6941c6] text-white">Confirm</Button>
        <button type="button" className="w-full h-11 rounded-md border border-[#e4e7ec] bg-white text-[#344054]" onClick={onBack}>Back</button>
      </div>
    </form>
  )
}

function LabeledField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-[#344054] text-sm">
        {label} {required && <span className="text-[#7f56d9]">*</span>}
      </Label>
      {children}
    </div>
  )
}

// Small, dependency-free select mimic using button + menu for visual parity with design
function SelectLike({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="h-11 w-full rounded-md border border-[#e4e7ec] bg-white px-3 text-left text-[#344054] flex items-center justify-between">
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-[#e4e7ec] bg-white shadow-sm">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm ${opt === value ? "bg-[#f2f4f7]" : "hover:bg-[#f9fafb]"}`}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
