"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type RenewalKey = "WEEKLY" | "MONTHLY" | "QUARTERLY"

export type PlanDetails = {
  id?: string
  name: string
  prices: Partial<Record<RenewalKey, number>>
}

function CurrencyInput(props: React.ComponentProps<typeof Input>) {
  const { className, ...rest } = props
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">₹</span>
      <Input type="number" step="1" min="0" {...rest} className={`pl-8 ${className ?? ""}`} />
    </div>
  )
}

export default function PlanDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: PlanDetails | null
  onSave?: (data: PlanDetails) => void
}) {
  const [form, setForm] = useState<PlanDetails>(initial ?? { name: "", prices: {} })

  // keep in sync when opening with a different initial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // @ts-ignore
  if (open && (form as any).__initialKey !== JSON.stringify(initial ?? {})) {
    const next = { ...(initial ?? { name: "", prices: {} }) } as any
    next.__initialKey = JSON.stringify(initial ?? {})
    // @ts-ignore
    setForm(next)
  }

  const renewals: { key: RenewalKey; label: string }[] = [
    { key: "WEEKLY", label: "Weekly" },
    { key: "MONTHLY", label: "Monthly" },
    { key: "QUARTERLY", label: "Quarterly" },
  ]

  function toggleRenewal(key: RenewalKey, checked: boolean) {
    setForm((prev) => {
      const prices = { ...(prev.prices || {}) }
      if (!checked) {
        delete prices[key]
      } else if (prices[key] == null) {
        prices[key] = 0
      }
      return { ...prev, prices }
    })
  }

  function setPrice(key: RenewalKey, value: string) {
    const num = value === "" ? undefined : Number(value)
    setForm((prev) => ({
      ...prev,
      prices: { ...prev.prices, [key]: num as any },
    }))
  }

  const selectedCount = Object.values(form.prices || {}).filter((v) => v !== undefined).length
  const hasBlankPrice = Object.entries(form.prices || {}).some(([, v]) => v === undefined || (typeof v === "number" && isNaN(v)))
  const isValid = form.name.trim().length > 0 && selectedCount > 0 && !hasBlankPrice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{initial ? "Edit plan" : "Add plan"}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Plan name <span className="text-red-500">*</span></Label>
            <Input
              id="plan-name"
              placeholder="First name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Allowed renewal periods <span className="text-red-500">*</span></Label>
            <div className="space-y-3">
              {renewals.map(({ key, label }) => {
                const checked = form.prices[key] !== undefined
                const value = form.prices[key]
                return (
                  <div key={key} className="grid grid-cols-[28px_1fr_240px] items-center gap-3">
                    <input
                      id={`chk-${key}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#e4e7ec]"
                      checked={checked}
                      onChange={(e) => toggleRenewal(key, e.target.checked)}
                    />
                    <Label htmlFor={`chk-${key}`} className="text-sm text-[#475467]">
                      {label}
                    </Label>
                    <CurrencyInput
                      placeholder="Price"
                      value={checked && value !== undefined ? String(value) : ""}
                      onChange={(e) => setPrice(key, e.target.value)}
                      disabled={!checked}
                      className="h-10"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="w-full bg-[#7f56d9] hover:bg-[#6941c6] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={() => {
                if (!isValid) return
                // Clean undefined prices
                const cleaned: PlanDetails = {
                  ...(form.id ? { id: form.id } : {}),
                  name: form.name.trim(),
                  prices: Object.fromEntries(
                    Object.entries(form.prices || {}).filter(([, v]) => v !== undefined)
                  ) as any,
                }
                onSave?.(cleaned)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
