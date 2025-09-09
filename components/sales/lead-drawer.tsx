"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Phone, Mail, PencilLine, Bold, Italic, Heading, Quote, List, ListOrdered, CalendarIcon } from 'lucide-react'
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react"
import * as SelectPrimitive from '@radix-ui/react-select';
import EditLead from "./edit-lead"
import { uploadFileAPI } from "@/services/upload"
import { showToast } from "../ui/toast-manager"
import {ClientType, EditableClient, LeadStage, Profile, SubscriptionType} from "@/constants/types"
import { editLeadAPI } from "@/services/clients"
import { title } from "process"
import { createSubscriptionAPI } from "@/services/subscription"



export type Lead = {
  id: string
  name: string
  phone?: string
  email?: string
  stage: LeadStage
  profile: Profile
}

export default function LeadDrawer({
  open,
  onOpenChange,
  lead,
  client,
  refreshClients
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null,
  client: ClientType,
  refreshClients: () => void
}) {
  const [tab, setTab] = useState("details")
  const [stage, setStage] = useState<LeadStage>(client?.lead_stage ?? "LEAD")
  const [disposition, setDisposition] = React.useState<string>("")
  const [plan, setPlan] = useState<string>("")
  // State for controlling select dropdowns
  const [isStageSelectOpen, setIsStageSelectOpen] = useState(false);
  const [isDispositionSelectOpen, setIsDispositionSelectOpen] = useState(false);
  const [isPlanInterestedSelectOpen, setIsPlanInterestedSelectOpen] = useState(false);
  const [isPlanSelectedSelectOpen, setIsPlanSelectedSelectOpen] = useState(false);
  const [isRiskProfileSelectOpen, setIsRiskProfileSelectOpen] = useState(false);
  // Onboard tab state
  const [contractUrl, setContractUrl] = React.useState<string | null>(null)
  const [contractName, setContractName] = React.useState<string | null>(null)
  const [file, setFile] = useState<File | Blob>()
  const [riskProfile, setRiskProfile] = React.useState<string>("")
  const [pan, setPan] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [renewal, setRenewal] = useState<"Weekly" | "Monthly" | "Quarterly">("Monthly")
  const [date, setDate] = useState<string>();
  const [editClient, setEditClient] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)
  const [text, setText] = useState<string>('')

  React.useEffect(() => {
    // Reset when a different lead opens
    setTab("details")
    setStage(client.lead_stage ?? "LEAD")
    setDisposition(client.profile ?? '')
    setPlan(client.plan ?? '')
    setDate(client.end_date ?? '')
    setContractUrl(null)
    setContractName(client.signed_contract_url ?? '')
    setRiskProfile(client.risk ?? '')
    setPan(client.pancard ?? '')
    setAmount("")
    setText(client.notes ?? '')
    setRenewal("Monthly")
  }, [lead?.id, open, client])

  // If user sets stage to documenting, auto-focus the Onboard tab
  useEffect(() => {
    if (stage === "DOCUMENTED") {
      setTab("onboard")
    }
  }, [stage])


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

  function isValidPositiveInteger(value: string): boolean {
    return /^[1-9]\d*$/.test(value.trim());
  }

  const getNextRenewalDate = (): string => {
    const now = new Date();
    if (renewal === "Weekly") now.setDate(now.getDate() + 7);
    else now.setMonth(now.getMonth() + (renewal === "Monthly" ? 1 : 3));
    return now.toISOString().split("T")[0];
  };

  const isValidPAN = (pan: string): boolean => {
    const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return pattern.test(pan.trim().toUpperCase());
  }

  async function handleEditClientSubmit() {
    if (!lead?.id) {
      showToast({
        title: "Error",
        description: "Client ID missing",
        type: 'error'
      })
      return
    }

    const editableClient: EditableClient = {
      ...(text != client.notes ? { notes: text } : {}),
      ...(disposition && Object.keys(disposition).length ? { profile: disposition } : {}),
      ...(plan && Object.keys(plan).length ? { plan: plan } : {}),
      lead_stage: stage
    };

    setSending(true)

    try {
      const response = await editLeadAPI(editableClient, lead.id)
      showToast({
        title: 'Success',
        description: "Lead successfully edited",
        type: 'success'
      })
      refreshClients();
    } catch (e) {
      showToast({
        title: 'Error',
        description: "An error has occured",
        type: 'warning'
      })
      return
    }
    finally {
      setSending(false)
    }
  }

  async function handleAddToClientsSubmit() {

    if (!lead) {
      showToast({
        title: "Error",
        description: "Lead not found",
        type: 'error'
      })
      return
    }
    if (!file) {
      showToast({
        title: "No file selected",
        description: "Please Select a file",
        type: 'warning'
      })
      return

    }
    if (!riskProfile) {
      showToast({
        title: "Missing Risk Profile",
        description: "Please select a risk profile before proceeding.",
        type: "warning",
      })
      return
    }

    if (!pan) {
      showToast({
        title: "Missing PAN",
        description: "Please enter a valid PAN number.",
        type: "warning",
      })
      return
    } else {
      const validPan = isValidPAN(pan);
      if (!validPan) {
        showToast({
          title: "Incorrect PAN format",
          description: "Please enter a valid PAN number.",
          type: "warning",
        })
        return
      }
    }


    if (!amount) {
      showToast({
        title: "Missing Investment Amount",
        description: "Please specify the amount you wish to invest.",
        type: "warning",
      })
      return
    }
    else {
      const validAmount = isValidPositiveInteger(amount)
      if (!validAmount) {
        showToast({
          title: 'Warning',
          description: 'Please enter correct amount format',
          type: 'warning'
        })
        return
      }

    }

    if (!plan) {
      showToast({
        title: "Missing Plan Selection",
        description: "Please choose an investment plan.",
        type: "warning",
      })
      return
    }

    if (!date) {
      showToast({
        title: "Missing DOB",
        description: "Please select a start date for your investment.",
        type: "warning",
      })
      return
    }
    if (!isValidDate(date)) {
      showToast({
        title: "Error in DOB",
        description: "Invalid date format or out-of-range values.",
        type: "error",
      })
      return
    }
    setSending(true)

    try {

      // file upload
      const upload = await uploadFileAPI(file, 'invoice')
      showToast({
        title: "Success",
        description: "You file has been uploaded",
        type: "success"
      })

      // Client Update
      const editedClient: EditableClient = {
        signed_contract_url: upload.signed_url,
        pancard: pan,
        start_date: `${new Date().toISOString().split('T')[0]}T00:00:00Z`,
        risk: riskProfile,
        plan: plan,
        is_converted_to_client: true,
        lead_stage: stage
      }
      const updateClient = await editLeadAPI(editedClient, client.id)
      showToast({
        title: "Success",
        description: "Client has been updated",
        type: "success"
      })

      //subscription
      const subscription: SubscriptionType = {
        plan: '1',
        client: client.id,
        created_by: client.assigned_rm.id,
        start_date: new Date().toISOString().split('T')[0],
        end_date: getNextRenewalDate(),
        amount_paid: amount,
        client_email: client.email,
        plan_name: plan + " " + renewal
      }
      console.log('subscriptiontype ', subscription)
      const subscriptionResponse = await createSubscriptionAPI(subscription)
      showToast({
        title: "Success",
        description: "Subscription started",
        type: "success"
      })
    } catch (e) {
      console.log(e)
      showToast({
        title: "Error",
        description: "An error has occured",
        type: "error"
      })
    } finally {
      refreshClients();
      setSending(false)
      onOpenChange(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          // When the sheet is closing, close all selects
          setIsStageSelectOpen(false);
          setIsDispositionSelectOpen(false);
          setIsPlanInterestedSelectOpen(false);
          setIsPlanSelectedSelectOpen(false);
          setIsRiskProfileSelectOpen(false);
        }
        onOpenChange(o);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e7ec] px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate max-w-[220px] text-[18px] font-semibold text-[#101828]">
                {(client?.first_name || client?.last_name)
                  ? `${client?.first_name ?? ''} ${client?.last_name ?? ''}`.trim()
                  : 'Lead Name'}
              </SheetTitle>
              <button onClick={() => setEditClient(true)} className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]" aria-label="Edit name">
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
                <span className="truncate">{client?.email ?? "liam.anderson@email.com"}</span>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <Label className="mb-1 block text-xs text-[#667085]">Stage</Label>
            <Select open={isStageSelectOpen} onOpenChange={setIsStageSelectOpen} value={stage} onValueChange={(v) => { setStage(v as Lead["stage"]) }}>
              <SelectTrigger className="w-[200px] h-9 rounded-md border-[#e4e7ec]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEAD">Lead</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="DOCUMENTED">Documented</SelectItem>
                <SelectItem value="AWAITING_PAYMENT">Awaiting payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs with content */}
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-[#e4e7ec] px-5 pt-2">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="chat" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Chat</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Details</TabsTrigger>
              <TabsTrigger value="onboard" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Onboard</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto">

            {/* Chat */}
            <TabsContent value="chat" className="px-5 py-5">
              <div className="text-sm text-[#667085]">Chat coming soon.</div>
            </TabsContent>

            {/* Details */}
            <TabsContent value="details" className="space-y-5 px-5 py-5 h-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-[#344054]">Lead disposition</Label>
                  <Select open={isDispositionSelectOpen} onOpenChange={setIsDispositionSelectOpen} value={disposition} onValueChange={setDisposition}>
                    <SelectTrigger className="h-10 w-full rounded-md border-[#e4e7ec]"><SelectValue placeholder="Select one" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT">Hot</SelectItem>
                      <SelectItem value="WARM">Warm</SelectItem>
                      <SelectItem value="COLD">Cold</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                      <SelectItem value="DND">DND</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notepad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-[#344054]">Notepad</Label>
                </div>
                <div className="rounded-lg border border-[#e4e7ec]">
                  <textarea
                    value={text} onChange={e => setText(e.target.value)}
                    placeholder="Start typing"
                    className="w-full h-[200px] resize-none rounded-t-lg border-0 bg-[#f9fafb] p-3 text-sm text-[#101828] outline-none"
                  />
                  <div className="flex items-center gap-3 border-t border-[#e4e7ec] bg-[#f9fafb] px-3 py-2 text-[#667085]">
                    <ToolbarBtn icon={<Bold className="h-4 w-4" />} label="Bold" />
                    <ToolbarBtn icon={<Italic className="h-4 w-4" />} label="Italic" />
                    <ToolbarBtn icon={<Heading className="h-4 w-4" />} label="Heading" />
                    <ToolbarBtn icon={<Quote className="h-4 w-4" />} label="Quote" />
                    <ToolbarBtn icon={<List className="h-4 w-4" />} label="Bulleted list" />
                    <ToolbarBtn icon={<ListOrdered className="h-4 w-4" />} label="Numbered list" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Onboard */}
            <TabsContent value="onboard" className="space-y-6 px-5 py-5">
              {/* Contract signing */}
              <div>
                <div className="mb-2 text-sm font-medium text-[#344054]">Contract <span className="text-red-500">*</span></div>
                <FileUpload
                  label=""
                  required
                  accept="application/pdf"
                  maxSize="20MB"
                  value={contractUrl}
                  fileName={contractName ?? undefined}
                  fileSize=""
                  showPreview={false}
                  onFileSelect={(file) => {
                    setContractName(file.name)
                    // For preview-less PDFs, we just store a temporary object URL
                    const url = URL.createObjectURL(file)
                    setContractUrl(url)
                    setFile(file)
                  }}
                  onFileDelete={() => {
                    setContractUrl(null)
                    setContractName(null)
                  }}
                />
              </div>

              {/* Plan details */}
              <div className="rounded-lg border border-[#e4e7ec] p-4">
                <div className="mb-3 text-sm font-medium text-[#344054]">Plan details</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <div className="space-y-1.5">
                    <Label className="text-sm text-[#344054]">Risk profile <span className="text-red-500">*</span></Label>
                    <Select open={isRiskProfileSelectOpen} onOpenChange={setIsRiskProfileSelectOpen} value={riskProfile} onValueChange={setRiskProfile}>
                      <SelectTrigger className="h-10 rounded-md border-[#e4e7ec] w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONSERVATIVE">Conservative</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="AGGRESSIVE">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-[#344054]">PAN <span className="text-red-500">*</span></Label>
                    <Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" className="h-10 rounded-md border-[#e4e7ec]" />
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <Label className="text-sm text-[#344054]">DOB <span className="text-red-500">*</span></Label>
                    <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="yyyy-mm-dd" className="h-10 rounded-md border-[#e4e7ec]" />
                  </div>

                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleEditClientSubmit}
                    disabled={sending || (disposition == '' && plan == '' && client?.lead_stage == stage && text == '')}
                  >
                    {sending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-lg border border-[#e4e7ec] p-4">
                <div className="mb-3 text-sm font-medium text-[#344054]">Payment</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-[#344054]">Amount received <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]">₹</span>
                      <Input type="number" min={1} value={amount} onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setAmount('');
                          return;
                        }
                        if (/^\d+$/.test(val)) {
                          setAmount(val);
                        } else {
                          showToast({
                            title: 'Warning',
                            description: "Please type Amount in correct format",
                            type: 'warning',
                            duration: 4000
                          })
                        }
                      }} placeholder="" className="h-10 rounded-md border-[#e4e7ec] pl-7" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-[#344054]">Renewal frequency <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <Button type="button" variant={renewal === 'Weekly' ? 'default' : 'outline'} onClick={() => setRenewal('Weekly')}>Weekly</Button>
                      <Button type="button" variant={renewal === 'Monthly' ? 'default' : 'outline'} onClick={() => setRenewal('Monthly')}>Monthly</Button>
                      <Button type="button" variant={renewal === 'Quarterly' ? 'default' : 'outline'} onClick={() => setRenewal('Quarterly')}>Quarterly</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e4e7ec] pt-4">
                <Button
                  className="w-full"
                  onClick={handleAddToClientsSubmit}
                  disabled={
                    sending
                  }
                >
                  {sending ? 'Sending...' : ' Add to clients'}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        <EditLead id={lead?.id} client={client} open={editClient} setOpen={setEditClient} refreshClients={refreshClients} />

      </SheetContent>
    </Sheet>
  )
}

function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-md p-1.5 hover:bg-[#eef2f6]"
    >
      {icon}
    </button>
  )
}
