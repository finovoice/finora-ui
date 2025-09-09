// Common trade-related types used across the app

export type TradeOrder = "BUY" | "SELL"
export type TradeSegment = "EQUITY" | "F&O"
export type TradeTimeHorizon = "INTRADAY" | "SWING" | "POSITIONAL"
export type TradeStatus = "ACTIVE" | "EXITED" | "COMPLETED" | "CANCELLED" | "INACTIVE"

// Trade object as returned by the backend API
export type TradeType = {
  id: string
  stock_name: string
  entry: string
  entry_display: string
  stoploss: string | null
  targets: string[]
  segment: TradeSegment | string
  timehorizon: TradeTimeHorizon | string
  order: TradeOrder
  status: TradeStatus | string
  exited_price: string | null
  exited_price_display: string | null
  exited_at: string | null
  documentation_url: string | null
  documentation: string | null
  cohort: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  audit_trails: AuditTrail[]
}

// Details received from the trade object
export type AuditTrail = {
  account: string;
  changed_to: Record<string, string>;
  updated_at: string;
  changed_from: Record<string, string>;
};

// A minimal UI-friendly trade type (optional mapping helper)
export type UITrade = {
  id: string
  side: TradeOrder
  symbol: string
  segment: TradeSegment
  intraday?: boolean
  equity?: boolean
  expanded?: boolean
  time: string
  entryRange?: string
  stoploss?: string
  targets?: string
  riskReward?: string
}

// Cohort object as returned by the backend API
export type CohortType = {
  id: string
  name: string
  description: string
  client_count: number
  created_at: string
  is_active: boolean
}


export type ClientType = {
  id: string
  phone_number: string
  email: string
  pancard: string
  organisation: number
  dob?: string
  assigned_rm: {
    id: string
    email: string
    phone_number: string
    type: string
    is_admin: boolean
    is_org_admin: boolean
  }
  profile: string
  first_name: string
  last_name: string
  ekyc: string
  risk: string
  notes?: string
  lead_stage: LeadStage
  signed_contract_url: string | null
  plan: string
  start_date: string
  end_date: string | null
  is_converted_to_client: boolean
  created_at: string
  updated_at: string
}

export type EditableClient = {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  assigned_rm?: string
  pancard?: string
  dob?: string
  organisation?: number
  profile?: Profile
  notes?: string
  ekyc?: string
  risk?: string
  lead_stage?: LeadStage
  signed_contract_url?: string | null
  plan?: string
  start_date?: string
  end_date?: string | null
  is_converted_to_client?: boolean
}

export type LeadType = {
  phone_number: string,
  email: string,
  organisation: number,
  first_name: string,
  last_name: string,
  assigned_rm: string,
}


export type SubscriptionType = {
  id?: string;
  plan: string;
  client: string;
  created_by: string;
  is_active?: boolean;
  start_date?: string; // or Date if you're parsing
  end_date: string;
  amount_paid: string;
  payment_reference?: string | null;
  auto_renew?: boolean;
  created_at?: string;
  updated_at?: string;
  client_email: string;
  plan_name: string;
  plan_type?: "ELITE" | "STANDARD" | "PREMIUM"; // adjust as needed
};

export type LeadStage = "LEAD" | "CONTACTED" | "DOCUMENTED" | "AWAITING_PAYMENT";

export type Profile = "HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND" | string;