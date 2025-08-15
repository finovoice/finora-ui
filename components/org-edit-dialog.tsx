"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UploadCloud, Trash2 } from "lucide-react"
import { useState } from "react"

export type OrgDetails = {
  name: string
  license: string
  address: string
  email: string
  website: string
  phone: string
  gstin?: string
  logoUrl?: string | null
  signFileName?: string | null
}

export default function OrgEditDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: OrgDetails
  onSave?: (data: OrgDetails) => void
}) {
  const [form, setForm] = useState<OrgDetails>(initial)

  // Keep form in sync if dialog is reopened with different initial values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // @ts-ignore
  if (open && (form as any).__initialKey !== JSON.stringify(initial)) {
    const next = { ...initial } as any
    next.__initialKey = JSON.stringify(initial)
    // @ts-ignore
    setForm(next)
  }

  function update<K extends keyof OrgDetails>(key: K, value: OrgDetails[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Organisation details</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="org-name">Org name <span className="text-red-500">*</span></Label>
              <Input id="org-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter organisation name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-license">SEBI Registered License Number <span className="text-red-500">*</span></Label>
              <Input id="org-license" value={form.license} onChange={(e) => update("license", e.target.value)} placeholder="abcd123456f" />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="org-email">Registered Email <span className="text-red-500">*</span></Label>
              <Input id="org-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="xyz@company.com" />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="org-website">Website <span className="text-red-500">*</span></Label>
              <Input id="org-website" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="companyname.com" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="org-address">Registered address <span className="text-red-500">*</span></Label>
              <Input id="org-address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="X street, Y building, Z City, State, Country - pincode" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-phone">Registered phone <span className="text-red-500">*</span></Label>
              <Input id="org-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91-9876543210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-gst">GSTIN number</Label>
              <Input id="org-gst" value={form.gstin ?? ""} onChange={(e) => update("gstin", e.target.value)} placeholder="Optional" />
            </div>
          </div>

          {/* Logo uploader */}
          <div className="mt-5 space-y-2">
            <Label>Logo <span className="text-red-500">*</span></Label>
            <div className="rounded-lg border border-[#e4e7ec] bg-[#fcfcfd]">
              <div className="flex items-center justify-center text-center px-6 py-8 text-sm text-[#6941c6]">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-[#f2f4f7] flex items-center justify-center">
                    <UploadCloud className="h-5 w-5 text-[#98a2b3]" />
                  </div>
                  <div>
                    <button className="text-[#6941c6]">Click to upload</button> <span className="text-[#98a2b3]">or drag and drop</span>
                  </div>
                  <div className="text-[#98a2b3]">SVG, PNG or JPG (max. 400x400px)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign file row */}
          <div className="mt-5 space-y-2">
            <Label>Sign</Label>
            <div className="rounded-lg border border-[#e4e7ec] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-[#f2f4f7] text-[10px] flex items-center justify-center text-[#667085] font-semibold">JPG</div>
                <div className="leading-tight">
                  <div className="text-sm text-[#101828]">{form.signFileName || "Sign.jpg"}</div>
                  <div className="text-xs text-[#98a2b3]">200 KB</div>
                </div>
              </div>
              <button className="rounded-md p-1.5 hover:bg-[#f2f4f7]" aria-label="remove sign">
                <Trash2 className="h-4 w-4 text-[#667085]" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-[#7f56d9] hover:bg-[#6941c6]" onClick={() => onSave?.(form)}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
