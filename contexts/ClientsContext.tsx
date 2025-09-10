"use client"

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { startServerAPI } from "@/services";
import { getClientsAPI } from "@/services/clients";
import type { ClientType } from "@/constants/types";
import { showToast } from "@/components/ui/toast-manager";

export type ClientsState = {
  loading: boolean
  clients: ClientType[]
  activeClient: ClientType | null
  drawerOpen: boolean
}

const initialState: ClientsState = {
  loading: true,
  clients: [],
  activeClient: null,
  drawerOpen: false,
}

export type ClientsAction =
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_CLIENTS', payload: ClientType[] }
  | { type: 'OPEN_DRAWER', payload: ClientType }
  | { type: 'CLOSE_DRAWER' }

function reducer(state: ClientsState, action: ClientsAction): ClientsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload }
    case 'OPEN_DRAWER':
      return { ...state, activeClient: action.payload, drawerOpen: true }
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false }
    default:
      return state
  }
}

export type ClientsContextValue = ClientsState & {
  refreshClients: () => Promise<void>
  openActionsDrawer: (client: ClientType) => void
  closeDrawer: () => void
}

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined)

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshClients = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await startServerAPI();
      const responseData = await getClientsAPI("?is_converted_to_client=true");
      dispatch({ type: 'SET_CLIENTS', payload: responseData.data })
    } catch (e) {
      showToast({ title: 'Error', description: 'Failed to load Clients', type: 'error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const openActionsDrawer = useCallback((client: ClientType) => {
    dispatch({ type: 'OPEN_DRAWER', payload: client })
  }, [])

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])

  const value: ClientsContextValue = useMemo(() => ({
    ...state,
    refreshClients,
    openActionsDrawer,
    closeDrawer,
  }), [state, refreshClients, openActionsDrawer, closeDrawer])

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
}

export function useClients() {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within a ClientsProvider')
  return ctx
}
