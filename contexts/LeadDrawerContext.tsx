"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  ClientType,
  EditableClient,
  LeadStage,
  SubscriptionType,
} from "@/constants/types";
import { showToast } from "@/components/ui/toast-manager";
import { uploadFileAPI } from "@/services/upload";
import { editLeadAPI } from "@/services/clients";
import { createSubscriptionAPI } from "@/services/subscription";
import {
  isValidDate,
  isValidPAN,
  isValidPositiveInteger,
} from "@/utils/validation";
import { getNextRenewalDate, Renewal } from "@/utils/date";
import { getPlansAPI, PlanType } from "@/services/plan";
import { USER_DATA_KEY, userAtom } from "@/hooks/user-atom";
import { useAtom } from "jotai";
export type Lead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  stage: LeadStage;
  profile: string;
};

export type LeadDrawerContextValue = {
  // external
  lead?: Lead | null;
  client: ClientType;
  refreshClients: () => void;
  onClose: () => void;

  // state
  tab: string;
  setTab: (t: string) => void;
  stage: LeadStage;
  setStage: (s: LeadStage) => void;
  disposition: string;
  setDisposition: (d: string) => void;
  plan: string;
  setPlan: (p: string) => void;
  contractUrl: string | null;
  setContractUrl: (u: string | null) => void;
  contractName: string | null;
  setContractName: (n: string | null) => void;
  file?: File | Blob;
  setFile: (f?: File | Blob) => void;
  riskProfile: string;
  setRiskProfile: (r: string) => void;
  pan: string;
  setPan: (p: string) => void;
  amount: string;
  setAmount: (a: string) => void;
  renewal: Renewal;
  setRenewal: (r: Renewal) => void;
  dob?: string;
  setDob: (d?: string) => void;
  text: string;
  setText: (t: string) => void;
  sending: boolean;

  // handlers
  handleEditClientSubmit: () => Promise<void>;
  handleAddToClientsSubmit: (plans: PlanType[]) => Promise<void>;
};

const LeadDrawerContext = createContext<LeadDrawerContextValue | undefined>(
  undefined
);

export function useLeadDrawer() {
  const ctx = useContext(LeadDrawerContext);
  if (!ctx)
    throw new Error("useLeadDrawer must be used within LeadDrawerProvider");
  return ctx;
}

