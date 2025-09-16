"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react"; // Added useEffect
import { X, CheckCircle2, XCircle, Calendar } from "lucide-react"; // Added CheckCircle2 and XCircle
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { showToast } from '../ui/toast-manager';
import { importLeadAPI, bulkCreateLeadsAPI, importClientAPI, bulkCreateClientsAPI } from "@/services/clients"; // Import bulkCreateLeadsAPI
import { EditableClient, LeadType } from "@/constants/types";
import { uploadFileAPI } from "@/services/upload"; // Import uploadFileAPI
import Papa from 'papaparse'; // Import PapaParse
import { downloadCSV } from '@/lib/utils'; // Import downloadCSV utility

type Props = {
    open: boolean,
    setOpen: (value: boolean) => void,
    refreshClients: () => void
}

export default function AddClient({ open, setOpen, refreshClients }: Props) {
    const [sending, setSending] = useState<boolean>(false);
    const [addContinuously, setAddContinuously] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [assigned_RM, setAssigned_RM] = useState<string>("admin@finora.com"); // Default value
    const [countryCode, setCountryCode] = useState("IND (+91)");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [plan, setPlan] = useState<string>("")
    const [date, setDate] = useState<string>("")


    // New state variables for bulk upload UI
    const [uploadState, setUploadState] = useState<'initial' | 'warning' | 'error'>('initial');
    const [clientsToProcess, setClientsToProcess] = useState<EditableClient[]>([]);
    const [validationErrorsCount, setValidationErrorsCount] = useState<number>(0);
    const [isPlanSelectedSelectOpen, setIsPlanSelectedSelectOpen] = useState(false);
    const [risk, setRisk] = useState<string>()


    useEffect(() => {
        if (!open) {
            // Reset all bulk upload related states when the dialog closes
            setUploadState('initial');
            setClientsToProcess([]);
            setValidationErrorsCount(0);
            setSelectedFile(null);
            fileReset();
        }
    }, [open]);

    const isValidDate = (dateStr: string): boolean => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) return false;

        const [yearStr, monthStr, dayStr] = dateStr.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        if ((year < 1925 || year > 2007)) return false;

        if (month < 1 || month > 12) return false;

        const isValidDay = (d: number, m: number, y: number): boolean => {
            const daysInMonth = new Date(y, m, 0).getDate();
            return d >= 1 && d <= daysInMonth;
        };
        return isValidDay(day, month, year);
    };

    function isValidIndianName(name: string): boolean {
        const regex = /^[A-Za-z\s\-]+$/;
        return regex.test(name.trim());
    }

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }
    const isValidIndianPhone = (phoneNumber: string): boolean => {
        return /^[6-9]\d{9}$/.test(phoneNumber);
    };

    const fileReset = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    }

    async function handleSubmit() {
        const trimmedName = name.trim();
        const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);

        if (!trimmedName) {
            showToast({
                title: 'Validation Error',
                description: 'Name is required.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        if (firstName.length < 2) {
            showToast({
                title: 'Validation Error',
                description: 'First name must be at least 2 characters long.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        // if (nameParts.length < 2 || lastName.length < 2) {
        //     showToast({
        //         title: 'Validation Error',
        //         description: 'Both first name and last name are required, and each must be at least 2 characters long.',
        //         type: 'warning',
        //         duration: 3000
        //     });
        //     return;
        // }

        if (!isValidIndianName(trimmedName)) {
            showToast({
                title: 'Validation Error',
                description: 'Name contains invalid characters.',
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
        if (!phoneNumber.trim() || phoneNumber.length != 10) {
            showToast({
                title: 'Validation Error',
                description: 'Phone number in correct format is required.',
                type: 'warning',
                duration: 3000
            });
            return;
        }
        if (!plan) {
            showToast({
                title: 'Validation Error',
                description: 'Plan has not been selected.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        if (!date) {
            showToast({
                title: 'Validation Error',
                description: 'Date has not been set.',
                type: 'warning',
                duration: 3000
            });
            return;
        } else {
            const validDate = isValidDate(date)
            if (!validDate) {
                showToast({
                    title: 'Validation Error',
                    description: 'Date has not been set.',
                    type: 'warning',
                    duration: 3000
                });
                return;
            }
        }

        if (!risk) {
            showToast({
                title: 'Validation Error',
                description: 'Risk has not been set.',
                type: 'warning',
                duration: 3000
            });
            return;
        }

        const lead: EditableClient = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            risk: risk,
            assigned_rm: assigned_RM,
            organisation: 1,
            dob: date,
            is_converted_to_client: true,
        }
        setSending(true);
        try {
            const response = await importClientAPI(lead)
            showToast({
                title: "Success",
                description: "Lead Created!",
                type: 'success',
                duration: 4000
            })
            refreshClients();
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
            setName("");
            setPhoneNumber("")
            setPlan("")
            setDate("")
            setAssigned_RM("admin@finora.com")
            setRisk("")

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
                fileReset()

                return;
            }
            setSelectedFile(file);
            fileReset()

        }
    };

    const handleDownloadCSV = () => {
        const headers = ['Name', 'Country Code', 'Phone Number', 'Plan', 'Plan expiry date', 'Assigned RM', 'Risk Profile'];
        downloadCSV(headers, 'clients_template.csv');
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

        try {
            showToast({
                title: 'Processing CSV...',
                type: 'info',
                duration: 4000,
            });
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
                        setSelectedFile(null);
                        fileReset()
                        return;
                    }

                    // Map parsed data to EditableClient and perform client-side validation for warning screen
                    let currentValidationErrorsCount = 0;
                    const validClients: EditableClient[] = [];

                    for (const row of parsedData) {
                        let rowHasError = false;
                        const name = row['Name']?.trim();
                        const countryCode = row['Country Code']?.trim();
                        const phoneNumber = row['Phone Number']?.trim();
                        const planData = row['Plan']?.trim();
                        const planExpiryDate = row['Plan expiry date']?.trim();
                        const assignedRM = row['Assigned RM']?.trim() || 'admin@finora.com';
                        const riskProfile = row['Risk Profile']?.trim();

                        if (!name || !planData || !phoneNumber || !riskProfile) {
                            rowHasError = true;
                        }
                        if (!isValidIndianPhone(phoneNumber)) {
                            rowHasError = true;
                        }

                        if (rowHasError) {
                            currentValidationErrorsCount++;
                        }

                        const client: EditableClient = {
                            first_name: name?.split(' ')[0] || "",
                            last_name: name?.split(' ').slice(1).join(' ') || "",
                            phone_number: phoneNumber || "",
                            assigned_rm: assignedRM,
                            plan: planData?.toUpperCase() || "",
                            risk: riskProfile?.toUpperCase() || "",
                            end_date: planExpiryDate || "",
                            organisation: 1,
                            is_converted_to_client: true
                        };

                        if (!rowHasError) {
                            validClients.push(client);
                        }
                    }

                    if (currentValidationErrorsCount > 0) {
                        setValidationErrorsCount(currentValidationErrorsCount);
                        setClientsToProcess(validClients); // Store ONLY valid clients for processing
                        setUploadState('warning');
                        setSending(false);
                        setSelectedFile(null);
                        fileReset();
                        return;
                    }
                    // If no client-side validation errors, proceed to API call with valid clients
                    await processClients(validClients);
                },
                error: (error) => {
                    showToast({
                        title: "Parsing Error",
                        description: `Failed to parse CSV file: ${error.message}`,
                        type: 'error',
                        duration: 3000,
                    });
                    setSending(false);
                    setSelectedFile(null);
                    fileReset();
                }
            });

        } catch (e) {
            showToast({
                title: "Error",
                description: "Failed to process or upload CSV file.",
                type: 'error',
                duration: 3000,
            });
        }
    };

    const processClients = async (clients: EditableClient[]) => {
        setSending(true);
        try {
            showToast({
                title: 'Importing Clients...',
                type: 'info',
                duration: 4000,
            });
            const response = await bulkCreateClientsAPI(clients);

            if (response.success.length === 0) {
                setUploadState('error');
            } else {
                showToast({
                    title: "Success",
                    description: `${response.success.length} clients imported successfully.`,
                    type: 'success',
                    duration: 10000,
                });
                if (response.failed.length > 0) {
                    showToast({
                        title: "Failed",
                        description: `${response.failed.length} clients failed to import.`,
                        type: 'warning',
                        duration: 10000,
                    });
                }
                if (response.already_existing.length > 0) {
                    showToast({
                        title: "Already Existed",
                        description: `${response.already_existing.length} leads already existed.`,
                        type: 'info',
                        duration: 10000,
                    });
                }
                setOpen(false); // Close dialog on successful import
            }
        } catch (apiError) {
            showToast({
                title: "Error",
                description: "Failed to import leads via API. Check console for details.",
                type: 'error',
                duration: 3000,
            });
            console.error("Bulk Import API Error:", apiError);
            setUploadState('error'); // Show error screen on API failure
        } finally {
            setSelectedFile(null);
            setSending(false);
            fileReset();
            refreshClients();
        }
    };

    const handleBackFromWarning = () => {
        setUploadState('initial');
        setClientsToProcess([]);
        setValidationErrorsCount(0);
        setSelectedFile(null);
        fileReset();
    };

    const handleProceedFromWarning = async () => {
        // Do NOT reset UI state to 'initial' here. Keep 'warning' until API response.
        await processClients(clientsToProcess);
    };

    const handleOkFromError = () => {
        setOpen(false); // Close the dialog
        setUploadState('initial');
        setClientsToProcess([]);
        setValidationErrorsCount(0);
        setSelectedFile(null);
        fileReset();
    };

    const handleBackFromError = () => {
        setUploadState('initial');
        setClientsToProcess([]);
        setValidationErrorsCount(0);
        setSelectedFile(null);
        fileReset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl w-3xl p-0 overflow-hidden rounded-xl">
                <DialogHeader className="border-b border-[#e4e7ec] px-6 py-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-md font-medium text-[#101828]">Add clients(s)</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto bg-white p-0 border-b border-[#e4e7ec] rounded-none">
                        <TabsTrigger value="manual" className="rounded-none border-b-1.5 border-transparent data-[state=active]:border-b-[#7f56d9] data-[state=active]:shadow-none text-sm font-sm text-[#667085] data-[state=active]:text-[#7f56d9] py-3">Manual</TabsTrigger>
                        <TabsTrigger value="bulk" className="rounded-none border-b-1.5 border-transparent data-[state=active]:border-b-[#7f56d9] data-[state=active]:shadow-none text-sm font-sm text-[#667085] data-[state=active]:text-[#7f56d9] py-3">Bulk</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual" className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4 ">
                            <div>
                                <Label htmlFor="first-name" className="text-sm font-medium text-[#344054] mb-1 block">Name <span className="text-red-500">*</span></Label>
                                <Input id="first-name" placeholder="Name" className="h-10 border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="phone-number" className="text-sm font-medium text-[#344054] mb-1 block">Phone number <span className="text-red-500">*</span></Label>
                                <div className="flex">
                                    <Select value="+91" onValueChange={setCountryCode}>
                                        <SelectTrigger className="w-[103px] !h-10 gap-0 rounded-r-none border-r-0 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                            <SelectValue>IND (+91)</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="+91">IND (+91)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input type="number"
                                        id="phone-number" maxLength={10} placeholder="9876543210" className="flex-1 h-10 rounded-l-none border-[#d0d5dd] focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-1.5 ">
                                <Label className="text-sm text-[#344054]">Selected plan <span className="text-red-500">*</span></Label>
                                <Select open={isPlanSelectedSelectOpen} onOpenChange={setIsPlanSelectedSelectOpen} value={plan} onValueChange={setPlan}>
                                    <SelectTrigger className="h-10 rounded-md border-[#e4e7ec] w-full"><SelectValue placeholder="Elite" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STANDARD">Standard</SelectItem>
                                        <SelectItem value="PREMIUM">Premium</SelectItem>
                                        <SelectItem value="ELITE">Elite</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5 relative">
                                <Label className="text-sm text-[#344054]">DOB <span className="text-red-500">*</span></Label>
                                <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder={`      yyyy-mm-dd`} className="h-10 rounded-md border-[#e4e7ec]" />
                                {date === '' && <Calendar className="absolute left-3 top-20/38 text-gray-400 size-4" />}
                            </div>


                        </div>

                        <div className="flex flex-row gap-4 justify-between w-full">
                            <div className="space-y-1 w-full">
                                <Label htmlFor="assigned-rm" className="text-sm font-medium text-[#344054] block">Assigned RM</Label>
                                <Select defaultValue="admin@finora.com" onValueChange={setAssigned_RM}>
                                    <SelectTrigger className="w-full h-10 border-[#d0d5dd] focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="Select RM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin@finora.com">admin@finora.com</SelectItem>
                                        <SelectItem value="samir@gmail.com">samir@gmail.com</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-sm text-[#344054]">Risk <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Button type="button" variant={risk === 'CONSERVATIVE' ? 'default' : 'outline'} onClick={() => setRisk('CONSERVATIVE')}>Conservative</Button>
                                    <Button type="button" variant={risk === 'HIGH' ? 'default' : 'outline'} onClick={() => setRisk('HIGH')}>High</Button>
                                    <Button type="button" variant={risk === 'AGGRESSIVE' ? 'default' : 'outline'} onClick={() => setRisk('AGGRESSIVE')}>Aggressive</Button>
                                </div>
                            </div>
                        </div>


                        <div className="border-t border-[#e4e7ec] px-6 -mb-2 pt-6  flex flex-col gap-4 items-center justify-between">
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
                        {uploadState === 'initial' && (
                            <>
                                <div className="rounded-lg border border-[#e4e7ec] bg-[#fcfcfd] p-5 space-y-2">
                                    <h3 className="text-md font-medium text-[#101828]">Instructions</h3>
                                    <p className="text-sm text-[#667085]">Drop a csv file with the following columns -</p>
                                    <ol className="list-decimal list-inside text-sm text-[#667085] space-y-1">
                                        <li><span className="font-semibold">Name *</span> - name of the client</li>
                                        <li><span className="font-semibold">Country code *</span> - country code if the client is outside; leave blank for Indian numbers</li>
                                        <li><span className="font-semibold">Phone number *</span> - add client's valid whatsapp number</li>
                                        <li><span className="font-semibold">Plan *</span> - write the plan subscribed which exactly matches your plans added in the plans page</li>
                                        <li><span className="font-semibold">Plan expiry date </span>write when plan expires in YYYY/MM/DD format; a day of 30 days from today will be added if left blank</li>
                                        <li><span className="font-semibold">Assigned RM</span> - write name of RM which exactly matches the name added by you in the employee page; Admin's name will be added if left blank.</li>
                                        <li><span className="font-semibold">Risk Profile *</span>- Choose one of the three options from "conservative", "high", "aggressive"</li>
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
                            </>
                        )}

                        {uploadState === 'warning' && (
                            <div className="pt-1 px-3 space-y-2 text-left">
                                <div className="flex justify-left">
                                    <CheckCircle2 className="h-12 w-12 p-3 text-[#f79009] w-fill bg-orange-100 rounded-full" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#101828]">Add valid entries only?</h3>
                                <p className="text-sm text-[#667085]">
                                    Some rows were not added due to either or both of the reasons stated below -
                                </p>
                                <ol className="list-decimal list-inside text-sm text-[#667085] space-y-1 text-left">
                                    <li>Missing/invalid information in the required fields</li>
                                    <li>Rows with the same phone number already existed.</li>
                                </ol>
                                <p className="text-sm text-[#667085] pb-8">
                                    On proceeding, only rows passing these conditions will be added.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        onClick={handleProceedFromWarning}
                                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                                    >
                                        Proceed
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleBackFromWarning}
                                        variant="outline"
                                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]"
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}

                        {uploadState === 'error' && (
                            <div className="pt-0 px-3 space-y-2 text-left">
                                <div className="flex justify-left">
                                    <XCircle className="h-12 w-12 text-[#f04438] rounded-full bg-red-100 p-3" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#101828]">Upload failed!</h3>
                                <p className="text-sm text-[#667085]">
                                    All rows failed to add due to either or both of the reasons stated below -
                                </p>
                                <ol className="list-decimal list-inside text-sm text-[#667085] space-y-1 text-left">
                                    <li>Missing/invalid information in the required fields</li>
                                    <li>Rows with the same phone number already existed.</li>
                                </ol>
                                <p className="text-sm text-[#667085] pb-8">
                                    Check the uploaded csv file and retry again
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        onClick={handleOkFromError}
                                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleBackFromError}
                                        variant="outline"
                                        className="h-10 w-full px-4 py-2 justify-center gap-2 rounded-lg border border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb]"
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
