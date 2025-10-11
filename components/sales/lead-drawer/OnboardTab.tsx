"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // <-- import datepicker
import { parseISO } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLeadDrawer } from "@/contexts/LeadDrawerContext";
import { useContractSigning } from "@/hooks/useContractSigning";
import { showToast } from "@/components/ui/toast-manager";
import ContractUploader from "@/components/contracts/ContractUploader";
import SigningActions from "@/components/contracts/SigningActions";
import SigningStatus from "@/components/contracts/SigningStatus";
import { getPlansAPI, PlanType } from "@/services/plan";
import { getNextRenewalDate, renewalPeriodMap } from "@/utils/date";
import type { SubscriptionType } from "@/constants/types";

import "react-datepicker/dist/react-datepicker.css"; // import CSS for datepicker

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
  } = useLeadDrawer();

  const {
    isUploading,
    isRefreshing,
    uploadContract,
    copySigningLink,
    refreshSigningStatus,
    viewSignedDocument,
    resetContract,
  } = useContractSigning();

  const [isPlanSelectedSelectOpen, setIsPlanSelectedSelectOpen] =
    React.useState(false);
  const [isRiskProfileSelectOpen, setIsRiskProfileSelectOpen] =
    React.useState(false);
  const [plans, setPlans] = useState<PlanType[]>([]);

  // Parse dob string to Date for DatePicker initial value
  const dobDate = dob ? parseISO(dob) : null;

  useEffect(() => {
    async function fetchPlans() {
      try {
        const fetchedPlans = await getPlansAPI();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        showToast({
          title: "Error",
          description: "Failed to load plans. Please try again later.",
          type: "error",
        });
      }
    }
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plan && plans.length > 0) {
      const selectedPlan = plans.find((p) => p.name === plan);
      if (selectedPlan && selectedPlan.renewal_period) {
        const mappedRenewal = renewalPeriodMap[selectedPlan.renewal_period];
        setRenewal(mappedRenewal);
      } else {
        setRenewal("Monthly");
      }
    } else {
      setRenewal("Monthly");
    }
  }, [plan, plans, setRenewal]);

  const isPlanDetailsValid = () => {
    return (
      plan &&
      plan.trim() !== "" &&
      riskProfile &&
      riskProfile.trim() !== "" &&
      pan &&
      pan.trim() !== "" &&
      dob &&
      dob.trim() !== ""
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!client?.id) {
      showToast({
        title: "Error",
        description: "Client ID is required",
        type: "error",
      });
      return;
    }
    await uploadContract(file, client.id);
  };

  const handleSendForSigning = () => {
    showToast({
      title: "Sent for Signing",
      description: "Contract has been sent for client signature",
      type: "success",
    });
  };

  React.useEffect(() => {
    resetContract();
  }, [client?.id, resetContract]);

  // --- Here is the updated handler that saves subscription data to backend ---

  return (
    <div className="space-y-6 px-5 py-5">
      {/* Contract Upload Section */}
      <ContractUploader
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadedFileUrl={client?.original_document_url}
        disabled={sending}
      />

      {/* Signing Actions */}
      {client?.setu_signature_status && (
        <SigningActions
          client={client}
          isRefreshing={isRefreshing}
          onSendForSigning={handleSendForSigning}
          onCopyLink={copySigningLink}
          onRefreshStatus={refreshSigningStatus}
          onViewDocument={viewSignedDocument}
        />
      )}

      {/* Signing Status */}
      {client?.setu_signature_status && <SigningStatus client={client} />}

      {/* Plan Details */}
      <div className="rounded-lg border border-[#e4e7ec] p-4">
        <div className="mb-3 text-sm font-medium text-[#344054]">
          Client details
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Risk Profile Select */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">
              Risk profile <span className="text-red-500">*</span>
            </Label>
            <Select
              open={isRiskProfileSelectOpen}
              onOpenChange={setIsRiskProfileSelectOpen}
              value={riskProfile}
              onValueChange={setRiskProfile}
              disabled={sending}
            >
              <SelectTrigger className="h-10 rounded-md border-[#e4e7ec] w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONSERVATIVE">Conservative</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="AGGRESSIVE">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PAN Input */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">
              PAN <span className="text-red-500">*</span>
            </Label>
            <Input
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              className="h-10 rounded-md border-[#e4e7ec]"
              disabled={sending}
            />
          </div>

          {/* DOB DatePicker */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">
              DOB <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              selected={dobDate}
              onChange={(date) => {
                if (date instanceof Date && !isNaN(date.getTime())) {
                  setDob(date.toISOString().slice(0, 10));
                } else {
                  setDob("");
                }
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
              className="h-10 rounded-md border border-[#e4e7ec] w-full px-3"
              disabled={sending}
              maxDate={new Date()} // cannot pick future DOB
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleEditClientSubmit}
            disabled={
              sending ||
              (disposition === "" &&
                client?.lead_stage === stage &&
                text === "")
            }
          >
            {sending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Payment Section */}
      <div className="rounded-lg border border-[#e4e7ec] p-4">
        <div className="mb-3 text-sm font-medium text-[#344054]">
          Suscription & Payment
        </div>
        <div className="rounded-lg border border-[#e4e7ec] p-4">
          {/* Plan Select */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[#344054]">
              Selected plan <span className="text-red-500">*</span>
            </Label>

            <Select
              open={isPlanSelectedSelectOpen}
              onOpenChange={setIsPlanSelectedSelectOpen}
              value={plan}
              onValueChange={setPlan}
              disabled={sending}
            >
              <SelectTrigger className="h-10 rounded-md border-[#e4e7ec] w-full">
                {/* Show selected plan name or placeholder */}
                <SelectValue>
                  {plan
                    ? plans.find((p) => String(p.id) === plan)?.name
                    : "Select a plan"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {plans.length === 0 ? (
                  <SelectItem value="loading" disabled>
                    Loading plans...
                  </SelectItem>
                ) : (
                  plans.map((planItem) => (
                    <SelectItem key={planItem.id} value={String(planItem.id)}>
                      {planItem.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 mt-4">
              <Label className="text-sm text-[#344054]">
                Amount received <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]">
                  ₹
                </span>
                <Input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setAmount("");
                      return;
                    }
                    if (/^\d+$/.test(val)) {
                      setAmount(val);
                    } else {
                      showToast({
                        title: "Warning",
                        description: "Please type Amount in correct format",
                        type: "warning",
                        duration: 4000,
                      });
                    }
                  }}
                  className="h-10 rounded-md border-[#e4e7ec] pl-7"
                />
              </div>
            </div>
            {/* Renewal Frequency (read-only) */}
            <div className="mt-4 space-y-1.5">
              <Label className="text-sm text-[#344054]">
                Renewal frequency
              </Label>
              <Input
                value={renewal || ""}
                disabled
                className="h-10 rounded-md border-[#e4e7ec]"
                placeholder="Selected plan renewal period"
              />
              {renewal && (
                <p className="mt-1 text-sm text-gray-600">
                  Next renewal date:{" "}
                  <strong>{getNextRenewalDate(renewal)}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add to Clients Button */}
      <div className="border-t border-[#e4e7ec] pt-4">
        <Button
          className="w-full"
          onClick={() => handleAddToClientsSubmit(plans)}
          disabled={sending || !isPlanDetailsValid()}
        >
          {sending ? "Sending..." : "Add to clients"}
        </Button>
      </div>
    </div>
  );
}
