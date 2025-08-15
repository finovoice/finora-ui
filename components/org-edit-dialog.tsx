"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileUpload from "./file-upload"
import { useState } from "react"
import type { Organisation, OrganisationUpdateRequest } from "@/services/settings"
import { uploadFileAPI } from "@/services/upload"

export default function OrgEditDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: Organisation
  onSave?: (data: OrganisationUpdateRequest) => void
}) {
  const [form, setForm] = useState<OrganisationUpdateRequest>(() => ({
    name: initial.name,
    owner_name: initial.owner_name,
    whatsapp_number: initial.whatsapp_number,
    logo_url: initial.logo_url,
    signature_url: initial.signature_url,
  }))
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingSign, setUploadingSign] = useState(false)

  // Keep form in sync if dialog is reopened with different initial values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // @ts-ignore
  if (open && (form as any).__initialKey !== JSON.stringify({
    name: initial.name,
    owner_name: initial.owner_name,
    whatsapp_number: initial.whatsapp_number,
    logo_url: initial.logo_url,
    signature_url: initial.signature_url,
  })) {
    const next: any = {
      name: initial.name,
      owner_name: initial.owner_name,
      whatsapp_number: initial.whatsapp_number,
      logo_url: initial.logo_url,
      signature_url: initial.signature_url,
    }
    next.__initialKey = JSON.stringify(next)
    setForm(next)
  }

  function update<K extends keyof OrganisationUpdateRequest>(key: K, value: OrganisationUpdateRequest[K]) {
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
              <Input id="org-name" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} placeholder="Enter organisation name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-owner">Owner name <span className="text-red-500">*</span></Label>
              <Input id="org-owner" value={form.owner_name ?? ""} onChange={(e) => update("owner_name", e.target.value)} placeholder="Owner name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-whatsapp">WhatsApp number <span className="text-red-500">*</span></Label>
              <Input id="org-whatsapp" value={form.whatsapp_number ?? ""} onChange={(e) => update("whatsapp_number", e.target.value)} placeholder="e.g. +91-9876543210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-license">SEBI Registered License Number</Label>
              <Input id="org-license" value={initial.license_number} disabled />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="org-address">Registered address</Label>
              <Input id="org-address" value={initial.address} disabled />
            </div>
          </div>

          {/* Logo uploader */}
          <div className="mt-5">
            <FileUpload
              label="Logo"
              required
              accept="image/*"
              dimensions="max. 400x400px"
              maxSize="2MB"
              value={form.logo_url ?? null}
              fileName={form.logo_url ? form.logo_url.split('/').pop() || 'logo.png' : null}
              onFileSelect={async (file) => {
                try {
                  setUploadingLogo(true)
                  const res = await uploadFileAPI(file, "org_logo")
                  update("logo_url", res.url)
                } finally {
                  setUploadingLogo(false)
                }
              }}
              onFileDelete={() => update("logo_url", null)}
              showPreview
            />
            {uploadingLogo && <div className="text-xs text-[#667085] mt-2">Uploading logo...</div>}
          </div>

          {/* Sign file row */}
          <div className="mt-5">
            <FileUpload
              label="Sign"
              accept="image/*,.pdf"
              dimensions="recommended 200x100px"
              maxSize="1MB"
              value={form.signature_url ?? null}
              fileName={form.signature_url ? form.signature_url.split('/').pop() || 'sign' : null}
              onFileSelect={async (file) => {
                try {
                  setUploadingSign(true)
                  const res = await uploadFileAPI(file, "org_signature")
                  update("signature_url", res.url)
                } finally {
                  setUploadingSign(false)
                }
              }}
              onFileDelete={() => update("signature_url", null)}
              showPreview={false}
            />
            {uploadingSign && <div className="text-xs text-[#667085] mt-2">Uploading sign...</div>}
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
