"use client"

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { startServerAPI } from "@/services";
import { getClientsAPI } from "@/services/clients";
import type { ClientType } from "@/constants/types";
import { showToast } from "@/components/ui/toast-manager";

export type PaginationMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export type ClientsState = {
  loading: boolean
  clients: ClientType[]
  activeClient: ClientType | null
  drawerOpen: boolean
  pagination: PaginationMeta
}

const initialState: ClientsState = {
  loading: true,
  clients: [],
  activeClient: null,
  drawerOpen: false,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  },
}

export type ClientsAction =
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_CLIENTS_WITH_META', payload: { clients: ClientType[]; pagination: PaginationMeta } }
  | { type: 'SET_PAGE', payload: number }
  | { type: 'SET_PAGE_SIZE', payload: number }
  | { type: 'OPEN_DRAWER', payload: ClientType }
  | { type: 'CLOSE_DRAWER' }

function reducer(state: ClientsState, action: ClientsAction): ClientsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CLIENTS_WITH_META':
      return { ...state, clients: action.payload.clients, pagination: action.payload.pagination }
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, currentPage: action.payload } }
    case 'SET_PAGE_SIZE':
      return { ...state, pagination: { ...state.pagination, pageSize: action.payload, currentPage: 1 } }
    case 'OPEN_DRAWER':
      return { ...state, activeClient: action.payload, drawerOpen: true }
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false }
    default:
      return state
  }
}

export type ClientsContextValue = ClientsState & {
  refreshClients: (page?: number, pageSize?: number) => Promise<void>
  goToPage: (page: number) => Promise<void>
  setPageSize: (size: number) => Promise<void>
  openActionsDrawer: (client: ClientType) => void
  closeDrawer: () => void
}

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined)

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshClients = useCallback(async (page?: number, pageSize?: number) => {
    const nextPage = page ?? state.pagination.currentPage
    const nextSize = pageSize ?? state.pagination.pageSize

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const query = `?is_converted_to_client=true&page=${nextPage}&page_size=${nextSize}`
      const responseData = await getClientsAPI(query);
      const meta = responseData.metadata
      const pagination: PaginationMeta = {
        totalCount: meta.total_count,
        totalPages: meta.total_pages,
        currentPage: meta.current_page,
        pageSize: meta.page_size,
      }
      dispatch({ type: 'SET_CLIENTS_WITH_META', payload: { clients: responseData.data, pagination } })
    } catch (e) {
      showToast({ title: 'Error', description: 'Failed to load Clients', type: 'error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.pagination.currentPage, state.pagination.pageSize])

  const goToPage = useCallback(async (page: number) => {
    const clamped = Math.max(1, Math.min(page, state.pagination.totalPages || Number.MAX_SAFE_INTEGER))
    dispatch({ type: 'SET_PAGE', payload: clamped })
    await refreshClients(clamped)
  }, [refreshClients, state.pagination.totalPages])

  const setPageSize = useCallback(async (size: number) => {
    const normalized = Math.max(1, size)
    dispatch({ type: 'SET_PAGE_SIZE', payload: normalized })
    await refreshClients(1, normalized)
  }, [refreshClients])

  const openActionsDrawer = useCallback((client: ClientType) => {
    dispatch({ type: 'OPEN_DRAWER', payload: client })
  }, [])

  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])

  const value: ClientsContextValue = useMemo(() => ({
    ...state,
    refreshClients,
    goToPage,
    setPageSize,
    openActionsDrawer,
    closeDrawer,
  }), [state, refreshClients, goToPage, setPageSize, openActionsDrawer, closeDrawer])

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
}

export function useClients() {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within a ClientsProvider')
  return ctx
}
