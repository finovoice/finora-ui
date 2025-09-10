"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [isDispositionSelectOpen, setIsDispositionSelectOpen] = React.useState(false)

  const isSaveDisabled = sending || (disposition == '' && plan == '' && client?.lead_stage == stage && text == '')

  return (
    <div className="space-y-5 px-5 py-5 h-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm text-[#344054]">Lead disposition</Label>
          <Select open={isDispositionSelectOpen} onOpenChange={setIsDispositionSelectOpen} value={disposition} onValueChange={setDisposition}>
            <SelectTrigger className="h-10 w-full rounded-md border-[#e4e7ec]"><SelectValue placeholder="Select one" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HOT">Hot</SelectItem>
              <SelectItem value="WARM">Warm</SelectItem>
              <SelectItem value="COLD">Cold</SelectItem>
              <SelectItem value="NEUTRAL">Neutral</SelectItem>
              <SelectItem value="DND">DND</SelectItem>
            </SelectContent>
          </Select>
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
