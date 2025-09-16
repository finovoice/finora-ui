"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { RefreshCcw, X, ChevronDown } from "lucide-react"
import { ClientType, EditableClient, SubscriptionType } from "@/constants/types"
import { Info } from "../clients/client-drawer" // Assuming Info component is exported from client-drawer
import { showToast } from "../ui/toast-manager"
import { sub } from "date-fns"
import { createSubscriptionAPI, getSubscriptionByClientIDAPI } from "@/services/subscription"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { editCientAPI } from "@/services/clients"
import { getCurrentSubscriptionFromList } from "@/lib/getCurrentSubscriptionFromList"
import { getFutureSubscriptionsFromList } from "@/lib/getFutureSubscriptionFromList"
import { getPastSubscriptionFromList } from "@/lib/getPastSubscriptionFromList"
import { start } from "repl"

interface RenewalConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: ClientType;
    subscriptionList: SubscriptionType[] | [];
    refreshSubscriptions: (clientID: string) => void;
    refreshClients: () => void;
}

export function RenewalConfirmationDialog({
    open,
    onOpenChange,
    client,
    subscriptionList,
    refreshSubscriptions,
    refreshClients
}: RenewalConfirmationDialogProps) {
    const [sending, setSending] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlanName, setEditedPlanName] = useState<string>('');
    const [editedAmount, setEditedAmount] = useState('0');
    const [editedPlanType, setEditedPlanType] = useState<string>('');
    const [editedPeriod, setEditedPeriod] = useState<string>('');
    const [nextSubscription, setNextSubscription] = useState<SubscriptionType | null>(null);

    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
    const [futureSubscriptions, setFutureSubscriptions] = useState<SubscriptionType[] | null>(null);
    const [pastSubscriptions, setPastSubscriptions] = useState<SubscriptionType[] | null>(null)

    useEffect(() => {
        setCurrentSubscription(getCurrentSubscriptionFromList(subscriptionList))
        setFutureSubscriptions(getFutureSubscriptionsFromList(subscriptionList))
        setPastSubscriptions(getPastSubscriptionFromList(subscriptionList))

        if (subscriptionList.length > 0) {
            setEditedAmount(subscriptionList[0].amount_paid)
            setEditedPlanName(subscriptionList[0].plan_name)
            setEditedPlanType(subscriptionList[0].plan_type!)
            setEditedPeriod(subscriptionList[0].plan_name.split(' ')[1])
        }
    }, [subscriptionList])

    const handleConfirmRenewal = async () => {

        const currentSubscriptions = currentSubscription
        let start_date
        let end_date
        let futurePlan = false;

        if (subscriptionList.length > 0) {
            start_date = new Date(new Date(subscriptionList[0].end_date).getTime() + 86400000).toISOString().slice(0, 10);
            end_date = getFutureDate(editedPeriod, start_date)
        } else {
            start_date = new Date().toISOString().slice(0, 10)
            end_date = getFutureDate(editedPeriod, start_date)
        }

        if (currentSubscription) {
            futurePlan = true
        }

        setSending(true);

        try {
            const updateSubscription: SubscriptionType = {
                plan: '1',
                created_by: client.assigned_rm.id,
                client: client.id,
                start_date: start_date,
                end_date: end_date,
                amount_paid: editedAmount,
                client_email: client.email,
                plan_name: editedPlanName,
                plan_type: editedPlanType.toUpperCase()

            }
            const response = await createSubscriptionAPI(updateSubscription);
            showToast({
                title: 'Success',
                description: `Successfully created a ${futurePlan ? 'future' : ''} subscription`,
                type: 'success',
                duration: 4000
            })

            try {
                if (!futurePlan) {
                    const updateClient: EditableClient = {
                        plan: editedPlanType
                    }

                    const clientResponse = await editCientAPI(updateClient, client.id)
                    showToast({
                        title: 'Success',
                        description: 'Successfully updated client',
                        type: 'success',
                        duration: 4000
                    })
                }
            }
            catch (e) {
                showToast({
                    title: 'Error',
                    description: 'Could not update client',
                    type: 'error',
                    duration: 4000
                })
            }
            refreshSubscriptions(client.id)
            refreshClients()

        } catch (e) {
            showToast({
                title: 'Error',
                description: 'Error in creating Subscription',
                type: 'error',
                duration: 5000
            })
        } finally {
            setEditedAmount('0')
            setSending(false);
            onOpenChange(false);
        }
    };

    const handleEditConfirm = () => {
        setEditedPlanName(editedPlanType
            + ' ' + editedPeriod)
        setIsEditing(false);
    };

    const handleEditBack = () => {
        setIsEditing(false);
    };

    const planOptions = ["Elite", "Premium", "Standard"];
    const periodOptions = ["Monthly", "Quarterly", "Weekly"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] w-2xl p-0">
                <DialogHeader className="flex flex-row items-center justify-between px-6 pt-4 pb-1">
                    <DialogTitle className="text-[18px] font-medium text-[#101828]">Plan details</DialogTitle>
                </DialogHeader>
                {isEditing ? (
                    <div className="px-6 py-2 pt-0 -mt-2 space-y-5">
                        {/* Plan */}
                        <div className="space-y-1">
                            <Label className="text-[#344054] text-sm">
                                Plan <span className="text-[#7f56d9]">*</span>
                            </Label>
                            <Select value={editedPlanType === '' ? undefined : editedPlanType.charAt(0).toUpperCase() + editedPlanType.slice(1).toLowerCase()} onValueChange={(e) => {
                                setEditedPlanType(e);
                            }}>
                                <SelectTrigger className="h-11 w-full rounded-md border-[#e4e7ec]">
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {planOptions.map((planOpt) => (
                                        <SelectItem key={planOpt} value={planOpt}>
                                            {planOpt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Amount */}
                        <div className="space-y-1">
                            <Label className="text-[#344054] text-sm">
                                Amount received <span className="text-[#7f56d9]">*</span>
                            </Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">₹</span>
                                <Input
                                    value={editedAmount}
                                    onChange={(e) => {
                                        setEditedAmount(String(Number(e.target.value.replace(/[^0-9]/g, "")) || 0));
                                    }}
                                    className="h-11 pl-8 rounded-md border-[#e4e7ec]"
                                    inputMode="numeric"
                                    required
                                />
                            </div>
                        </div>

                        {/* Period */}
                        <div className="space-y-1">
                            <Label className="text-[#344054] text-sm">
                                Renewal period <span className="text-[#7f56d9]">*</span>
                            </Label>
                            <Select value={editedPeriod} onValueChange={(e) => {
                                setEditedPeriod(e);
                            }}>
                                <SelectTrigger className="h-11 w-full rounded-md border-[#e4e7ec]">
                                    <SelectValue placeholder="Select a period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periodOptions.map((periodOpt) => (
                                        <SelectItem key={periodOpt} value={periodOpt}>
                                            {periodOpt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                type="button"
                                className="w-full bg-[#7F56D9] text-white hover:bg-[#6941C6]"
                                onClick={handleEditConfirm}
                            >
                                Confirm
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-[#344054] border-[#D0D5DD] hover:bg-[#F9FAFB]"
                                onClick={handleEditBack}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 space-y-4 bg-gray-100 mx-5 rounded-sm">
                            <Info label="Chosen plan" value={editedPlanName === '' ? 'Not Set' : editedPlanName} />
                            <Info label="Amount paid" value={<span>{`₹ ${editedAmount ?? 'N/A'}/-`}</span>} />
                            <Info label="Renewal duration" value={editedPeriod === '' ? "Not Set" : editedPeriod} />
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-col gap-3 px-6 py-3 pt-0">
                            <Button
                                type="button"
                                className="w-full bg-[#7F56D9] text-white hover:bg-[#6941C6]"
                                onClick={handleConfirmRenewal}
                                disabled={sending || editedAmount == '0'}
                            >
                                {sending ? "Confirming..." : "Confirm"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-[#344054] border-[#D0D5DD] hover:bg-[#F9FAFB]"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}


export function getFutureDate(interval?: string | null, startDate?: string | Date | null): string {
    const normalized = interval?.toLowerCase() ?? 'weekly';

    const daysToAdd = {
        weekly: 7,
        monthly: 30,
        quarterly: 90,
        yearly: 365,
    }[normalized] ?? 7;

    const future = startDate ? new Date(startDate) : new Date();
    future.setUTCDate(future.getUTCDate() + daysToAdd);
    future.setUTCHours(0, 0, 0, 0);

    return future.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD'
}

function isValidSubscription(sub: Partial<SubscriptionType>): sub is SubscriptionType {
    let isValid = true;

    if (typeof sub.plan !== 'string') {
        showToast({
            title: 'Invalid field: plan',
            description: 'Expected a string for "plan".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.created_by !== 'string') {
        showToast({
            title: 'Invalid field: created_by',
            description: 'Expected a string for "created_by".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.client !== 'string') {
        showToast({
            title: 'Invalid field: client_id',
            description: 'Expected a string for "client_id".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.start_date !== 'string') {
        showToast({
            title: 'Invalid field: start_date',
            description: 'Expected a string for "start_date".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.end_date !== 'string') {
        showToast({
            title: 'Invalid field: end_date',
            description: 'Expected a string for "end_date".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (!(typeof sub.amount_paid === 'string' || typeof sub.amount_paid === 'number')) {
        showToast({
            title: 'Invalid field: amount_paid',
            description: 'Expected a string or number for "amount_paid".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.client_email !== 'string') {
        showToast({
            title: 'Invalid field: client_email',
            description: 'Expected a string for "client_email".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    if (typeof sub.plan_name !== 'string') {
        showToast({
            title: 'Invalid field: plan_name',
            description: 'Expected a string for "plan_name".',
            type: 'error',
            duration: 4000
        });
        isValid = false;
    }

    return isValid;
}
