"use client"

import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"
import { TradeType } from "@/constants/types"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Hourglass, Pencil, Send } from "lucide-react"
import { useState, useMemo } from "react" // Added useMemo
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

    const timelineEvents = useMemo(() => {
        if (!trade) return [];

        const events: {
            id: string;
            type: "Created" | "Edited";
            timestamp: string;
            audit?: AuditTrail;
        }[] = [];

        // Add the initial trade creation event
        events.push({
            id: `trade-created-${trade.created_at}`,
            type: "Created",
            timestamp: trade.created_at,
        });

        // Add audit trail events
        if (trade.audit_trails) {
            trade.audit_trails.forEach((audit, index) => {
                events.push({
                    id: `audit-${audit.updated_at}-${index}`, // Ensure unique ID
                    type: getAuditType(audit),
                    timestamp: audit.updated_at,
                    audit: audit,
                });
            });
        }

        // Sort events chronologically (oldest first)
        events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return events;
    }, [trade]); // Recalculate when trade changes

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
                    {timelineEvents.slice().reverse().map((event, index: number) => { // Reverse the array for display
                        const isInitialCreation = event.type === "Created" && !event.audit; // Differentiate initial creation from audit trail 'Created'
                        const displayType = isInitialCreation ? "Created" : event.type;
                        const changes = event.audit ? getChanges(event.audit) : [];
                        const timestamp = new Date(event.timestamp).toLocaleString();

                        // Calculate the actual index for the line connector based on the original sorted array
                        const originalIndex = timelineEvents.length - 1 - index;

                        return (
                            <div key={event.id} className="flex gap-2 mb-4">
                                <div className="flex flex-col items-center mt-1">
                                    {displayType === "Edited" ? (
                                        <Pencil className="h-4 w-4 text-[#98a2b3]" />
                                    ) : (
                                        <Send className="h-4 w-4 text-[#98a2b3]" />
                                    )}
                                    {originalIndex > 0 && ( // Connectors for all but the very first (oldest) event
                                        <div className="w-px bg-[#e4e7ec] flex-1 mt-1 -mb-3"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-600">{displayType}</span>
                                        {changes.length > 0 && (
                                            <button
                                                className="rounded-md  hover:bg-[#f2f4f7]"
                                                onClick={() => toggleAuditTrail(event.id)}
                                                aria-expanded={expandedAuditTrail === event.id}
                                                aria-label={expandedAuditTrail === event.id ? "Collapse details" : "Expand details"}
                                            >
                                                {expandedAuditTrail === event.id ? <ChevronUp className="h-4 w-4 text-[#98a2b3]" /> : <ChevronDown className="h-4 w-4 text-[#98a2b3]" />}
                                            </button>
                                        )}
                                    </div>
                                    {changes.length > 0 && expandedAuditTrail === event.id && (
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