export function LeadDrawerProvider({
  children,
  lead,
  client,
  refreshClients,
  onClose,
}: React.PropsWithChildren<{
  lead?: Lead | null;
  client: ClientType;
  refreshClients: () => void;
  onClose: () => void;
}>) {
  const [tab, setTab] = useState("details");
  const [stage, setStage] = useState<LeadStage>(client?.lead_stage ?? "LEAD");
  const [disposition, setDisposition] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [contractName, setContractName] = useState<string | null>(null);
  const [file, setFile] = useState<File | Blob | undefined>(undefined);
  const [riskProfile, setRiskProfile] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [renewal, setRenewal] = useState<Renewal>("Monthly");
  const [dob, setDob] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    setTab("details");
    setStage(client.lead_stage ?? "LEAD");
    setDisposition(client.profile ?? "");
    setPlan(client.plan ?? "");
    setDob(client.dob ?? "");
    setContractUrl(null);
    setContractName(client.signed_contract_url ?? "");
    setRiskProfile(client.risk ?? "");
    setPan(client.pancard ?? "");
    setAmount("");
    setText(client.notes ?? "");
    setRenewal("Monthly");
  }, [lead?.id, client]);

  useEffect(() => {
    if (stage === "ONBOARDING") setTab("onboard");
  }, [stage]);

  async function handleEditClientSubmit() {
    if (!lead?.id) {
      showToast({
        title: "Error",
        description: "Client ID missing",
        type: "error",
      });
      return;
    }

    const editableClient: EditableClient = {
      ...(text && text !== client.notes ? { notes: text } : {}),
      ...(disposition && disposition.trim() ? { profile: disposition } : {}),
      lead_stage: stage,
      ...(riskProfile && riskProfile.trim() ? { risk: riskProfile } : {}),
      ...(pan && pan.trim() ? { pancard: pan } : {}),
      ...(dob && dob.trim() ? { dob: dob } : {}),
    };

    setSending(true);
    try {
      await editLeadAPI(editableClient, lead.id);
      showToast({
        title: "Success",
        description: "Lead successfully edited",
        type: "success",
      });
      refreshClients();
    } catch (e) {
      showToast({
        title: "Error",
        description: "An error has occured",
        type: "warning",
      });
      return;
    } finally {
      setSending(false);
    }
  }

  async function handleAddToClientsSubmit(plans: PlanType[]) {
    console.log(
      "client.setu_signature_status : ",
      client.setu_signature_status
    );
    if (!lead) {
      showToast({
        title: "Error",
        description: "Lead not found",
        type: "error",
      });
      return;
    }
    if (!riskProfile) {
      showToast({
        title: "Missing Risk Profile",
        description: "Please select a risk profile before proceeding.",
        type: "warning",
      });
      return;
    }
    if (!pan) {
      showToast({
        title: "Missing PAN",
        description: "Please enter a valid PAN number.",
        type: "warning",
      });
      return;
    } else if (!isValidPAN(pan)) {
      showToast({
        title: "Incorrect PAN format",
        description: "Please enter a valid PAN number.",
        type: "warning",
      });
      return;
    }
    if (!amount) {
      showToast({
        title: "Missing Investment Amount",
        description: "Please specify the amount you wish to invest.",
        type: "warning",
      });
      return;
    } else if (!isValidPositiveInteger(amount)) {
      showToast({
        title: "Warning",
        description: "Please enter correct amount format",
        type: "warning",
      });
      return;
    }
    if (!plan) {
      showToast({
        title: "Missing Plan Selection",
        description: "Please choose an investment plan.",
        type: "warning",
      });
      return;
    }
    if (!dob) {
      showToast({
        title: "Missing DOB",
        description: "Please select a start date for your investment.",
        type: "warning",
      });
      return;
    }
    if (!isValidDate(dob)) {
      showToast({
        title: "Error in DOB",
        description: "Invalid date format or out-of-range values.",
        type: "error",
      });
      return;
    }

    setSending(true);

    try {
      const selectedPlan = plans.find((p) => String(p.id) === plan);
      console.log(selectedPlan);
      const startDate = new Date().toISOString().split("T")[0];
      const editedClient: EditableClient = {
        pancard: pan,
        risk: riskProfile,
        plan: String(selectedPlan?.type),
        is_converted_to_client: true,
        lead_stage: stage,
      };
      await editLeadAPI(editedClient, client.id);
      showToast({
        title: "Success",
        description: "Client has been updated",
        type: "success",
      });
      refreshClients();

      if (!selectedPlan) {
        showToast({
          title: "Error",
          description: "Selected plan invalid",
          type: "error",
        });
        return;
      }

      const payload: SubscriptionType = {
        plan: String(selectedPlan.id),
        client: client.id,
        created_by: String(user?.id), // Replace with actual user id or context
        is_active: true,
        start_date: new Date().toISOString().slice(0, 10), // today in yyyy-mm-dd
        end_date: getNextRenewalDate(renewal),
        amount_paid: amount || "0",
        client_email: client.email,
        plan_name: selectedPlan.name,
      };

      try {
        const savedSubscription = await createSubscriptionAPI(payload);
        console.log("Saved subscription:", savedSubscription);
        showToast({
          title: "Success",
          description: "Subscription started",
          type: "success",
        });
        showToast({
          title: "Success",
          description: "Client subscription updated",
          type: "success",
        });
      } catch (error) {
        console.error(error);
        showToast({
          title: "Error",
          description: "Failed to update subscription",
          type: "error",
        });
      }
    } catch (e) {
      console.log(e);
      showToast({
        title: "Error",
        description: "An error has occured",
        type: "error",
      });
    } finally {
      refreshClients();
      setSending(false);
      onClose();
    }
  }

  const value: LeadDrawerContextValue = useMemo(
    () => ({
      lead,
      client,
      refreshClients,
      onClose,
      tab,
      setTab,
      stage,
      setStage,
      disposition,
      setDisposition,
      plan,
      setPlan,
      contractUrl,
      setContractUrl,
      contractName,
      setContractName,
      file,
      setFile,
      riskProfile,
      setRiskProfile,
      pan,
      setPan,
      amount,
      setAmount,
      renewal,
      setRenewal,
      dob: dob,
      setDob,
      text,
      setText,
      sending,
      handleEditClientSubmit,
      handleAddToClientsSubmit,
    }),
    [
      lead,
      client,
      refreshClients,
      onClose,
      tab,
      stage,
      disposition,
      plan,
      contractUrl,
      contractName,
      file,
      riskProfile,
      pan,
      amount,
      renewal,
      dob,
      text,
      sending,
    ]
  );

  return (
    <LeadDrawerContext.Provider value={value}>
      {children}
    </LeadDrawerContext.Provider>
  );
}
