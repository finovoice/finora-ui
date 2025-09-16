"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import ToolbarBtn from "./ToolbarBtn"
import { Bold, Heading, Italic, List, ListOrdered, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLeadDrawer } from "@/contexts/LeadDrawerContext"

export default function DetailsTab() {
  const {
    disposition,
    setDisposition,
    text,
    setText,
    sending,
    plan,
    client,
    stage,
    handleEditClientSubmit,
  } = useLeadDrawer()

  const dispositionOptions = [
    { value: "HOT", label: "Hot", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
    { value: "WARM", label: "Warm", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
    { value: "COLD", label: "Cold", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
    { value: "NEUTRAL", label: "Neutral", bgColor: "bg-gray-50", textColor: "text-gray-700", borderColor: "border-gray-200" },
    { value: "DND", label: "DND", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" }
  ]

  const isSaveDisabled = sending || (disposition == '' && plan == '' && client?.lead_stage == stage && text == '')

  return (
    <div className="space-y-5 px-5 py-5 h-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm text-[#344054]">Lead disposition</Label>
          <div className="flex flex-wrap gap-2">
            {dispositionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDisposition(option.value)}
                className={`h-8 px-3 text-xs border rounded-md transition-all ${
                  disposition === option.value
                    ? `${option.bgColor} ${option.textColor} ${option.borderColor}`
                    : "border-[#e4e7ec] bg-white text-[#344054] hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-[#344054]">Notepad</Label>
        </div>
        <div className="rounded-lg border border-[#e4e7ec]">
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Start typing"
            className="w-full h-[200px] resize-none rounded-t-lg border-0 bg-[#f9fafb] p-3 text-sm text-[#101828] outline-none"
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
      <div className="flex justify-end mt-4">
        <Button onClick={handleEditClientSubmit} disabled={isSaveDisabled}>
          {sending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
