"use client"

import * as React from "react"
import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import EditLead from "./edit-lead"
import { ClientType, LeadStage, Profile } from "@/constants/types"
import LeadDrawerHeader from "./lead-drawer/LeadDrawerHeader"
import DetailsTab from "./lead-drawer/DetailsTab"
import OnboardTab from "./lead-drawer/OnboardTab"
import { LeadDrawerProvider } from "@/contexts/LeadDrawerContext"

export type Lead = {
  id: string
  name: string
  phone?: string
  email?: string
  stage: LeadStage
  profile: Profile
}

export default function LeadDrawer({
  open,
  onOpenChange,
  lead,
  client,
  refreshClients
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null,
  client: ClientType,
  refreshClients: () => void
}) {
  const [tab, setTab] = useState("details")
  const [editClient, setEditClient] = useState<boolean>(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0 flex h-full flex-col">
        <LeadDrawerProvider lead={lead} client={client} refreshClients={refreshClients} onClose={() => onOpenChange(false)}>
          <LeadDrawerHeader onEdit={() => setEditClient(true)} />
          <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col overflow-hidden">
            <div className="border-b border-[#e4e7ec] px-5 pt-2">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger value="chat" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Chat</TabsTrigger>
                <TabsTrigger value="details" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Details</TabsTrigger>
                <TabsTrigger value="onboard" className="rounded-none border-0 px-3 py-3 data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]">Onboard</TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="chat" className="px-5 py-5">
                <div className="text-sm text-[#667085]">Chat coming soon.</div>
              </TabsContent>
              <TabsContent value="details">
                <DetailsTab />
              </TabsContent>
              <TabsContent value="onboard">
                <OnboardTab />
              </TabsContent>
            </div>
          </Tabs>
        </LeadDrawerProvider>
        <EditLead id={lead?.id} client={client} open={editClient} setOpen={setEditClient} refreshClients={refreshClients} />
      </SheetContent>
    </Sheet>
  )
}
