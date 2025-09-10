"use client"

import React, { createContext, useContext, useMemo, useReducer } from "react";

type Theme = 'light' | 'dark'

type UIState = {
  theme: Theme
  sidebarCollapsed: boolean
}

const initialState: UIState = {
  theme: 'light',
  sidebarCollapsed: false,
}

type UIAction =
  | { type: 'SET_THEME', payload: Theme }
  | { type: 'TOGGLE_SIDEBAR' }

function reducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    default:
      return state
  }
}

type UIContextValue = UIState & {
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
}

const UIContext = createContext<UIContextValue | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value: UIContextValue = useMemo(() => ({
    ...state,
    setTheme: (t) => dispatch({ type: 'SET_THEME', payload: t }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
  }), [state])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within a UIProvider')
  return ctx
}
