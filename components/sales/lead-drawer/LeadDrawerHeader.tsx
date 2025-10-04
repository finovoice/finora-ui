"use client";

import { SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, PencilLine, Phone } from "lucide-react";
import React from "react";
import { useLeadDrawer } from "@/contexts/LeadDrawerContext";

export default function LeadDrawerHeader({ onEdit }: { onEdit: () => void }) {
  const { client, stage, setStage } = useLeadDrawer();
  const [isStageSelectOpen, setIsStageSelectOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between border-b border-[#e4e7ec] px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <SheetTitle className="truncate max-w-[220px] text-[18px] font-semibold text-[#101828]">
            {client?.first_name || client?.last_name
              ? `${client?.first_name ?? ""} ${client?.last_name ?? ""}`.trim()
              : "Lead Name"}
          </SheetTitle>
          <button
            onClick={onEdit}
            className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]"
            aria-label="Edit name"
          >
            <PencilLine className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
          <div className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#98a2b3]" />
            <span>{client?.phone_number ?? "+91-1234567890"}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#98a2b3]" />
            <span className="truncate">
              {client?.email ?? "liam.anderson@email.com"}
            </span>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <Label className="mb-1 block text-xs text-[#667085]">Stage</Label>
        <Select
          open={isStageSelectOpen}
          onOpenChange={setIsStageSelectOpen}
          value={stage}
          onValueChange={(v) => {
            setStage(v as any);
          }}
        >
          <SelectTrigger className="w-[200px] h-9 rounded-md border-[#e4e7ec]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LEAD">Lead</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="ONBOARDING">Onboarding</SelectItem>
            <SelectItem value="AWAITING_PAYMENT">Awaiting payment</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
