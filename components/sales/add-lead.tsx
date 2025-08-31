"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { showToast } from '../ui/toast-manager';
import { importLeadAPI, bulkCreateLeadsAPI } from "@/services/clients";
import { LeadType } from "@/constants/types";
import Papa from 'papaparse';
import { downloadCSV } from '@/lib/utils';

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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                showToast({
                    title: 'Validation Error',
                    description: 'Please select a valid CSV file.',
                    type: 'warning',
                    duration: 3000
                });
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleDownloadCSV = () => {
        const headers = ['phone_number', 'email', 'organisation', 'first_name', 'last_name'];
        downloadCSV(headers, 'leads_template.csv');
    };

    const handleUploadCSV = async () => {
        if (!selectedFile) {
            showToast({
                title: 'Validation Error',
                description: 'Please select a CSV file to upload.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        setSending(true);
        showToast({
            title: 'Processing CSV...',
            type: 'info',
            duration: Infinity,
            progress: 0
        });

        try {
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const parsedData = results.data as Record<string, string>[];

                    if (parsedData.length === 0) {
                        showToast({
                            title: 'Validation Error',
                            description: 'The CSV file is empty or could not be parsed.',
                            type: 'warning',
                            duration: 3000
                        });
                        setSending(false);
                        return;
                    }

                    // Map parsed data to LeadType and validate
                    const leadsToImport: LeadType[] = [];
                    let hasValidationError = false;

                    for (const row of parsedData) {
                        const firstName = row['first_name']?.trim();
                        const lastName = row['last_name']?.trim();
                        const email = row['email']?.trim();
                        const phoneNumber = row['phone_number']?.trim();
                        const assignedRM = row['organisation']?.trim() || "1"; // Default to "1" if not provided

                        if (!firstName || !lastName || !phoneNumber) {
                            ({
                                title: 'Validation Error',
                                description: 'Missing required fields (First name, Last name, Phone number) in CSV row.',
                                type: 'error',
                                duration: 5000
                            });
                            hasValidationError = true;
                            break;
                        }

                        if (email && !isValidEmail(email)) {
                            showToast({
                                title: 'Validation Error',
                                description: `Invalid email format for: ${email}`,
                                type: 'error',
                                duration: 5000
                            });
                            hasValidationError = true;
                            break;
                        }

                        leadsToImport.push({
                            first_name: firstName,
                            last_name: lastName,
                            email: email || "", // Email is optional
                            phone_number: phoneNumber,
                            assigned_rm: assignedRM,
                            organisation: 1, // Assuming default organization ID
                        });
                    }

                    if (hasValidationError) {
                        setSending(false);
                        return;
                    }

                    // Now send the parsed and validated data to the backend using the new bulkCreateLeadsAPI
                    showToast({
                        title: 'Importing Leads...',
                        type: 'info',
                        duration: Infinity, // Keep toast open during import
                        progress: 0 // Start progress for import
                    });

                    try {
                        const response = await bulkCreateLeadsAPI(leadsToImport);
                        showToast({
                            title: "Success",
                            description: `Successfully imported ${leadsToImport.length} leads.`,
                            type: 'success',
                            duration: 3000,
                            progress: 100
                        });
                        setSelectedFile(null); // Clear selected file after successful import
                        console.log("Bulk Import Response:", response);
                    } catch (apiError) {
                        showToast({
                            title: "Error",
                            description: "Failed to import leads via API. Check console for details.",
                            type: 'error',
                            duration: 3000,
                            progress: 0
                        });
                        console.error("Bulk Import API Error:", apiError);
                    } finally {
                        setSending(false);
                    }
                },
                error: (error) => {
                    showToast({
                        title: "Parsing Error",
                        description: `Failed to parse CSV file: ${error.message}`,
                        type: 'error',
                        duration: 3000,
                        progress: 0
                    });
                    setSending(false);
                }
            });

        } catch (e) {
            showToast({
                title: "Error",
                description: "Failed to process or upload CSV file.",
                type: 'error',
                duration: 3000,
                progress: 0
            });
        } finally {
            setSending(false);
        }
    };

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
                        <div className="border-t border-[#e4e7ec] px-6 pb-4 flex flex-col gap-4 items-center justify-between">
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
                    </TabsContent>
                    <TabsContent value="bulk" className="p-5  space-y-5">
                        <div className="rounded-lg border border-[#e4e7ec] bg-[#fcfcfd] p-5 space-y-4">
                            <h3 className="text-md font-medium text-[#101828]">Instructions</h3>
                            <p className="text-sm text-[#667085]">Drop a csv file with the following columns -</p>
                            <ol className="list-decimal list-inside text-sm text-[#667085] space-y-2">
                                <li><span className="font-semibold">First name*</span> - first name of the client</li>
                                <li><span className="font-semibold">Last name*</span> - last name of the client</li>
                                <li><span className="font-semibold">Email</span> - valid email fo the client (optional)</li>
                                <li><span className="font-semibold">Phone number*</span> - add client's valid whatsapp number</li>
                                <li><span className="font-semibold">Assigned RM</span> - write name of RM which exactly matches the name added by you in the employee page; Admin's name will be added if left blank.</li>
                            </ol>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-[#667085]">Or, download</p>
                                <Button
                                    variant="link"
                                    onClick={handleDownloadCSV}
                                    className="p-0 h-auto text-[#7f56d9] underline text-sm"
                                >
                                    this csv file
                                </Button>
                                <p className="text-sm text-[#667085]">and fill your lead info.</p>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv"
                            className="hidden"
                        />

                        {selectedFile && (
                            <div className="rounded-lg border border-[#e4e7ec] px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-md bg-[#f2f4f7] text-[10px] flex items-center justify-center text-[#667085] font-semibold">
                                        CSV
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-sm text-[#101828]">{selectedFile.name}</div>
                                        <div className="text-xs text-[#98a2b3]">{Math.round(selectedFile.size / 1024)} KB</div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-[#f2f4f7]"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = ''; // Reset the file input
                                        }
                                    }}
                                    aria-label="Remove file"
                                >
                                    <X className="h-4 w-4 text-[#667085]" />
                                </Button>
                            </div>
                        )}

                        <Button
                            type="button"
                            onClick={selectedFile ? handleUploadCSV : () => fileInputRef.current?.click()}
                            disabled={sending}
                            className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                        >
                            <span>{sending ? 'Uploading...' : (selectedFile ? 'Upload' : 'Upload .csv file')}</span>
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
