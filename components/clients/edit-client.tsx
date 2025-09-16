"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { showToast } from '../ui/toast-manager';
import { editLeadAPI } from "@/services/clients";
import { ClientType, EditableClient } from "@/constants/types";

type Props = {
    client: ClientType
    open: boolean,
    setOpen: (value: boolean) => void,
    refreshClients: () => void,
    refreshSubsciption: (clientID: string) => void
}

export default function EditClient({ client, open, setOpen, refreshClients, refreshSubsciption }: Props) {
    const [sending, setSending] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [assignedRM, setAssignedRM] = useState<string>();
    const [countryCode, setCountryCode] = useState("IND (+91)");
    const [risk, setRisk] = useState<string>();

    useEffect(() => {
        if (open && client) {
            setFirstName(client.first_name || "");
            setLastName(client.last_name || "");
            setEmail(client.email || "");
            setPhoneNumber(client.phone_number || "");
            setAssignedRM(client.assigned_rm?.id); // Assuming assigned_rm has an id
            setRisk(client.risk)
        }

    }, [open, client]);


    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }
    const isValidIndianPhone = (phoneNumber: string): boolean => {
        return /^[6-9]\d{9}$/.test(phoneNumber);
    };
    function isValidIndianName(name: string): boolean {
        const regex = /^[A-Za-z\s\-]+$/;
        return regex.test(name.trim());
    }

    async function handleSubmit() {

        let editedClient: EditableClient = {}
        if (!client.id) {
            showToast({
                title: 'Error',
                description: 'Client ID missing',
                type: 'error',
                duration: 3000
            });
            return
        }

        if (!firstName.trim() && !lastName.trim() && (email.trim() && !isValidEmail(email)) && !phoneNumber.trim() && !assignedRM?.trim()) {
            showToast({
                title: 'No Value Added',
                description: 'Please Add a new value',
                type: 'warning',
                duration: 3000
            });
            return
        }

        if (firstName.trim() && !isValidIndianName(firstName.trim())) {
            showToast({
                title: 'Invalid First Name',
                description: 'Please add First Name in correct format',
                type: 'warning',
                duration: 3000
            });
            return
        }

        if (lastName.trim() && !isValidIndianName(lastName.trim())) {
            showToast({
                title: 'Invalid Last Name',
                description: 'Please add Last Name in correct format',
                type: 'warning',
                duration: 3000
            });
            return
        }

        if (phoneNumber && !isValidIndianPhone(phoneNumber.trim())) {
            showToast({
                title: 'Phone number not valid',
                description: 'Please Add a correct phone number value',
                type: 'warning',
                duration: 3000
            });
            return
        }

        editedClient = {
            ...(firstName !== client.first_name ? { first_name: firstName } : {}),
            ...(lastName !== client.last_name ? { last_name: lastName } : {}),
            ...(email !== (client.email || "") ? { email } : {}),
            ...(assignedRM !== client.assigned_rm?.id ? { assigned_rm: assignedRM } : {}),
            ...(phoneNumber !== client.phone_number ? { phone_number: phoneNumber } : {}),
            ...(risk !== client.risk ? { risk: risk?.toUpperCase() } : '')
        };

        // Only send if there are actual changes
        if (Object.keys(editedClient).length === 0) {
            showToast({
                title: 'Please make a change',
                description: 'No changes were made to the client details.',
                type: 'info',
                duration: 3000
            });
            return;
        }
        setSending(true);
        try {
            await editLeadAPI(editedClient, client.id) // Reusing editLeadAPI as it handles EditableClient and ID
            showToast({
                title: "Success",
                description: "Client Edited!",
                type: 'success'
            })
            refreshClients();
            refreshSubsciption(client.id)
        }
        catch (e) {
            console.error('Error editing client:', e)
            showToast({
                title: "Error",
                description: "Client could not be edited!",
                type: 'error'
            })
        }
        finally {
            setSending(false);
            setOpen(false);
            setFirstName("")
            setLastName("")
            setEmail("")
            setPhoneNumber("")
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[600px] max-w-none p-0 overflow-hidden rounded-xl">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-md font-medium text-[#101828]">Edit Client</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 px-6 pb-1">
                    <div>
                        <Label htmlFor="first-name" className="text-sm font-medium text-[#344054] mb-1 block">First name</Label>
                        <Input id="first-name" placeholder={`${client.first_name}`} className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="last-name" className="text-sm font-medium text-[#344054] mb-1 block">Last name </Label>
                        <Input id="last-name" placeholder={`${client.last_name}`} className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="email" className="text-sm font-medium text-[#344054] mb-1 block">Email</Label>
                        <Input id="email" placeholder={`${client.email}`} className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="phone-number" className="text-sm font-medium text-[#344054] mb-1 block">Phone number</Label>
                        <div className="flex">
                            <Select value={countryCode} onValueChange={setCountryCode}>
                                <SelectTrigger className="w-[103px] !h-10 gap-0 rounded-r-none border-r-0 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                    <SelectValue>IND (+91)</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IND (+91)">IND (+91)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input type="number"
                                placeholder={`${client.phone_number}`}
                                className="flex-1 h-10 rounded-l-none border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between ">
                    <div className="flex-[4] space-y-1 px-6 pb-6">
                        <Label htmlFor="assigned-rm" className="text-sm font-medium text-[#344054] block">Assigned RM</Label>
                        <Select value={String(assignedRM)} onValueChange={setAssignedRM}>
                            <SelectTrigger className="w-full h-10 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Select RM" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">samir@gmail.com</SelectItem>
                                <SelectItem value="2">admin@finora.com</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-[9] space-y-1.5">
                        <Label className="text-sm text-[#344054]">Renewal frequency <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2">
                            <Button type="button" variant={risk === 'CONSERVATIVE' ? 'default' : 'outline'} onClick={() => setRisk('CONSERVATIVE')}>Conservative</Button>
                            <Button type="button" variant={risk === 'HIGH' ? 'default' : 'outline'} onClick={() => setRisk('HIGH')}>High</Button>
                            <Button type="button" variant={risk === 'AGGRESSIVE' ? 'default' : 'outline'} onClick={() => setRisk('AGGRESSIVE')}>Aggressive</Button>
                        </div>
                    </div>
                </div>


                <div className="border-t border-[#e4e7ec] px-6 pb-4  flex flex-col gap-4 items-center justify-between">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                    >
                        <span>{sending ? 'Editing...' : 'Edit Client'}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
