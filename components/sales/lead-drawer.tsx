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
import { Phone, Mail, PencilLine, Bold, Italic, Heading, Quote, List, ListOrdered, ChevronDown } from 'lucide-react'

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

  React.useEffect(() => {
    // Reset when a different lead opens
    setTab("details")
    setStage(lead?.stage ?? "Lead")
    setDisposition("")
    setPlan("")
  }, [lead?.name, open, lead?.stage])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0">
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

        {/* Tabs */}
        <div className="border-b border-[#e4e7ec] px-5 pt-2">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="chat" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">
                Chat
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">
                Details
              </TabsTrigger>
              <TabsTrigger value="onboard" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">
                Onboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Details content (active by default) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-[#344054]">Lead disposition</Label>
              <Select value={disposition} onValueChange={setDisposition}>
                <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
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
                <SelectTrigger className="h-10 rounded-md border-[#e4e7ec]">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
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
        </div>
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
