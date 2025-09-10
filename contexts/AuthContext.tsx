"use client"

import React, { createContext, useContext, useMemo, useReducer } from "react";

export type User = {
  id: string
  email: string
  name?: string
}

type AuthState = {
  user: User | null
  token?: string
}

const initialState: AuthState = {
  user: null,
  token: undefined,
}

type AuthAction =
  | { type: 'SIGN_IN', payload: { user: User, token?: string } }
  | { type: 'SIGN_OUT' }

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, user: action.payload.user, token: action.payload.token }
    case 'SIGN_OUT':
      return { ...state, user: null, token: undefined }
    default:
      return state
  }
}

type AuthContextValue = AuthState & {
  signIn: (user: User, token?: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value: AuthContextValue = useMemo(() => ({
    ...state,
    signIn: (user, token) => dispatch({ type: 'SIGN_IN', payload: { user, token } }),
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
  }), [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
