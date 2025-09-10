"use client"

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { startServerAPI } from "@/services";
import { getClientsAPI } from "@/services/clients";
import type { ClientType, LeadStage, Profile } from "@/constants/types";
import type { Lead } from "@/components/sales/lead-drawer";
import { showToast } from "@/components/ui/toast-manager";

// Types
export type PlanFilter = ('STANDARD' | 'PREMIUM' | 'ELITE')
export type LeadQuality = ("HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND")

export type SalesState = {
  loading: boolean
  clientList: ClientType[]
  drawerOpen: boolean
  activeLead: Lead | null
  addLeadOpen: boolean
  collapsedColumns: Record<string, boolean>
  currentClient?: ClientType
  // Filters
  selectedPlan: string[]
  selectedLeadQuality: LeadQuality[]
  searchQuery: string
}

const initialState: SalesState = {
  loading: true,
  clientList: [],
  drawerOpen: false,
  activeLead: null,
  addLeadOpen: false,
  collapsedColumns: {},
  currentClient: undefined,
  selectedPlan: [],
  selectedLeadQuality: [],
  searchQuery: "",
}

// Actions
export type SalesAction =
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_CLIENTS', payload: ClientType[] }
  | { type: 'OPEN_DRAWER', payload: { lead: Lead, client?: ClientType } }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_ADD_LEAD', payload: boolean }
  | { type: 'SET_COLLAPSED', payload: { id: string, value: boolean } }
  | { type: 'SET_SELECTED_PLAN', payload: string[] }
  | { type: 'SET_SELECTED_LEAD_QUALITY', payload: LeadQuality[] }
  | { type: 'SET_SEARCH_QUERY', payload: string }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_CURRENT_CLIENT', payload?: ClientType }

function reducer(state: SalesState, action: SalesAction): SalesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CLIENTS':
      return { ...state, clientList: action.payload }
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true, activeLead: action.payload.lead, currentClient: action.payload.client }
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false }
    case 'TOGGLE_ADD_LEAD':
      return { ...state, addLeadOpen: action.payload }
    case 'SET_COLLAPSED':
      return { ...state, collapsedColumns: { ...state.collapsedColumns, [action.payload.id]: action.payload.value } }
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload }
    case 'SET_SELECTED_LEAD_QUALITY':
      return { ...state, selectedLeadQuality: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'RESET_FILTERS':
      return { ...state, selectedPlan: [], selectedLeadQuality: [], searchQuery: "" }
    case 'SET_CURRENT_CLIENT':
      return { ...state, currentClient: action.payload }
    default:
      return state
  }
}

export type SalesContextValue = SalesState & {
  refreshClients: () => Promise<void>
  openDrawerForLead: (lead: Lead) => void
  closeDrawer: () => void
  toggleAddLead: (open: boolean) => void
  toggleColumnCollapse: (id: string) => void
  setSelectedPlan: (plans: string[]) => void
  setSelectedLeadQuality: (qualities: LeadQuality[]) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined)

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshClients = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await startServerAPI();
      const responseData = await getClientsAPI("?is_converted_to_client=false");
      dispatch({ type: 'SET_CLIENTS', payload: responseData.data })
      // If we had an active lead, update currentClient reference
      const newlead = responseData.data.find((c: ClientType) => String(c.id) === String(state.activeLead?.id))
      if (newlead) {
        dispatch({ type: 'SET_CURRENT_CLIENT', payload: newlead })
      }
    } catch (e: any) {
      console.error("Error fetching sales:", e);
      showToast({ title: 'Error', description: 'Failed to load Sales', type: 'error', duration: 3000 })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.activeLead?.id])

  const openDrawerForLead = useCallback((lead: Lead) => {
    const client = state.clientList.find(c => String(c.id) === String(lead.id))
    dispatch({ type: 'OPEN_DRAWER', payload: { lead, client } })
  }, [state.clientList])

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])
  const toggleAddLead = useCallback((open: boolean) => dispatch({ type: 'TOGGLE_ADD_LEAD', payload: open }), [])
  const toggleColumnCollapse = useCallback((id: string) => {
    const value = !state.collapsedColumns[id]
    dispatch({ type: 'SET_COLLAPSED', payload: { id, value } })
  }, [state.collapsedColumns])

  const setSelectedPlan = useCallback((plans: string[]) => dispatch({ type: 'SET_SELECTED_PLAN', payload: plans }), [])
  const setSelectedLeadQuality = useCallback((qualities: LeadQuality[]) => dispatch({ type: 'SET_SELECTED_LEAD_QUALITY', payload: qualities }), [])
  const setSearchQuery = useCallback((query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }), [])
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), [])

  const value: SalesContextValue = useMemo(() => ({
    ...state,
    refreshClients,
    openDrawerForLead,
    closeDrawer,
    toggleAddLead,
    toggleColumnCollapse,
    setSelectedPlan,
    setSelectedLeadQuality,
    setSearchQuery,
    resetFilters,
  }), [state, refreshClients, openDrawerForLead, closeDrawer, toggleAddLead, toggleColumnCollapse])

  return (
    <SalesContext.Provider value={value}>{children}</SalesContext.Provider>
  )
}

export function useSales() {
  const ctx = useContext(SalesContext)
  if (!ctx) throw new Error('useSales must be used within a SalesProvider')
  return ctx
}
