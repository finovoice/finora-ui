"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  Mail,
  PencilLine,
  RefreshCcw,
  Clock,
  Target,
  Flag,
  ArrowRight,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  ListOrdered,
  PlusSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TradeFilters from "@/components/trades/trade-filters";
import TradeHeader from "@/components/trades/trade-header";
import TradeStat from "@/components/trades/trade-stat";
import DateStack from "@/components/trades/date-stack";
import ExpiryGauge from "@/components/ui/expiry-gauge";
import { Label } from "@radix-ui/react-label";
import LoadingSpinner from "../ui/loading-spinner";
import { format, parseISO } from "date-fns";

/* ----- Types ----- */
import {
  ClientType,
  EditableClient,
  SubscriptionType,
} from "@/constants/types";

/* ----- Services ----- */
import { editLeadAPI, uploadContractAPI } from "@/services/clients";
import { createSubscriptionAPI } from "@/services/subscription";
import { createSignedUrlAPI } from "@/services/upload";

/* ----- Other components/dialogs ----- */
import EditClient from "./edit-client";
import { RenewalConfirmationDialog } from "./renewal-confirmation-dialog";
import { showToast } from "../ui/toast-manager";

/* ----- Subscription helpers (your existing libs) ----- */
import { getCurrentSubscriptionFromList } from "@/lib/getCurrentSubscriptionFromList";
import { getFutureSubscriptionsFromList } from "@/lib/getFutureSubscriptionFromList";
import { getPastSubscriptionFromList } from "@/lib/getPastSubscriptionFromList";
import { getNextRenewalDate, Renewal, renewalPeriodMap } from "@/utils/date";
import { getPlansAPI, PlanType } from "@/services/plan";

/* ----- Select component (assumed present in your ui library) ----- */
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { USER_DATA_KEY, userAtom } from "@/hooks/user-atom";
import { useAtom } from "jotai";

