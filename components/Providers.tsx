"use client"

import React from "react";
import { SalesProvider } from "@/contexts/SalesContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { ToastManager } from "@/components/ui/toast-manager";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SalesProvider>
      <ClientsProvider>
        {children}
        <ToastManager />
      </ClientsProvider>
    </SalesProvider>
  )
}
