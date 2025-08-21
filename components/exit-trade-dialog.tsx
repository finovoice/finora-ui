"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Ban, Bike, Clock3, Flag, FlagIcon, Layers3, Send, X } from "lucide-react"
import { TradeType } from "@/constants/types"
import { exitTradeAPI } from "@/services/trades"
import { showToast } from './ui/toast-manager'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    trade: TradeType | null
}

export type ExitTrade = {
    id: string | undefined,
    exited_price: string,
    exitMax?: string,
}

export default function ExitTradeDialog({ open, onOpenChange, trade }: Props) {

    const [useRange, setUseRange] = useState(false)
    const [exitMin, setExitMin] = useState<string>("")
    const [exitMax, setExitMax] = useState<string>("")
    const [blankExitMinWarning, setBlankExitMinWarning] = useState(false)
    const [blankExitMaxWarning, setBlankExitMaxWarning] = useState(false)
    const [sending, setSending] = useState(false)

    useEffect(() => {
        setExitMin("")
        setExitMax("")
        setUseRange(false)
        setBlankExitMinWarning(false)
        setBlankExitMaxWarning(false)
    }, [trade?.id, open])

    async function handleSubmit() {

        setBlankExitMinWarning(!exitMin)
        useRange && setBlankExitMaxWarning(!exitMax)

        if (!exitMin || (useRange && !exitMax)) {
            console.warn(`Pls fill all required field/s: Min Exit ${useRange ? "and Max Exit" : ''}`)
            showToast({
                title: 'Warning',
                description: `Pls fill all required field/s: Min Exit ${useRange ? "and Max Exit" : ''}`,
                type: 'warning',
                duration: 3000
            })
            return
        }

        setSending(true)
        const id: string | undefined = trade?.id
        const exitTradePayload: ExitTrade = {
            id: id,
            exited_price: exitMin,
            ...(useRange && exitMax ? { exitMax } : {})
        }
        try {
            const response = await exitTradeAPI(exitTradePayload as any, trade?.id)
            showToast({
                title: 'Success',
                description: 'Successfully exited the trade',
                type: 'success',
                duration: 3000
            })
        } catch (e) {
            console.warn(e)
            showToast({
                title: 'Error',
                description: `An error has occured`,
                type: 'error',
                duration: 3000
            })
        } finally {
            onOpenChange(false)
            setSending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-3">
                    <DialogTitle className="text-sm text-[#101828]">Exit trade</DialogTitle>
                </DialogHeader>
                <div className="text-sm flex flex-row gap-2 mx-4 items-center">
                    <span className="inline-flex items-center gap-2 rounded-md border border-[#e6f4d7] bg-[#e6f4d7] px-2 py-1 text-xs font-medium text-[#326212]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#a6ef67]" aria-hidden />
                        {trade?.order}
                    </span>
                    <span className="text-medium">{trade?.stock_name}</span>
                    <span className="ml-1 inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
                        {trade?.segment}
                    </span>
                    <span className="ml-1 inline-flex items-center rounded-md border border-[#e4e7ec] bg-[#f2f4f7] px-2 py-0.5 text-[10px] font-medium uppercase text-[#475467]">
                        {trade?.timehorizon}
                    </span>
                </div>

                <div className="px-6 pt-4 space-y-3">
                    <Row>
                        <FieldLabel icon={<FlagIcon className="h-4 w-4" />} text="Exit" />
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <CurrencyInput
                                    placeholder="Min"
                                    value={exitMin}
                                    blankInputWarning={blankExitMinWarning}
                                    onChange={(e) => setExitMin(e.target.value)}
                                />
                                <CurrencyInput
                                    placeholder="Max"
                                    value={!useRange ? '' : exitMax}
                                    blankInputWarning={blankExitMaxWarning}
                                    onChange={(e) => setExitMax(e.target.value)}
                                    disabled={!useRange}
                                />
                                <div className="flex items-center gap-2 self-end">
                                    <Switch id="range-edit" checked={useRange} onCheckedChange={() => { setUseRange(!useRange); setBlankExitMaxWarning(false) }} />
                                    <Label htmlFor="range-edit" className="text-sm">
                                        Range
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div>

                {/* Footer (no recipients) */}
                <div className="border-t border-[#e4e7ec] px-4 py-4">
                    <div className="mx-2">
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={sending}
                            className="h-10 w-full justify-center gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                        >
                            <span>{sending ? 'Sending' : 'Send Update'}</span>
                            <Send className="h-4 w-4" />
                        </Button>
                        <p className="mt-2 text-center text-xs text-[#667085]">Update will be sent to the same clients</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Row({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 gap-3 items-start sm:grid-cols-[140px_1fr]">{children}</div>
}

function FieldLabel({ icon, text, lock = false }: { icon: React.ReactNode; text: string, lock?: boolean }) {
    return (
        <div className={`flex items-center gap-2  text-sm ${lock ? 'text-gray-400' : ''}`}>
            <span className="text-[#667085]">{icon}</span>
            <span>{text}</span>
        </div>
    )
}

function CurrencyInput(props: React.ComponentProps<typeof Input> & { disabled?: boolean; blankInputWarning?: boolean }) {
    const { className, disabled, blankInputWarning = false, ...rest } = props
    return (
        <div className="relative w-full">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">{"₹"}</span>
            <Input
                type="number"
                {...rest}
                disabled={disabled}
                className={`h-8 pl-8 rounded-md ${blankInputWarning ? 'border-red-500' : 'border-[#e4e7ec]'} placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
            />
        </div>
    )
}
