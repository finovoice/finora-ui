"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LeadCard, { type LeadCardProps } from "@/components/sales/lead-card"
import Sidebar from "@/components/sidebar"
import { ChevronDown, Upload, RotateCcw, Search, Check } from 'lucide-react'
import LeadDrawer, { type Lead } from "@/components/sales/lead-drawer"
import { useEffect, useState, useMemo } from "react"
import AddLead from "@/components/sales/add-lead"
import { showToast, ToastManager } from "@/components/ui/toast-manager"
import { startServerAPI } from "@/services"
import { getClientsAPI } from "@/services/clients"
import { ClientType, LeadStage } from "@/constants/types"
import EditLead from "@/components/sales/edit-lead"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"


export default function SalesPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [clientList, setClientList] = useState<ClientType[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [addLead, setAddLead] = useState<boolean>(false)
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({})
  const [client, setClient] = useState<ClientType>()

  // Filter states
  const [selectedPlan, setSelectedPlan] = useState<string[]>([])
  const [selectedLeadQuality, setSelectedLeadQuality] = useState<("HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND")[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")


  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        await startServerAPI()
        const data = await getClientsAPI()
        setClientList(data)
        if (!mounted) return
      } catch (e: any) {
        if (!mounted) return
        console.error("Error fetching sales:", e)
        showToast({
          title: "Error",
          description: `Error: Failed to load Sales`,
          type: 'error',
          duration: 3000
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  // Generate filter options
  const planOptions: ('STANDARD' | "PREMIUM" | 'ELITE')[] = ['STANDARD', 'PREMIUM', 'ELITE']
  const leadQualityOptions: ("HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND")[] = ["HOT", "COLD", "WARM", "NEUTRAL", "DND"]

  const columns = transformLeads(clientList, selectedPlan, selectedLeadQuality, searchQuery)

  function openDrawer(lead: Lead) {
    const id = lead.id
    const clientdata = clientList.find(c => String(c.id) === String(id))

    setClient(clientdata)
    setActiveLead(lead)
    setDrawerOpen(true)
  }

  const toggleColumnCollapse = (columnId: string) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }))
  }

  const handleResetFilters = () => {
    setSelectedPlan([])
    setSelectedLeadQuality([])
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto flex">
        <Sidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 border-b border-[#e4e7ec] bg-[#fafafa]">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-lg font-semibold text-[#101828]">Sales</h1>
              <Button onClick={() => setAddLead(true)}
                className="h-9 gap-2 rounded-md border-1 border-black/30 bg-transparent text-black/70 hover:text-[#7f56d9] hover:border-[#7f56d9] hover:bg-transparent">
                <Upload className="h-4 w-4" />
                Import leads
              </Button>
            </div>
            <div className="px-6 pb-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e7ec] bg-white px-3 py-2">
                {/* All Plans Filter */}
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

                {/* All Sources Filter (ignored for now) */}
                <FilterButton label="All Sources" />

                {/* All Lead quality Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
                      <span>
                        {selectedLeadQuality.length === 0
                          ? "All Lead quality"
                          : selectedLeadQuality.length === 1
                            ? toSentenceCaseLeadQuality(selectedLeadQuality[0])
                            : `${selectedLeadQuality.length} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start" side="bottom">
                    <Command>
                      <CommandEmpty>No quality found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSelectedLeadQuality([])}
                          className="cursor-pointer"
                        >
                          All
                        </CommandItem>
                        {leadQualityOptions.map((quality) => (
                          <CommandItem
                            key={quality}
                            onSelect={() => {
                              setSelectedLeadQuality((prev) =>
                                prev.includes(quality)
                                  ? prev.filter((q) => q !== quality)
                                  : [...prev, quality]
                              )
                            }}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            {toSentenceCaseLeadQuality(quality)}
                            {selectedLeadQuality.includes(quality) && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <button onClick={handleResetFilters} className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[#667085] hover:bg-[#f2f4f7]">
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <div className="ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98a2b3]" />
                    <Input
                      className="h-9 w-[320px] rounded-md border-[#e4e7ec] pl-8 placeholder:text-[#98a2b3] focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Search by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 py-4 ">
            {/* Use your preferred horizontal or vertical layout; this keeps columns flexible */}
            <div className="flex flex-col gap-4 xl:grid xl:grid-cols-4 ">
              {columns.map((col) => (
                <section key={col.id} className="rounded-lg border border-[#e4e7ec] bg-white h-fit">
                  <div className="flex items-center justify-between px-3 py-2 ">
                    <div className="flex flex-row w-full justify-between items-center">
                      <div className="flex flex-row items-center gap-2">
                        <h2 className="text-sm font-medium text-[#1f2937]">
                          {col.title}
                        </h2>
                        <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
                      </div>
                      <span className="ml-2 inline-grid  h-5 min-w-5 place-items-center rounded-full bg-[#f2f4f7] px-1 text-xs text-[#475467]">
                        {col.leads.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-[#f2f4f7] p-3">
                    {col.leads.map((lead) => (
                      <button
                        key={lead.name}
                        onClick={() => openDrawer({
                          id: lead.id,
                          name: lead.name,
                          phone: lead.phone,
                          email: lead.email,
                          stage: lead.stage,
                        })}
                        className="block w-full text-left"
                      >
                        <LeadCard {...lead} />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Right-hand drawer */}
      {client ? <LeadDrawer open={drawerOpen} onOpenChange={setDrawerOpen} lead={activeLead} client={client} /> : ''}
      <AddLead
        open={addLead}
        setOpen={setAddLead}
      />
      <ToastManager />
    </div>
  )
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-md border border-[#e4e7ec] bg-white px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]">
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-[#98a2b3]" />
    </button>
  )
}

type LeadCardDataProps = {
  id: string;
  name: string;
  hot: boolean;
  tier?: string;
};

type Column = {
  id: LeadStage;
  title: string;
  leads: (LeadCardDataProps & {
    date: string;
    phone?: string;
    email?: string;
    stage: LeadStage;
    owner: string;
  })[];
};

function transformLeads(
  data: ClientType[],
  selectedPlan: string[],
  selectedLeadQuality: ("HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND")[],
  searchQuery: string
): Column[] {
  let filteredData = data;

  if (selectedPlan.length > 0) {
    filteredData = filteredData.filter(lead => lead.plan && selectedPlan.includes(lead.plan));
  }

  if (selectedLeadQuality.length > 0) {
    filteredData = filteredData.filter(lead =>
      lead.profile && selectedLeadQuality.includes(lead.profile.toUpperCase() as ("HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND"))
    );
  }
  if (searchQuery) {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    filteredData = filteredData.filter(lead =>
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(lowerCaseSearchQuery)
    );
  }
  const grouped: Record<LeadStage, Column> = {
    'LEAD': { id: "LEAD", title: "Leads", leads: [] },
    'CONTACTED': { id: "CONTACTED", title: "Contacted", leads: [] },
    'DOCUMENTED': { id: "DOCUMENTED", title: "Onboarding", leads: [] },
    'AWAITING_PAYMENT': { id: "AWAITING_PAYMENT", title: "Awaiting Payment", leads: [] },
  };

  filteredData.forEach((lead) => {
    const stage = lead.lead_stage;
    if (!grouped[stage]) return;

    grouped[stage].leads.push({
      id: String(lead.id),
      name: `${lead.first_name} ${lead.last_name}`,
      hot: lead.profile === "HOT",
      tier: lead.plan || undefined,
      phone: lead.phone_number,
      date: formatToReadableDate(lead.created_at),
      email: lead.email,
      owner: lead.assigned_rm?.email,
      stage: stage,
    });
  });
  return Object.values(grouped);
}

function formatToReadableDate(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getUTCDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const suffix = (day === 1 || day === 21 || day === 31) ? "st" :
    (day === 2 || day === 22) ? "nd" :
      (day === 3 || day === 23) ? "rd" : "th";

  return `${day}${suffix} ${month} ${year}`;
}

function toSentenceCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toSentenceCaseLeadQuality(str: "HOT" | "COLD" | "WARM" | "NEUTRAL" | "DND"): string {
  if (str === "DND") return "DND";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
