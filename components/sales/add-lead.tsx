"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { showToast } from '../ui/toast-manager';
import { importLeadAPI } from "@/services/clients";
import { LeadType } from "@/constants/types";

type Props = {
    open: boolean,
    setOpen: (value: boolean) => void
}

export default function AddLead({ open, setOpen }: Props) {
    const [sending, setSending] = useState<boolean>(false);
    const [addContinuously, setAddContinuously] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [assignedRM, setAssignedRM] = useState<string>("1"); // Default value

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }

    async function handleSubmit() {
        if (!firstName.trim()) {
            showToast({
                title: 'Validation Error',
                description: 'First name is required.',
                type: 'warning',
                duration: 3000
            });
            return;
        }
        if (!lastName.trim()) {
            showToast({
                title: 'Validation Error',
                description: 'Last name is required.',
                type: 'warning',
                duration: 3000
            });
            return;
        }
        if (email.trim() && !isValidEmail(email)) {
            showToast({
                title: 'Validation Error',
                description: 'Please enter a valid email address.',
                type: 'warning',
                duration: 3000
            });
            return;
        }
        if (!phoneNumber.trim()) {
            showToast({
                title: 'Validation Error',
                description: 'Phone number is required.',
                type: 'warning',
                duration: 3000
            });
            return;
        }
        const lead: LeadType = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: email,
            assigned_rm: assignedRM,
            organisation: 1,
        }
        setSending(true);
        try {
            const response = await importLeadAPI(lead)
            showToast({
                title: "Success",
                description: "Lead Created!",
                type: 'success'
            })
        }
        catch (e) {
            showToast({
                title: "Error",
                description: "Lead could not be created!",
                type: 'error'
            })
        }
        finally {
            setSending(false);
            addContinuously ? setOpen(true) : setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-md font-medium text-[#101828]">Add lead(s)</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto bg-white p-0 border-b border-[#e4e7ec] rounded-none">
                        <TabsTrigger value="manual" className="rounded-none border-b-1.5 border-transparent data-[state=active]:border-b-[#7f56d9] data-[state=active]:shadow-none text-sm font-sm text-[#667085] data-[state=active]:text-[#7f56d9] py-3">Manual</TabsTrigger>
                        <TabsTrigger value="bulk" className="rounded-none border-b-1.5 border-transparent data-[state=active]:border-b-[#7f56d9] data-[state=active]:shadow-none text-sm font-sm text-[#667085] data-[state=active]:text-[#7f56d9] py-3">Bulk</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual" className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first-name" className="text-sm font-medium text-[#344054] mb-1 block">First name <span className="text-red-500">*</span></Label>
                                <Input id="first-name" placeholder="First name" className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="last-name" className="text-sm font-medium text-[#344054] mb-1 block">Last name <span className="text-red-500">*</span></Label>
                                <Input id="last-name" placeholder="Last name" className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-[#344054] mb-1 block">Email</Label>
                                <Input id="email" placeholder="olivia.rhye@email.com" className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="phone-number" className="text-sm font-medium text-[#344054] mb-1 block">Phone number <span className="text-red-500">*</span></Label>
                                <div className="flex">
                                    <Select defaultValue="IND (+91)">
                                        <SelectTrigger className="w-[103px] !h-10 gap-0 rounded-r-none border-r-0 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IND (+91)">IND (+91)</SelectItem>
                                            <SelectItem value="USA (+1)">USA (+1)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input id="phone-number" placeholder="9876543210" className="flex-1 h-10 rounded-l-none border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="assigned-rm" className="text-sm font-medium text-[#344054] block">Assigned RM</Label>
                            <Select defaultValue="1" onValueChange={setAssignedRM}>
                                <SelectTrigger className="w-full h-10 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Select RM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">admin@finora.com</SelectItem>
                                    <SelectItem value="2">samir@gmail.com</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                    <TabsContent value="bulk" className="p-5 pb-58">
                        <p className="text-sm text-[#667085]">Bulk upload functionality will be implemented later.</p>
                    </TabsContent>
                </Tabs>

                <div className="border-t border-[#e4e7ec] px-6 pb-4  flex flex-col gap-4 items-center justify-between">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                    >
                        <span>{sending ? 'Adding...' : 'Add'}</span>
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="add-continuously"
                            checked={addContinuously}
                            onCheckedChange={setAddContinuously}
                            className="data-[state=checked]:bg-[#7f56d9]"
                        />
                        <Label htmlFor="add-continuously" className={`text-sm ${addContinuously ? 'text-[#475467]' : 'text-gray-400'} `}>Add continuously</Label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
