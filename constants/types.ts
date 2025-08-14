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
  audit_trails: unknown[]
}

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