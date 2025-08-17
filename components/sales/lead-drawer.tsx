"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Phone, Mail, PencilLine, Bold, Italic, Heading, Quote, List, ListOrdered } from 'lucide-react'
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"

export type Lead = {
  name: string
  phone?: string
  email?: string
  stage?: "Lead" | "Contacted" | "Onboarding" | "Awaiting payment"
}

export default function LeadDrawer({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
}) {
  const [tab, setTab] = React.useState("details")
  const [stage, setStage] = React.useState<Lead["stage"]>(lead?.stage ?? "Lead")
  const [disposition, setDisposition] = React.useState<string>("")
  const [plan, setPlan] = React.useState<string>("")
  // Onboard tab state
  const [contractUrl, setContractUrl] = React.useState<string | null>(null)
  const [contractName, setContractName] = React.useState<string | null>(null)
  const [riskProfile, setRiskProfile] = React.useState<string>("")
  const [pan, setPan] = React.useState<string>("")
  const [amount, setAmount] = React.useState<string>("")
  const [renewal, setRenewal] = React.useState<"weekly" | "monthly" | "quarterly">("monthly")

  React.useEffect(() => {
    // Reset when a different lead opens
    setTab("details")
    setStage(lead?.stage ?? "Lead")
    setDisposition("")
    setPlan("")
    setContractUrl(null)
    setContractName(null)
    setRiskProfile("")
    setPan("")
    setAmount("")
    setRenewal("monthly")
  }, [lead?.name, open, lead?.stage])

  // If user sets stage to Onboarding, auto-focus the Onboard tab
  React.useEffect(() => {
    if (stage === "Onboarding") {
      setTab("onboard")
    }
  }, [stage])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e7ec] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate text-[18px] font-semibold text-[#101828]">
                {lead?.name ?? "Liam Anderson"}
              </SheetTitle>
              <button className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]" aria-label="Edit name">
                <PencilLine className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#98a2b3]" />
                <span>{lead?.phone ?? "+91-9876543210"}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#98a2b3]" />
                <span className="truncate">{lead?.email ?? "liam.anderson@email.com"}</span>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <Label className="mb-1 block text-xs text-[#667085]">Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as Lead["stage"])}>
              <SelectTrigger className="w-[200px] h-9 rounded-md border-[#e4e7ec]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Awaiting payment">Awaiting payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs with content */}
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-[#e4e7ec] px-5 pt-2">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="chat" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Chat</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Details</TabsTrigger>
              <TabsTrigger value="onboard" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Onboard</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto">

          {/* Chat */}
          <TabsContent value="chat" className="px-5 py-5">
            <div className="text-sm text-[#667085]">Chat coming soon.</div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="space-y-5 px-5 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-[#344054]">Lead disposition</Label>
                <Select value={disposition} onValueChange={setDisposition}>
                  <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]"><SelectValue placeholder="Select one" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                    <SelectItem value="follow-up">Follow up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#344054]">Plan interested</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]"><SelectValue placeholder="Select one" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notepad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#344054]">Notepad</Label>
              </div>
              <div className="rounded-lg border border-[#e4e7ec]">
                <textarea
                  placeholder="Start typing"
                  className="h-[320px] w-full resize-none rounded-t-lg border-0 bg-[#f9fafb] p-3 text-sm text-[#101828] outline-none"
                />
                <div className="flex items-center gap-3 border-t border-[#e4e7ec] bg-[#f9fafb] px-3 py-2 text-[#667085]">
                  <ToolbarBtn icon={<Bold className="h-4 w-4" />} label="Bold" />
                  <ToolbarBtn icon={<Italic className="h-4 w-4" />} label="Italic" />
                  <ToolbarBtn icon={<Heading className="h-4 w-4" />} label="Heading" />
                  <ToolbarBtn icon={<Quote className="h-4 w-4" />} label="Quote" />
                  <ToolbarBtn icon={<List className="h-4 w-4" />} label="Bulleted list" />
                  <ToolbarBtn icon={<ListOrdered className="h-4 w-4" />} label="Numbered list" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Onboard */}
          <TabsContent value="onboard" className="space-y-6 px-5 py-5">
            {/* Contract signing */}
            <div>
              <div className="mb-2 text-sm font-medium text-[#344054]">Contract signing <span className="text-red-500">*</span></div>
              <div className="rounded-lg border border-[#e4e7ec] p-4 bg-[#fcfcfd]">
                <FileUpload
                  label=""
                  required
                  accept="application/pdf"
                  maxSize="20MB"
                  value={contractUrl}
                  fileName={contractName ?? undefined}
                  fileSize=""
                  showPreview={false}
                  onFileSelect={(file) => {
                    setContractName(file.name)
                    // For preview-less PDFs, we just store a temporary object URL
                    const url = URL.createObjectURL(file)
                    setContractUrl(url)
                  }}
                  onFileDelete={() => {
                    setContractUrl(null)
                    setContractName(null)
                  }}
                  placeholder="Click to upload or drag and drop drafted contract (PDF not greater than 20 MB)"
                />
                <div className="mt-2 text-xs text-[#98a2b3]">PDF not greater than 20 MB</div>
              </div>
            </div>

            {/* Plan details */}
            <div className="rounded-lg border border-[#e4e7ec] p-4">
              <div className="mb-3 text-sm font-medium text-[#344054]">Plan details</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#344054]">Selected plan <span className="text-red-500">*</span></Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]"><SelectValue placeholder="Elite" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#344054]">Risk profile <span className="text-red-500">*</span></Label>
                  <Select value={riskProfile} onValueChange={setRiskProfile}>
                    <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#344054]">PAN <span className="text-red-500">*</span></Label>
                  <Input value={pan} onChange={(e)=>setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" className="h-10 rounded-md border-[#e4e7ec]" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-lg border border-[#e4e7ec] p-4">
              <div className="mb-3 text-sm font-medium text-[#344054]">Payment</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#344054]">Amount received <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]">₹</span>
                    <Input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="" className="h-10 rounded-md border-[#e4e7ec] pl-7" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#344054]">Renewal frequency <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={renewal==='weekly'? 'default' : 'outline'} onClick={()=>setRenewal('weekly')}>Weekly</Button>
                    <Button type="button" variant={renewal==='monthly'? 'default' : 'outline'} onClick={()=>setRenewal('monthly')}>Monthly</Button>
                    <Button type="button" variant={renewal==='quarterly'? 'default' : 'outline'} onClick={()=>setRenewal('quarterly')}>Quarterly</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e4e7ec] pt-4">
              <Button className="w-full" disabled>
                Add to clients
              </Button>
            </div>
          </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-md p-1.5 hover:bg-[#eef2f6]"
    >
      {icon}
    </button>
  )
}
