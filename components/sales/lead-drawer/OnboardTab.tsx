"use client"

import React from "react"
import FileUpload from "@/components/file-upload"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLeadDrawer } from "@/contexts/LeadDrawerContext"
import { showToast } from "@/components/ui/toast-manager"

export default function OnboardTab() {
  const {
    contractUrl,
    setContractUrl,
    contractName,
    setContractName,
    setFile,
    plan,
    setPlan,
    riskProfile,
    setRiskProfile,
    pan,
    setPan,
    dob,
    setDob,
    sending,
    disposition,
    client,
    stage,
    text,
    amount,
    setAmount,
    renewal,
    setRenewal,
    handleEditClientSubmit,
    handleAddToClientsSubmit,
  } = useLeadDrawer()

  const [isPlanSelectedSelectOpen, setIsPlanSelectedSelectOpen] = React.useState(false)
  const [isRiskProfileSelectOpen, setIsRiskProfileSelectOpen] = React.useState(false)

  // Validation function for Plan Details fields
  const isPlanDetailsValid = () => {
    return plan && plan.trim() !== '' && 
           riskProfile && riskProfile.trim() !== '' && 
           pan && pan.trim() !== '' && 
           dob && dob.trim() !== ''
  }

  return (
    <div className="space-y-6 px-5 py-5">
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
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">DOB <span className="text-red-500">*</span></Label>
            <Input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="yyyy-mm-dd" className="h-10 rounded-md border-[#e4e7ec]" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleEditClientSubmit} disabled={sending || !isPlanDetailsValid() || (disposition == '' && plan == '' && client?.lead_stage == stage && text == '')}>
            {sending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-[#e4e7ec] p-4">
        <div className="mb-3 text-sm font-medium text-[#344054]">Payment</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">Amount received <span className="text-red-500">*</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]">₹</span>
              <Input type="number" min={1} value={amount} onChange={(e) => {
                const val = e.target.value
                if (val === '') { setAmount(''); return }
                if (/^\d+$/.test(val)) {
                  setAmount(val)
                } else {
                  showToast({ title: 'Warning', description: 'Please type Amount in correct format', type: 'warning', duration: 4000 })
                }
              }} className="h-10 rounded-md border-[#e4e7ec] pl-7" />
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
        <Button className="w-full" onClick={handleAddToClientsSubmit} disabled={sending || !isPlanDetailsValid()}>
          {sending ? 'Sending...' : 'Add to clients'}
        </Button>
      </div>
    </div>
  )
}
