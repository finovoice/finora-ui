import { BACKEND_URL } from "@/constants/configs";
import {
  getRequestOptions,
  sendGetRequest,
  sendUpdateCreateRequest,
} from "@/services/index";

const PLAN_API_SERVICE_URL = `${BACKEND_URL}/api/core/plans/`;

export type PlanType = {
  id: number;
  organisation: number;
  type: "STANDARD" | "PREMIUM" | "ELITE";
  renewal_period: "MONTHLY" | "QUARTERLY" | "WEEKLY"; // Assuming only these values
  price: string; // or number if you're using it as numeric (e.g., 1999.00)
  name: string;
  description?: string;
  is_active: boolean;
};

export type PlanCreatePayload = Omit<PlanType, "id">;

export type PlanUpdatePayload = Pick<
  PlanDetails,
  "id" | "name" | "price" | "is_active"
>;

export const getPlansAPI = async (): Promise<PlanType[]> => {
  return (await sendGetRequest(PLAN_API_SERVICE_URL, "plans")) as PlanType[];
};

export const createPlanAPI = async (
  plan: Omit<PlanType, "id">
): Promise<PlanType> => {
  const requestOptions = await getRequestOptions(plan, "POST");
  return (await sendUpdateCreateRequest(
    PLAN_API_SERVICE_URL,
    requestOptions,
    "plan"
  )) as PlanType;
};

export const updatePlanAPI = async (plan: PlanDetails): Promise<PlanType> => {
  const url = `${PLAN_API_SERVICE_URL}${plan.id}/`;
  const requestOptions = await getRequestOptions(plan, "PATCH");
  return (await sendUpdateCreateRequest(
    url,
    requestOptions,
    "plan"
  )) as PlanType;
};

export const deletePlanAPI = async (id: number): Promise<void> => {
  const url = `${PLAN_API_SERVICE_URL}${id}/`;
  const requestOptions = await getRequestOptions({}, "DELETE");
  await sendUpdateCreateRequest(url, requestOptions, "plan");
};

export type RenewalKey = "WEEKLY" | "MONTHLY" | "QUARTERLY" | undefined;

export type PlanDetails = {
  id?: number;
  name: string;
  price: string;
  is_active?: boolean;
  renewal_period?: RenewalKey;
  type?: "STANDARD" | "PREMIUM" | "ELITE";
};

export const getPlanByIdAPI = async (id: number): Promise<PlanType> => {
  const url = `${PLAN_API_SERVICE_URL}${id}/`;
  return (await sendGetRequest(url, "plan")) as PlanType;
};
