"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLeadDrawer } from "@/contexts/LeadDrawerContext"
import { useContractSigning } from "@/hooks/useContractSigning"
import { showToast } from "@/components/ui/toast-manager"
import ContractUploader from "@/components/contracts/ContractUploader"
import SigningActions from "@/components/contracts/SigningActions"
import SigningStatus from "@/components/contracts/SigningStatus"

export default function OnboardTab() {
  const {
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

  const {
    isUploading,
    isRefreshing,
    contractData,
    uploadedFile,
    uploadContract,
    refreshSigningStatus,
    copySigningLink,
    viewSignedDocument,
    resetContract
  } = useContractSigning()

  const [isPlanSelectedSelectOpen, setIsPlanSelectedSelectOpen] = React.useState(false)
  const [isRiskProfileSelectOpen, setIsRiskProfileSelectOpen] = React.useState(false)

  // Validation function for Plan Details fields
  const isPlanDetailsValid = () => {
    return plan && plan.trim() !== '' && 
           riskProfile && riskProfile.trim() !== '' && 
           pan && pan.trim() !== '' && 
           dob && dob.trim() !== ''
  }

  const handleFileUpload = async (file: File) => {
    if (!client.id) {
      showToast({ title: 'Error', description: 'Client ID is required', type: 'error' })
      return
    }
    await uploadContract(file, client.id)
  }

  const handleSendForSigning = () => {
    // The contract upload already initiates signing, so we just need to show success
    showToast({ 
      title: 'Sent for Signing', 
      description: 'Contract has been sent for client signature', 
      type: 'success' 
    })
  }

  // Reset contract data when client changes
  React.useEffect(() => {
    resetContract()
  }, [client.id, resetContract])

  return (
    <div className="space-y-6 px-5 py-5">
      {/* Contract Upload Section */}
      <ContractUploader
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadedFileUrl={client?.original_document_url}
        disabled={sending}
      />

      {/* Signing Actions - Show when client has signing data or after upload */}
      {(client.setu_signature_status) && (
        <SigningActions
          client={client}
          isRefreshing={isRefreshing}
          onSendForSigning={handleSendForSigning}
          onCopyLink={copySigningLink}
          onRefreshStatus={refreshSigningStatus}
          onViewDocument={viewSignedDocument}
        />
      )}

      {/* Signing Status Progress - Show when client has signing data or after upload */}
      {(client.setu_signature_status) && (
        <SigningStatus client={client} />
      )}

      {/* Plan Details Section */}
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

      {/* Payment Section */}
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

      {/* Add to Clients Button */}
      <div className="border-t border-[#e4e7ec] pt-4">
        <Button className="w-full" onClick={handleAddToClientsSubmit} disabled={sending || !isPlanDetailsValid()}>
          {sending ? 'Sending...' : 'Add to clients'}
        </Button>
      </div>
    </div>
  )
}