export default function ClientDrawer({
  open,
  onOpenChange,
  client,
  subscriptionList,
  setSubscriptionList,
  refreshClients,
  refreshSubscriptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientType;
  subscriptionList: SubscriptionType[] | [];
  setSubscriptionList: (subsciption: SubscriptionType[] | []) => void;
  refreshClients: () => void;
  refreshSubscriptions: (clientID: string) => void;
}) {
  /* UI state */
  const [tab, setTab] = useState<string>("renewals");
  const [editClient, setEditClient] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  /* subscription slices */
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionType | null>(null);
  const [futureSubscriptions, setFutureSubscriptions] = useState<
    SubscriptionType[] | null
  >(null);
  const [pastSubscriptions, setPastSubscriptions] = useState<
    SubscriptionType[] | null
  >(null);
  const [currentFuturePlanIndex, setCurrentFuturePlanIndex] =
    useState<number>(0);

  const [subscriptionRefreshing, setSubscriptionRefreshing] =
    useState<boolean>(true);

  /* upload state */
  const [isUploading, setIsUploading] = useState<boolean>(false);

  /* local copy of client so UI updates after contract upload */
  const [localClient, setLocalClient] = useState<ClientType>(client);

  /* plans & selection */
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  /* renewal dialog */
  const [showRenewalDialog, setShowRenewalDialog] = useState<boolean>(false);
  const [renewal, setRenewal] = useState<Renewal>("Monthly");

  /* readable fields derived */
  const first_name = client?.first_name ?? "Not Set";
  const last_name = client?.last_name ?? "Not Set";
  const phone = client?.phone_number ?? "Loading...";
  const email = client?.email ?? "Email not set";
  const planName = client?.plan ?? "Not Set";
  const risk = client?.risk ?? "Setting";
  const [user, setUser] = useAtom(userAtom);

  /* on mount: fetch plans */
  useEffect(() => {
    async function fetchPlans() {
      try {
        const fetched = await getPlansAPI();
        setPlans(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        console.error("fetchPlans error", err);
        showToast({
          title: "Error",
          description: "Failed to load plans.",
          type: "error",
        });
      }
    }
    fetchPlans();
  }, []);

  /* subscription list derived slices */
  useEffect(() => {
    setCurrentSubscription(getCurrentSubscriptionFromList(subscriptionList));
    setFutureSubscriptions(getFutureSubscriptionsFromList(subscriptionList));
    setPastSubscriptions(getPastSubscriptionFromList(subscriptionList));
    setSubscriptionRefreshing(false);
  }, [subscriptionList]);

  /* when drawer opens, refresh subscriptions for client */
  useEffect(() => {
    if (open) {
      setTab("renewals");
      setSubscriptionRefreshing(true);
      // call parent to refresh subscriptions (parent implements refreshSubscriptions)
      refreshSubscriptions(client?.id);
      // sync text with client.notes
      setText(client?.notes ?? "");
    } else {
      setSubscriptionList([]);
    }
  }, [client?.id, open]);

  /* sync local client */
  useEffect(() => {
    setLocalClient(client);
  }, [client]);

  /* ---------- Handlers ---------- */

  const handleContractUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !client?.id) return;

    setIsUploading(true);
    try {
      const updated = await uploadContractAPI(file, client.id);
      // uploadContractAPI expected to return updated client object
      if (updated) {
        setLocalClient(updated);
        refreshClients();
        showToast({
          title: "Success",
          description: "Contract uploaded",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "Upload returned no client",
          type: "warning",
        });
      }
    } catch (err) {
      console.error("handleContractUpload", err);
      showToast({
        title: "Error",
        description: "Failed to upload contract",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      // clear input value to allow re-upload same file if needed
      if (e.target) e.target.value = "";
    }
  };

  async function handleEditClientSubmit() {
    const editableClient: EditableClient = {
      ...(text !== client?.notes ? { notes: text } : {}),
    };

    setSending(true);
    try {
      await editLeadAPI(editableClient, client.id);
      showToast({
        title: "Success",
        description: "Lead edited",
        type: "success",
      });
      refreshClients();
    } catch (err) {
      console.error("handleEditClientSubmit", err);
      showToast({
        title: "Error",
        description: "Failed to edit lead",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  }

  async function handleAddSubscription() {
    if (!selectedPlan || !client?.id) {
      showToast({
        title: "Missing",
        description: "Select a plan first",
        type: "error",
      });
      return;
    }

    const selectedPlanObj = plans.find(
      (p) => String(p.id) === String(selectedPlan)
    );

    if (!selectedPlanObj?.renewal_period) {
      showToast({
        title: "Error",
        description: "Plan renewal period is missing or invalid.",
        type: "error",
      });
      return;
    }

    const mappedRenewal = renewalPeriodMap[selectedPlanObj.renewal_period];
    setRenewal(mappedRenewal);

    setSending(true);

    try {
      /* Build payload — adjust keys if your backend expects different */
      const payload: Partial<SubscriptionType> = {
        plan: String(selectedPlan), // plan id as string
        client: client.id,
        created_by: String(user?.id), // Replace with actual user id / context
        is_active: true,
        start_date: new Date().toISOString().slice(0, 10),
        end_date: getNextRenewalDate(renewal),
        amount_paid: selectedPlanObj?.price || "0",
        client_email: client.email,
        plan_name: selectedPlanObj?.name ?? "",
      };

      const saved = await createSubscriptionAPI(payload as SubscriptionType);
      if (saved) {
        showToast({
          title: "Success",
          description: "Subscription created",
          type: "success",
        });
        // refresh parent data
        refreshClients();
        refreshSubscriptions(client.id);
        // reset selection
        setSelectedPlan("");
      } else {
        showToast({
          title: "Error",
          description: "No subscription returned",
          type: "error",
        });
      }
    } catch (err: any) {
      console.error("handleAddSubscription", err);
      const message =
        err?.response?.data?.message ?? "Failed to create subscription";
      showToast({ title: "Error", description: message, type: "error" });
    } finally {
      setSending(false);
    }
  }

  function cancelFutureSubscription() {
    // placeholder — implement backend cancel flow
    showToast({
      title: "Info",
      description: "Cancel future subscription: not implemented",
      type: "info",
    });
  }

  /* ---------- Render ---------- */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[840px] lg:max-w-[730px] p-0 flex h-full flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e4e7ec] px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate text-[18px] max-w-[220px] font-semibold text-[#101828]">
                {first_name} {last_name}
              </SheetTitle>
              <button
                onClick={() => setEditClient(true)}
                className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]"
                aria-label="Edit name"
              >
                <PencilLine className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#98a2b3]" />
                <span>{phone}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#98a2b3]" />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-start gap-2">
            <Badge text={planName} />
            <Badge text={risk ?? ""} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex h-full flex-col overflow-hidden"
        >
          <div className="border-b border-[#e4e7ec] px-6 pt-2">
            <TabsList className="bg-transparent p-0 text-sm">
              <Tab value="chat" label="Chat" />
              <Tab value="trades" label="Trades" />
              <Tab value="contract" label="Contract" />
              <Tab value="renewals" label="Renewals" />
              <Tab value="notes" label="Notes" />
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar">
            {/* Chat tab (placeholder) */}
            <TabsContent
              value="chat"
              className="px-6 py-5 text-sm text-[#667085]"
            >
              Coming soon.
            </TabsContent>

            {/* Trades tab (example content) */}
            <TabsContent value="trades" className="space-y-4 px-6 py-5">
              <TradeFilters />
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <TradeHeader
                  order="BUY"
                  symbol="TATACHEM"
                  segment="EQUITY"
                  horizon="SWING"
                  placedAt="24 Oct 2024 11:15:58 AM"
                  defaultOpen={false}
                >
                  <div className="mt-1 grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <TradeStat
                        icon={<Clock className="h-4 w-4 text-[#98a2b3]" />}
                        label="Entry"
                        value={<span>80124 - 80312</span>}
                      />
                      <TradeStat
                        icon={<Target className="h-4 w-4 text-[#98a2b3]" />}
                        label="Stoploss"
                        value={<span>80000</span>}
                      />
                      <TradeStat
                        icon={<Flag className="h-4 w-4 text-[#98a2b3]" />}
                        label="Exited"
                        value={
                          <span className="inline-flex items-center gap-2">
                            82000{" "}
                            <ArrowRight className="h-3 w-3 text-[#98a2b3]" />{" "}
                            103000
                          </span>
                        }
                      />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 pr-1">
                      <DateStack
                        top="2 Nov 2024"
                        bottom="1:15:28 PM"
                        icon={<Flag className="h-4 w-4 text-[#98a2b3]" />}
                      />
                    </div>
                  </div>
                </TradeHeader>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="h-px w-full bg-[#e4e7ec]" />
                <div className="text-xs text-[#667085]">Exited</div>
                <div className="h-px w-full bg-[#e4e7ec]" />
              </div>

              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <TradeHeader
                  order="BUY"
                  symbol="TATACHEM"
                  segment="EQUITY"
                  horizon="SWING"
                  placedAt="24 Oct 2024 11:15:58 AM"
                  defaultOpen={false}
                >
                  <div className="mt-1 grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <TradeStat
                        icon={<Clock className="h-4 w-4 text-[#98a2b3]" />}
                        label="Entry"
                        value={<span>80124 - 80312</span>}
                      />
                      <TradeStat
                        icon={<Target className="h-4 w-4 text-[#98a2b3]" />}
                        label="Stoploss"
                        value={<span>80000</span>}
                      />
                      <TradeStat
                        icon={<Flag className="h-4 w-4 text-[#98a2b3]" />}
                        label="Exited"
                        value={
                          <span className="inline-flex items-center gap-2">
                            82000{" "}
                            <ArrowRight className="h-3 w-3 text-[#98a2b3]" />{" "}
                            103000
                          </span>
                        }
                      />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 pr-1">
                      <DateStack
                        top="2 Nov 2024"
                        bottom="1:15:28 PM"
                        icon={<Flag className="h-4 w-4 text-[#98a2b3]" />}
                      />
                    </div>
                  </div>
                </TradeHeader>
              </div>

              <div className="flex items-center justify-between border-t border-[#e4e7ec] px-2 pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
                <div className="text-xs text-[#667085]">
                  Showing 1-2 of 2 trades
                </div>
              </div>
            </TabsContent>

            {/* Contract tab */}
            <TabsContent value="contract" className="px-6 py-5">
              {localClient?.original_document_url ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-medium text-[#344054]">
                      Contract Document
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("contract-upload")?.click()
                        }
                      >
                        Reupload Contract
                      </Button>
                      <input
                        type="file"
                        id="contract-upload"
                        style={{ display: "none" }}
                        accept=".pdf"
                        onChange={handleContractUpload}
                      />
                    </div>
                  </div>

                  <ContractViewer
                    url={localClient.original_document_url!}
                    fileName={`${localClient.first_name}_${localClient.last_name}_contract.pdf`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-[#f2f4f7] flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-[#98a2b3]" />
                  </div>
                  <div className="text-sm font-medium text-[#344054] mb-1">
                    No contract available
                  </div>
                  <div className="text-xs text-[#667085] mb-4">
                    Contract document has not been uploaded yet
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      document.getElementById("contract-upload")?.click()
                    }
                  >
                    Upload Contract
                  </Button>
                  <input
                    type="file"
                    id="contract-upload"
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={handleContractUpload}
                  />
                </div>
              )}
            </TabsContent>

            {/* Notes tab */}
            <TabsContent
              value="notes"
              className="px-6 py-5 text-sm text-[#667085]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-[#344054]">Notepad</Label>
                </div>
                <div className="rounded-lg border border-[#e4e7ec]">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing"
                    className="w-full h-[300px] resize-none rounded-t-lg border-0 bg-[#f9fafb] p-3 text-sm text-[#101828] outline-none"
                  />
                  <div className="flex items-center gap-3 border-t border-[#e4e7ec] bg-[#f9fafb] px-3 py-2 text-[#667085]">
                    <ToolbarBtn
                      icon={<Bold className="h-4 w-4" />}
                      label="Bold"
                    />
                    <ToolbarBtn
                      icon={<Italic className="h-4 w-4" />}
                      label="Italic"
                    />
                    <ToolbarBtn
                      icon={<Heading className="h-4 w-4" />}
                      label="Heading"
                    />
                    <ToolbarBtn
                      icon={<Quote className="h-4 w-4" />}
                      label="Quote"
                    />
                    <ToolbarBtn
                      icon={<List className="h-4 w-4" />}
                      label="Bulleted list"
                    />
                    <ToolbarBtn
                      icon={<ListOrdered className="h-4 w-4" />}
                      label="Numbered list"
                    />
                  </div>
                </div>
                <div className="border-t border-[#e4e7ec] pt-4">
                  <Button
                    className="w-full"
                    onClick={handleEditClientSubmit}
                    disabled={sending || text === client?.notes || text === ""}
                  >
                    {sending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Renewals tab */}
            <TabsContent value="renewals" className="space-y-6 px-6 py-3">
              {/* Active plan card */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                  <div className="text-xs font-medium text-[#667085]">
                    {planName === "Not Set" ? "No " : ""}Active Plan
                  </div>

                  {!futureSubscriptions || futureSubscriptions.length === 0 ? (
                    <button
                      className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-[#344054] hover:bg-[#f2f4f7]"
                      onClick={() => setShowRenewalDialog(true)}
                      aria-label={
                        planName === "Not Set" ? "Add Plan" : "Renew Plan"
                      }
                    >
                      {planName === "Not Set" ? (
                        <PlusSquare className="h-4 w-4" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                      {planName === "Not Set" ? "Add Plan" : "Renew"}
                    </button>
                  ) : null}
                </div>

                {planName === "Not Set" ? null : subscriptionRefreshing ? (
                  <div className="pl-5 p-3 mb-20 text-sm text-gray-600 flex flex-row items-left gap-2">
                    Loading <LoadingSpinner />
                  </div>
                ) : currentSubscription ? (
                  <div className="grid grid-cols-1 gap-6 px-5 py-3 pb-0 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-4">
                      <div className="text-base font-semibold text-[#101828]">
                        {planName}
                      </div>
                      <div className="flex flex-row gap-4 p-4 justify-between">
                        <Info
                          label="Period"
                          value={`${formatDateToReadable(
                            currentSubscription.start_date
                          )} - ${formatDateToReadable(
                            currentSubscription.end_date
                          )}`}
                        />
                        <Info
                          label="Amount Received"
                          value={`₹ ${
                            currentSubscription.amount_paid ?? "None"
                          }/-`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {currentSubscription.start_date &&
                        currentSubscription.end_date && (
                          <ExpiryGauge
                            daysLeft={Math.floor(
                              (Date.parse(currentSubscription.end_date) -
                                Date.now()) /
                                86400000
                            )}
                            totalDays={Math.floor(
                              (Date.parse(currentSubscription.end_date) -
                                Date.parse(currentSubscription.start_date)) /
                                86400000
                            )}
                          />
                        )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="pl-5 p-3 mb-20 text-sm text-gray-600">
                      No active subscription found
                    </div>
                    <div className="rounded-lg border border-[#e4e7ec] bg-white px-5 py-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Select
                          value={selectedPlan}
                          onValueChange={(v) => setSelectedPlan(v)}
                        >
                          <SelectTrigger className="w-[240px]">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((p) => (
                              <SelectItem
                                key={String(p.id)}
                                value={String(p.id)}
                              >
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={handleAddSubscription}
                          disabled={sending}
                        >
                          {sending ? "Adding..." : "Add Subscription"}
                        </Button>
                      </div>

                      <div className="border-t pt-2">
                        {pastSubscriptions && pastSubscriptions.length > 0 ? (
                          <div
                            className={`${
                              pastSubscriptions.length > 3
                                ? "max-h-64 overflow-y-auto pr-2 thin-scrollbar"
                                : ""
                            }`}
                          >
                            {pastSubscriptions.map((sub, idx) => (
                              <Row
                                key={sub.id ?? idx}
                                plan={
                                  sub.plan_type ?? sub.plan_name ?? "Unknown"
                                }
                                period={`${formatDateToReadable(
                                  sub.start_date
                                )} - ${formatDateToReadable(sub.end_date)}`}
                                amount={`₹ ${sub.amount_paid ?? "None"}/-`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="py-3 text-sm text-gray-500">
                            No past plans.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Future plan card (carousel) */}
              {futureSubscriptions && futureSubscriptions.length > 0 ? (
                <div className="relative h-[135px] overflow-hidden">
                  {futureSubscriptions.map((sub, index) => {
                    const isActive = index === currentFuturePlanIndex;
                    let translateXValue = "0%";
                    if (!isActive)
                      translateXValue =
                        index < currentFuturePlanIndex ? "-100%" : "100%";

                    return (
                      <div
                        key={sub.id ?? index}
                        className="rounded-lg border border-[#e4e7ec] bg-white absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
                        style={{
                          transform: `translateX(${translateXValue})`,
                          opacity: isActive ? 1 : 0,
                          zIndex: isActive ? 10 : 0,
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="text-xs font-medium text-[#667085]">
                              Upcoming Plan
                            </div>
                            {futureSubscriptions.length > 1 ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    setCurrentFuturePlanIndex(
                                      (prev) =>
                                        (prev -
                                          1 +
                                          futureSubscriptions.length) %
                                        futureSubscriptions.length
                                    )
                                  }
                                  className="rounded-md p-1 text-[#667085] hover:bg-[#f2f4f7]"
                                  aria-label="Previous plan"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-xs font-medium text-gray-600">{`${
                                  currentFuturePlanIndex + 1
                                } / ${futureSubscriptions.length}`}</div>
                                <button
                                  onClick={() =>
                                    setCurrentFuturePlanIndex(
                                      (prev) =>
                                        (prev + 1) % futureSubscriptions.length
                                    )
                                  }
                                  className="rounded-md p-1 text-[#667085] hover:bg-[#f2f4f7]"
                                  aria-label="Next plan"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs font-medium text-gray-600">
                                1 / 1
                              </div>
                            )}
                          </div>

                          <button
                            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]"
                            onClick={() => cancelFutureSubscription()}
                            disabled={false}
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="flex flex-row justify-between px-5 py-3 mb-2 w-full">
                          <div className="flex-[1] text-base font-semibold text-[#101828]">
                            {sub.plan_name}
                          </div>
                          <div className="flex-[2]">
                            <Info
                              label="Period"
                              value={`${formatDateToReadable(
                                sub.start_date
                              )} - ${formatDateToReadable(sub.end_date)}`}
                            />
                          </div>
                          <div className="flex-[1]">
                            <Info
                              label="Amount Received"
                              value={`₹ ${sub.amount_paid ?? "None"}/-`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-[#e4e7ec] bg-white">
                  <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-xs font-medium text-[#667085]/70">
                        No Upcoming Plans
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Subscription UI + list of past subscriptions */}
            </TabsContent>
          </div>
        </Tabs>

        {/* Edit client modal / dialog and renewal confirmation dialog */}
        <EditClient
          client={client}
          open={editClient}
          setOpen={setEditClient}
          refreshClients={refreshClients}
          refreshSubsciption={refreshSubscriptions}
        />

        <RenewalConfirmationDialog
          open={showRenewalDialog}
          onOpenChange={setShowRenewalDialog}
          client={client}
          subscriptionList={subscriptionList}
          refreshSubscriptions={refreshSubscriptions}
          refreshClients={refreshClients}
        />
      </SheetContent>
    </Sheet>
  );
}

/* ====================
   Helper Subcomponents
   ==================== */

function Tab({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-0 px-3 py-3 text-[#667085] data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]"
    >
      {label}
    </TabsTrigger>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-3 py-1 text-xs text-[#475467]">
      {text}
    </span>
  );
}

export function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-[#667085]">{label}</div>
      <div className="text-[#101828] text-sm">{value}</div>
    </div>
  );
}

function Row({
  plan,
  period,
  amount,
}: {
  plan: string;
  period: string;
  amount: string;
}) {
  return (
    <div
      className={`flex flex-row px-5 py-3 text-sm border-b border-[#f2f4f7]`}
    >
      <div className="flex-[3] text-[#101828]">{plan}</div>
      <div className="flex-[7] text-sm text-gray-700">{period}</div>
      <div className="flex-[2] text-sm text-gray-700">{amount}</div>
    </div>
  );
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
  );
}

/* Format ISO date to "1st Jan 2024" style */
function formatDateToReadable(dateString?: string | null) {
  if (!dateString) return "—";
  try {
    const date = parseISO(dateString);
    const day = format(date, "d");
    const month = format(date, "MMM");
    const year = format(date, "yyyy");

    const suffix =
      day.endsWith("1") && day !== "11"
        ? "st"
        : day.endsWith("2") && day !== "12"
        ? "nd"
        : day.endsWith("3") && day !== "13"
        ? "rd"
        : "th";

    return `${day}${suffix} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

/* -------------------------
   ContractViewer Component
   (Inlined — uses createSignedUrlAPI)
   ------------------------- */
function ContractViewer({
  url,
  fileName = "Contract Document",
}: {
  url: string;
  fileName?: string;
}) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await createSignedUrlAPI(url);
      const downloadUrl = res?.signed_url;
      if (!downloadUrl) throw new Error("Failed to get signed URL");

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("handleDownload", err);
      setError("Failed to download file.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await createSignedUrlAPI(url);
      const previewUrl = res?.signed_url;
      if (!previewUrl) throw new Error("Failed to get signed URL");

      setSignedUrl(previewUrl);
      window.open(previewUrl, "_blank");
    } catch (err) {
      console.error("handlePreview", err);
      setError("Failed to open preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#667085]" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#101828]">
                {fileName}
              </div>
              <div className="text-xs text-[#667085]">
                Signed contract document
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 px-2"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
              title="Download document"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview area */}
        <div className="rounded-md border border-[#e4e7ec] overflow-hidden">
          <div className="p-8 text-center bg-[#f9fafb]">
            <FileText className="h-12 w-12 text-[#667085] mx-auto mb-3" />
            <div className="text-sm text-[#667085] mb-3">
              Contract Document Preview
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Document
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}