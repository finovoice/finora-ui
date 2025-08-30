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
import { editLeadAPI, importLeadAPI } from "@/services/clients";
import { EditableClient, LeadType } from "@/constants/types";

type Props = {
    id?: string,
    open: boolean,
    setOpen: (value: boolean) => void
}

export default function EditLead({ id, open, setOpen }: Props) {
    const [sending, setSending] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [assignedRM, setAssignedRM] = useState<string>("1"); // Default value

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }

    async function handleSubmit() {
        let editedLead: EditableClient = {}
        if (!id?.trim()) {
            showToast({
                title: 'Error',
                description: 'ID not found',
                type: 'error',
                duration: 3000
            });
            return
        }

        if (!firstName.trim() && !lastName.trim() && (email.trim() && !isValidEmail(email)) && !phoneNumber.trim()) {
            showToast({
                title: 'No Value Added',
                description: 'Please Add a new value',
                type: 'warning',
                duration: 3000
            });
        }

        editedLead = {
            ...(firstName ? { first_name: firstName } : {}),
            ...(lastName ? { last_name: lastName } : {}),
            ...(email ? { email } : {}),
            ...(assignedRM ? { assigned_rm: assignedRM } : {}),
            ...(phoneNumber ? { phone_number: phoneNumber } : {}),
        };

        setSending(true);
        try {
            const response = await editLeadAPI(editedLead, id)
            showToast({
                title: "Success",
                description: "Lead Editted!",
                type: 'success'
            })
        }
        catch (e) {
            console.log('error :', e)
            showToast({
                title: "Error",
                description: "Lead could not be created!",
                type: 'error'
            })
        }
        finally {
            setSending(false);
            setOpen(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-md font-medium text-[#101828]">Edit lead(s)</DialogTitle>
                </DialogHeader>

                <Tabs className="w-full">
                    <div className="grid grid-cols-2 gap-4 px-6 pb-1">
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

                    <div className="space-y-1 px-6 pb-6">
                        <Label htmlFor="assigned-rm" className="text-sm font-medium text-[#344054] block">Assigned RM</Label>
                        <Select defaultValue="1" onValueChange={setAssignedRM}>
                            <SelectTrigger className="w-full h-10 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Select RM" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">samir@gmail.com</SelectItem>
                                <SelectItem value="2">admin@finora.com</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Tabs>
                <div className="border-t border-[#e4e7ec] px-6 pb-4  flex flex-col gap-4 items-center justify-between">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                    >
                        <span>{sending ? 'Editting...' : 'Edit'}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
