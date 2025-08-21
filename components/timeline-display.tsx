"use client"

import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"
import { TradeType } from "@/constants/types"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Hourglass, Pencil, Send } from "lucide-react"
import { useState } from "react"
import { AuditTrail } from "@/constants/types"

type TimelineProps = {
    open: boolean,
    onOpenChange: (value: boolean) => void,
    trade: TradeType | null
}

export default function TimelineDisplay(
    { open, onOpenChange, trade }: TimelineProps
) {
    const [expandedAuditTrail, setExpandedAuditTrail] = useState<string | null>(null);

    const getAuditType = (audit: AuditTrail) => {
        if (Object.keys(audit.changed_from).length === 0) {
            return "Created";
        }
        return "Edited";
    };

    const getChanges = (audit: AuditTrail) => {
        const changes: { field: string; before: string; after: string }[] = [];
        const allKeys = new Set([...Object.keys(audit.changed_from), ...Object.keys(audit.changed_to)]);

        allKeys.forEach(key => {
            const before = audit.changed_from[key] || "N/A";
            const after = audit.changed_to[key] || "N/A";
            if (before !== after) {
                changes.push({ field: key.toUpperCase(), before, after });
            }
        });
        return changes;
    };

    const toggleAuditTrail = (id: string) => {
        setExpandedAuditTrail(expandedAuditTrail === id ? null : id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="fixed inset-0 w-screen h-screen bg-black/50 z-40" />
            <DialogContent className="fixed inset-y-0 right-0 h-full w-[30vw] max-w-none p-0 overflow-hidden bg-white flex flex-col z-50">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-3">
                    <DialogTitle className="font-semibold text-[#101828]">Timeline</DialogTitle>
                </DialogHeader>

                {trade && (
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e4e7ec]">
                        {/* BUY/SELL pill with dot */}
                        <span className={cn(
                            "inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium",
                            trade.order === "BUY" ? "border-[#e6f4d7] bg-[#e6f4d7] text-[#326212]" : "border-[#ffe6e6] bg-[#ffe6e6] text-[#992020]"
                        )}>
                            <span className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                trade.order === "BUY" ? "bg-[#a6ef67]" : "bg-[#ff6666]"
                            )} aria-hidden />
                            {trade.order}
                        </span>

                        <div className="font-medium text-gray-700">{trade.stock_name}</div>

                        {/* Tags */}
                        <span className="ml-1 inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
                            {trade.segment}
                        </span>
                        {trade.timehorizon && (
                            <span className="inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
                                <Hourglass size={12} className="pr-0.5" />
                                {trade.timehorizon}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {trade && trade.audit_trails && [...trade.audit_trails].reverse().map((audit: AuditTrail, index: number) => {
                        const auditType = getAuditType(audit);
                        const changes = getChanges(audit);
                        const timestamp = new Date(audit.updated_at).toLocaleString();

                        return (
                            <div key={index} className="flex gap-2 mb-4">
                                <div className="flex flex-col items-center mt-1">
                                    {auditType === "Edited" ? (
                                        <Pencil className="h-4 w-4 text-[#98a2b3]" />
                                    ) : (
                                        <Send className="h-4 w-4 text-[#98a2b3]" />
                                    )}
                                    {index < trade.audit_trails.length - 1 && (
                                        <div className="w-px bg-[#e4e7ec] flex-1 mt-1 -mb-3"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-600">{auditType}</span>
                                        {changes.length > 0 && (
                                            <button
                                                className="rounded-md  hover:bg-[#f2f4f7]"
                                                onClick={() => toggleAuditTrail(`${audit.updated_at}-${index}`)}
                                                aria-expanded={expandedAuditTrail === `${audit.updated_at}-${index}`}
                                                aria-label={expandedAuditTrail === `${audit.updated_at}-${index}` ? "Collapse details" : "Expand details"}
                                            >
                                                {expandedAuditTrail === `${audit.updated_at}-${index}` ? <ChevronUp className="h-4 w-4 text-[#98a2b3]" /> : <ChevronDown className="h-4 w-4 text-[#98a2b3]" />}
                                            </button>
                                        )}
                                    </div>
                                    {changes.length > 0 && expandedAuditTrail === `${audit.updated_at}-${index}` && (
                                        <div className="mt-2 px-3 py-2 bg-[#f9fafb] border border-[#eaecf0] rounded-lg text-sm text-[#475467]">
                                            {changes.map((change, changeIndex) => (
                                                <div key={changeIndex} className="mb-2 last:mb-0">
                                                    <div className="font-semibold uppercase text-[#344054] text-[11px]">{change.field}</div>
                                                    <div>
                                                        <span className="line-through [text-decoration-thickness:1px] decoration-gray-500 text-xs">{change.before}</span> <span className="text-xs">&rarr;</span> <span className="text-xs">{change.after}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-xs text-[#667085] mt-1">{timestamp}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}
