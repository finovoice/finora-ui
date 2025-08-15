"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type Employee = {
  id?: string
  firstName: string
  lastName: string
  email: string
  role: "Relationship Manager" | "Research Analyst"
  status?: { label: string; color: string; bg: string; border: string }
  lastLogin?: string
}

export default function EmployeeDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Employee | null
  onSave?: (data: Employee) => void
}) {
  const [form, setForm] = useState<Employee>(
    initial ?? {
      firstName: "",
      lastName: "",
      email: "",
      role: "Relationship Manager",
    },
  )

  // keep in sync with initial when dialog is reopened
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // @ts-ignore
  if (open && (form as any).__initialKey !== JSON.stringify(initial ?? {})) {
    const next = { ...(initial ?? { firstName: "", lastName: "", email: "", role: "Relationship Manager" }) } as any
    next.__initialKey = JSON.stringify(initial ?? {})
    // @ts-ignore
    setForm(next)
  }

  const isValid =
    form.firstName.trim() && form.lastName.trim() && /.+@.+\..+/.test(form.email.trim()) && form.role

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{initial ? "Edit team member" : "Invite a team member"}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="emp-fn">First name <span className="text-red-500">*</span></Label>
              <Input id="emp-fn" placeholder="First name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-ln">Last name <span className="text-red-500">*</span></Label>
              <Input id="emp-ln" placeholder="First name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="emp-email">Email <span className="text-red-500">*</span></Label>
              <Input id="emp-email" type="email" placeholder="First name" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role <span className="text-red-500">*</span></Label>
            <div className="space-y-3">
              {[
                { key: "Relationship Manager", desc: "Provides customer service to assigned clients and leads" },
                { key: "Research Analyst", desc: "Sends trades and rationale to clients" },
              ].map((r) => (
                <label key={r.key} className="flex items-center gap-3 rounded-lg border border-[#e4e7ec] px-3 py-3">
                  <input
                    type="radio"
                    name="role"
                    className="h-4 w-4"
                    checked={form.role === (r.key as Employee["role"])}
                    onChange={() => setForm((p) => ({ ...p, role: r.key as Employee["role"] }))}
                  />
                  <div className="flex flex-col">
                    <span className="text-[#344054] text-sm">{r.key}</span>
                    <span className="text-[#667085] text-xs">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="w-full bg-[#7f56d9] hover:bg-[#6941c6] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={() => {
                if (!isValid) return
                const cleaned: Employee = {
                  ...(form.id ? { id: form.id } : {}),
                  firstName: form.firstName.trim(),
                  lastName: form.lastName.trim(),
                  email: form.email.trim(),
                  role: form.role,
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
