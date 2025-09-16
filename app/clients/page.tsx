"use client"

import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, ChevronDown, MessageSquare, RefreshCcw, Search, Upload, Check } from 'lucide-react'
import { useEffect, useState, useMemo } from "react"
import ClientDrawer from "@/components/clients/client-drawer"
import { getClientsAPI } from "@/services/clients"
import type { ClientType, SubscriptionType } from "@/constants/types"
import { startServerAPI } from "@/services"
import { showToast, ToastManager } from "@/components/ui/toast-manager"
import AddClient from "@/components/clients/add-client"
import { getSubscriptionByClientIDAPI } from "@/services/subscription"
import LoadingEllipsis from "@/components/ui/loading-ellipsis"
import { useClients } from "@/contexts/ClientsContext"

export default function ClientsPage() {
const {
  loading,
  clients,
  drawerOpen,
  activeClient,
  refreshClients,
  openActionsDrawer,
  closeDrawer,
} = useClients()

const [addClientOpen, setAddClientOpen] = useState<boolean>(false)
const [subsciption, setSubscription] = useState<SubscriptionType[] | []>([])

const [client, setClient] = useState<ClientType>()

// Filter states
const [selectedPlan, setSelectedPlan] = useState<string[]>([])
const [selectedRiskProfile, setSelectedRiskProfile] = useState<string[]>([])
const [selectedRenewal, setSelectedRenewal] = useState<string>("") // Changed to single string
const [searchQuery, setSearchQuery] = useState<string>("")
const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none')


const refreshSubscriptions = async (clientID: string) => {
  try {
    if (clientID == undefined) return
    const subscription = await getSubscriptionByClientIDAPI(clientID)
    setSubscription(subscription)
  } catch (error) {
    console.error("Failed to fetch subscription:", error)
  }
}

  useEffect(() => {
  let mounted = true
  if (mounted) {
    refreshClients()
  }
  return () => { mounted = false }
}, [refreshClients])

const planOptions: ('Elite' | 'Standard' | 'Premium')[] = ['Elite', 'Standard', 'Premium']
const riskProfileOptions: ('High' | 'Aggressive' | 'Conservative')[] = ['High', 'Aggressive', 'Conservative']
const renewalOptions: ('7 days' | '14 days' | '30 days' | '90 days or more')[] = ['7 days', '14 days', '30 days', '90 days or more']

const filteredClients = useMemo(() => {
  let currentClients = clients

  if (selectedPlan.length > 0) {
    currentClients = currentClients.filter(client => client.plan && selectedPlan.map(p => p.toUpperCase()).includes(client.plan.toUpperCase()))
  }

  if (selectedRiskProfile.length > 0) {
    currentClients = currentClients.filter(client => client.risk && selectedRiskProfile.map(r => r.toUpperCase()).includes(client.risk.toUpperCase()))
  }

  if (selectedRenewal) { // Check if a renewal option is selected
    currentClients = currentClients.filter(client => {
      const days = daysLeft(client)
      let maxDays = Infinity
      if (selectedRenewal === '7 days') maxDays = 7
      else if (selectedRenewal === '14 days') maxDays = 14
      else if (selectedRenewal === '30 days') maxDays = 30
      else if (selectedRenewal === '90 days or more') maxDays = 90 // For "90 days or more", we filter for >= 90 days

      if (selectedRenewal === '90 days or more') {
        return days >= maxDays
      } else {
        return days <= maxDays
      }
    })
  }

  if (searchQuery) {
    const lowerCaseSearchQuery = searchQuery.toLowerCase()
    currentClients = currentClients.filter(client =>
      displayName(client).toLowerCase().includes(lowerCaseSearchQuery) ||
      client.email?.toLowerCase().includes(lowerCaseSearchQuery) ||
      client.phone_number?.toLowerCase().includes(lowerCaseSearchQuery)
    )
  }

  let sortedClients = [...currentClients]
  if (sortOrder === 'asc') {
    sortedClients.sort((a, b) => daysLeft(a) - daysLeft(b))
  } else if (sortOrder === 'desc') {
    sortedClients.sort((a, b) => daysLeft(b) - daysLeft(a))
  }
  return sortedClients
}, [clients, selectedPlan, selectedRiskProfile, selectedRenewal, searchQuery, sortOrder])

  const handleResetFilters = () => {
    setSelectedPlan([])
    setSelectedRiskProfile([])
    setSelectedRenewal("") // Reset to empty string
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
      <div className="mx-auto flex">
        <Sidebar />

        <main className="flex-1">
          {/* Top header */}
          <header className="sticky top-0 z-10 border-b border-[#e4e7ec] bg-[#fafafa]">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">Clients</h1>
                <Tabs defaultValue="active">
                  <TabsList className="bg-transparent p-0">
                    <TabsTrigger value="active" className="rounded-md bg-[#f9f5ff] px-2 py-1 text-xs font-medium text-[#6941c6] data-[state=active]:shadow-none">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="churned" className="rounded-md px-2 py-1 text-xs text-[#667085]">
                      Churned
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button onClick={() => setAddClientOpen(true)} className="h-9 gap-2 rounded-md bg-[#7f56d9] text-white hover:bg-[#6941c6]">
                <Upload className="h-4 w-4" />
                Import clients
              </Button>
            </div>

            {/* Filters */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                {/* Plan Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                      <span>
                        {selectedPlan.length === 0
                          ? "All Plans"
                          : selectedPlan.length === 1
                            ? toSentenceCase(selectedPlan[0])
                            : `${selectedPlan.length} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start" side="bottom">
                    <Command>
                      <CommandEmpty>No plan found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedPlan([])}
                          className="cursor-pointer"
                        >
                          All
                        </CommandItem>
                        {planOptions.map((plan) => (
                          <CommandItem
                            key={plan}
                            onSelect={() => {
                              setSelectedPlan((prev) =>
                                prev.includes(plan)
                                  ? prev.filter((p) => p !== plan)
                                  : [...prev, plan]
                              )
                            }}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            {toSentenceCase(plan)}
                            {selectedPlan.includes(plan) && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Risk Profile Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                      <span>
                        {selectedRiskProfile.length === 0
                          ? "All Risk Profiles"
                          : selectedRiskProfile.length === 1
                            ? toSentenceCase(selectedRiskProfile[0])
                            : `${selectedRiskProfile.length} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start" side="bottom">
                    <Command>
                      <CommandEmpty>No risk profile found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedRiskProfile([])}
                          className="cursor-pointer"
                        >
                          All
                        </CommandItem>
                        {riskProfileOptions.map((profile) => (
                          <CommandItem
                            key={profile}
                            onSelect={() => {
                              setSelectedRiskProfile((prev) =>
                                prev.includes(profile)
                                  ? prev.filter((p) => p !== profile)
                                  : [...prev, profile]
                              )
                            }}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            {toSentenceCase(profile)}
                            {selectedRiskProfile.includes(profile) && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Renewal Filter (Radio Buttons) */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                      <span>
                        {selectedRenewal === ""
                          ? "All Renewal"
                          : selectedRenewal}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start" side="bottom">
                    <RadioGroup
                      value={selectedRenewal}
                      onValueChange={(value) => setSelectedRenewal(value)}
                      className="p-1"
                    >
                      <Command>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => setSelectedRenewal("")}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="" id="r0" />
                              <label htmlFor="r0">All</label>
                            </div>
                            {selectedRenewal === "" && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                          {renewalOptions.map((renewal) => (
                            <CommandItem
                              key={renewal}
                              onSelect={() => setSelectedRenewal(renewal)}
                              className="cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={renewal} id={`r-${renewal}`} />
                                <label htmlFor={`r-${renewal}`}>{renewal}</label>
                              </div>
                              {selectedRenewal === renewal && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </RadioGroup>
                  </PopoverContent>
                </Popover>

                <button onClick={handleResetFilters} className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[#667085] hover:bg-[#f2f4f7]">
                  <RefreshCcw className="h-4 w-4" />
                  <span>Reset filters</span>
                </button>
                <div className="ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98a2b3]" />
                    <Input
                      placeholder="Search"
                      className="h-9 w-[320px] rounded-md border-[#e4e7ec] pl-8 placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Table */}
          <section className="px-6 py-4 flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-left">
                <LoadingEllipsis text="Clients are being loaded" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#e4e7ec] bg-white flex-1 flex flex-col">
                {/* Table head */}
                <div className="grid grid-cols-[1fr_2.8fr_1fr_0.8fr_64px] items-center border-b border-[#e4e7ec] bg-[#fafafa] px-4 py-2 text-xs font-medium text-[#667085]">
                  <div>Client</div>
                  <button
                    className="flex items-center gap-1"
                    onClick={() => setSortOrder(prev => {
                      if (prev === 'none') return 'asc';
                      if (prev === 'asc') return 'desc';
                      return 'none';
                    })}
                  >
                    <span>Plan | Days to renewal</span>
                    {sortOrder === 'asc' && <ChevronDown className="h-4 w-4" />}
                    {sortOrder === 'desc' && <ChevronDown className="h-4 w-4 rotate-180" />}
                  </button>
                  <div>Assigned RM</div>
                  <div>Risk profile</div>
                  <div className="text-right">Actions</div>
                </div>

                <ul role="list" className="divide-y divide-[#f2f4f7]">
                  {filteredClients.map((c) => (
                    <li key={c.id} className="grid grid-cols-[1fr_2.8fr_1fr_0.8fr_64px] items-center px-4 py-3">
                      {/* Client */}
                      <div className="min-w-0">
                        <div className="truncate text-[14px] text-[#1f2937]">{displayName(c)}</div>
                        {!c.signed_contract_url && (
                          <div className="mt-1 inline-flex items-center gap-1 text-xs text-[#b54708]">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>No contract</span>
                          </div>
                        )}
                      </div>

                      {/* Plan + progress + label */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col w-full gap-1">
                          <div className="min-w-[72px] shrink-0 text-sm font-semibold text-[#475467]">{toSentenceCase(c.plan)}</div>
                          <div className="relative h-1.5 w-full rounded-full bg-[#e5e7eb]">
                            <div
                              className="absolute left-0 top-0 h-1.5 rounded-full bg-gray-700"
                              style={{ width: `${progressPct(c)}%` }}
                              aria-label="elapsed"
                            />
                          </div>
                        </div>

                        <div className="shrink-0 text-right text-xs mr-6 text-[#344054]">
                          <div className="leading-4 flex flex-col items-center">
                            <span className="text-[#667085]">Renewal in</span>{" "}
                            <span className="font-semibold">{daysLeft(c)} days</span>
                          </div>
                        </div>
                      </div>

                      {/* RM */}
                      <div className="text-sm text-[#475467]">{c.assigned_rm?.email ?? "—"}</div>

                      {/* Risk */}
                      <div className="text-sm font-semibold text-[#475467]">{toSentenceCase(c.risk)}</div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="relative rounded-md p-2 text-[#667085] hover:bg-[#f2f4f7]"
                          aria-label="Open actions"
                          title="Open actions"
                          onClick={() => openActionsDrawer(c)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          {activeClient && (
            <ClientDrawer
              open={drawerOpen}
              onOpenChange={(open) => (open ? undefined : closeDrawer())}
              client={activeClient}
              refreshClients={refreshClients}
              setSubscriptionList={setSubscription}
              subscriptionList={subsciption}
              refreshSubscriptions={refreshSubscriptions}
            />
          )}
          <ToastManager />
          <AddClient
            open={addClientOpen}
            setOpen={setAddClientOpen}
            refreshClients={refreshClients}
          />

        </main>
      </div>
    </div>
  )
}

function toSentenceCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
      <span className="truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
    </button>
  )
}

function parseDate(s?: string | null): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function diffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((b.getTime() - a.getTime()) / msPerDay)
}

function totalDays(c: ClientType): number {
  const start = parseDate(c.start_date)
  const end = parseDate(c.end_date)
  if (start && end) {
    const total = diffDays(start, end)
    return Math.max(1, total)
  }
  return 30
}

function daysLeft(c: ClientType): number {
  const today = new Date()
  const end = parseDate(c.end_date)
  if (end) {
    return Math.max(0, diffDays(today, end))
  }
  return totalDays(c)
}

function displayName(c: ClientType): string {
  const parts = [c.first_name?.trim(), c.last_name?.trim()].filter(Boolean)
  const name = parts.join(" ").trim()
  return name || c.profile || c.email || c.phone_number || String(c.id)
}

function progressPct(c: ClientType) {
  const total = totalDays(c)
  const elapsed = Math.max(total - daysLeft(c), 0)
  const pct = (elapsed / total) * 100
  return Math.max(2, Math.min(100, pct))
}
