"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ClientType,
  EditableClient,
  SubscriptionType,
} from "@/constants/types";
import { showToast } from "../ui/toast-manager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editCientAPI } from "@/services/clients";
import { createSubscriptionAPI } from "@/services/subscription";
import { getCurrentSubscriptionFromList } from "@/lib/getCurrentSubscriptionFromList";
import { getPlansAPI, PlanType } from "@/services/plan";

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
  refreshClients,
}: RenewalConfirmationDialogProps) {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [sending, setSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [editedPlanName, setEditedPlanName] = useState<string>("");
  const [editedAmount, setEditedAmount] = useState<string>("");
  const [editedPeriod, setEditedPeriod] = useState<string>("");

  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionType | null>(null);

  // Load plans on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        const fetched = await getPlansAPI();
        setPlans(fetched);
      } catch (err) {
        console.error("Error fetching plans:", err);
        showToast({
          title: "Error",
          description: "Could not load plans",
          type: "error",
        });
      }
    }
    fetchPlans();
  }, []);

  // Whenever subscriptionList or plans change, derive current subscription and set defaults
  useEffect(() => {
    const current = getCurrentSubscriptionFromList(subscriptionList);
    setCurrentSubscription(current);

    if (subscriptionList.length > 0) {
      const latest = subscriptionList[0];
      setEditedAmount(String(latest.amount_paid ?? "0"));
      setEditedPlanName(latest.plan_name ?? "");

      // Try find matching plan by name
      const matching = plans.find((p) => p.name === latest.plan_name);
      if (matching) {
        setSelectedPlanId(String(matching.id));
        setEditedPeriod(matching.renewal_period ?? "");
      } else {
        // fallback if no match
        setEditedPeriod(latest.plan_name?.split(" ")[1] || "");
      }
    }
  }, [subscriptionList, plans]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    if (!planId) {
      setEditedPeriod("");
      setEditedPlanName("");
      return;
    }
    const planObj = plans.find((p) => String(p.id) === planId);
    if (planObj) {
      setEditedPeriod(planObj.renewal_period || "");
      setEditedPlanName(planObj.name);
    } else {
      setEditedPeriod("");
      setEditedPlanName("");
    }
  };

  const getFutureDate = (
    interval?: string | null,
    startDate?: string | Date | null
  ): string => {
    const normalized = interval?.toLowerCase() ?? "weekly";
    const daysToAdd =
      {
        weekly: 7,
        monthly: 30,
        quarterly: 90,
        yearly: 365,
      }[normalized] ?? 7;

    const future = startDate ? new Date(startDate) : new Date();
    future.setUTCDate(future.getUTCDate() + daysToAdd);
    future.setUTCHours(0, 0, 0, 0);

    return future.toISOString().slice(0, 10);
  };

  const isValidSubscription = (
    sub: Partial<SubscriptionType>
  ): sub is SubscriptionType => {
    let ok = true;
    if (typeof sub.plan !== "string") {
      ok = false;
    }
    if (typeof sub.created_by !== "string") {
      ok = false;
    }
    if (typeof sub.client !== "string") {
      ok = false;
    }
    if (typeof sub.start_date !== "string") {
      ok = false;
    }
    if (typeof sub.end_date !== "string") {
      ok = false;
    }
    if (
      !(
        typeof sub.amount_paid === "string" ||
        typeof sub.amount_paid === "number"
      )
    ) {
      ok = false;
    }
    if (typeof sub.client_email !== "string") {
      ok = false;
    }
    if (typeof sub.plan_name !== "string") {
      ok = false;
    }
    return ok;
  };

  const handleConfirmRenewal = async () => {
    setSending(true);

    const latest = subscriptionList[0];
    const futurePlan = !!currentSubscription;

    const latestEndDateValid =
      latest?.end_date && !isNaN(Date.parse(latest.end_date))
        ? latest.end_date
        : null;

    const startDate = latestEndDateValid
      ? new Date(new Date(latestEndDateValid).getTime() + 86400000)
          .toISOString()
          .slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const endDate = getFutureDate(editedPeriod, startDate);

    const chosenPlan = plans.find((p) => String(p.id) === selectedPlanId);
    if (!chosenPlan) {
      showToast({
        title: "Error",
        description: "Please select a valid plan",
        type: "error",
      });
      setSending(false);
      return;
    }

    const payload: SubscriptionType = {
      plan: String(chosenPlan.id),
      created_by: String(client.assigned_rm?.id ?? ""),
      client: String(client.id),
      start_date: startDate,
      end_date: endDate,
      amount_paid: editedAmount,
      client_email: String(client.email),
      plan_name: chosenPlan.name,
      plan_type: chosenPlan.type ?? "",
      is_active: !futurePlan,
    };

    if (!isValidSubscription(payload)) {
      setSending(false);
      return;
    }

    try {
      await createSubscriptionAPI(payload);

      showToast({
        title: "Success",
        description: `Subscription created${futurePlan ? " (future)" : ""}`,
        type: "success",
      });

      if (!futurePlan) {
        const updateClient: EditableClient = {
          plan: chosenPlan.type ?? "",
        };
        try {
          await editCientAPI(updateClient, client.id);
          showToast({
            title: "Success",
            description: "Client plan updated",
            type: "success",
          });
        } catch (e) {
          showToast({
            title: "Error",
            description: "Failed to update client plan",
            type: "error",
          });
        }
      }

      refreshSubscriptions(client.id);
      refreshClients();
    } catch (error) {
      console.error("Error creating subscription:", error);
      showToast({
        title: "Error",
        description: "Failed to create subscription",
        type: "error",
      });
    } finally {
      setSending(false);
      setIsEditing(false);
      onOpenChange(false);
    }
  };

  const handleEditConfirm = () => {
    const planObj = plans.find((p) => String(p.id) === selectedPlanId);
    const pName = planObj ? planObj.name : "";
    setEditedPlanName(pName);
    setIsEditing(false);
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    setEditedAmount(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-full p-0">
        <DialogHeader className="flex items-center justify-between px-6 pt-4 pb-1">
          <DialogTitle className="text-[18px] font-medium text-[#101828]">
            Plan details
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          {isEditing ? (
            <>
              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">
                  Plan <span className="text-[#7f56d9]">*</span>
                </Label>
                <Select value={selectedPlanId} onValueChange={handlePlanChange}>
                  <SelectTrigger className="h-11 rounded-md border-[#e4e7ec]">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.length === 0 ? (
                      <SelectItem value="" disabled>
                        Loading plans...
                      </SelectItem>
                    ) : (
                      plans.map((pl) => (
                        <SelectItem key={pl.id} value={String(pl.id)}>
                          {pl.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">
                  Amount received <span className="text-[#7f56d9]">*</span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
                    ₹
                  </span>
                  <Input
                    value={editedAmount}
                    onChange={onAmountChange}
                    className="h-11 pl-8 rounded-md border-[#e4e7ec] w-full"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">
                  Renewal period <span className="text-[#7f56d9]">*</span>
                </Label>
                <Input
                  disabled
                  value={editedPeriod || "Not Set"}
                  className="h-11 rounded-md border-[#e4e7ec] bg-gray-100 w-full"
                />
              </div>

              <DialogFooter className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  className="bg-[#7F56D9] text-white hover:bg-[#6941C6]"
                  onClick={handleEditConfirm}
                  disabled={
                    !selectedPlanId || editedAmount === "0" || !editedPeriod
                  }
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[#344054] border-[#D0D5DD] hover:bg-gray-50"
                  onClick={() => setIsEditing(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">Plan</Label>
                <Input
                  disabled
                  value={editedPlanName || "N/A"}
                  className="h-11 rounded-md border-[#e4e7ec] bg-gray-100 w-full"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">
                  Amount received
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
                    ₹
                  </span>
                  <Input
                    disabled
                    value={editedAmount || "0"}
                    className="h-11 pl-8 rounded-md border-[#e4e7ec] bg-gray-100 w-full"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[#344054] text-sm">Renewal period</Label>
                <Input
                  disabled
                  value={editedPeriod || "N/A"}
                  className="h-11 rounded-md border-[#e4e7ec] bg-gray-100 w-full"
                />
              </div>

              <DialogFooter className="flex gap-3 pt-6">
                <Button
                  type="button"
                  className="flex-1 bg-[#7F56D9] text-white hover:bg-[#6941C6]"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#7F56D9] text-white hover:bg-[#6941C6]"
                  onClick={handleConfirmRenewal}
                  disabled={sending}
                >
                  Confirm renewal
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
