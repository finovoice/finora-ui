"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Phone, Mail, PencilLine, RefreshCcw, Clock, Target, Flag, ArrowRight, Bold, Italic, Heading, Quote, List, ListOrdered, PlusSquare, ChevronLeft, ChevronRight, FileText, Download, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import TradeFilters from "@/components/trades/trade-filters"
import TradeHeader from "@/components/trades/trade-header"
import TradeStat from "@/components/trades/trade-stat"
import DateStack from "@/components/trades/date-stack"
import ExpiryGauge from "@/components/ui/expiry-gauge"
import { ClientType, EditableClient, SubscriptionType } from "@/constants/types"
import { useEffect, useState } from "react"
import EditClient from "./edit-client"
import { Label } from "@radix-ui/react-label"
import { editLeadAPI } from "@/services/clients"
import { showToast } from "../ui/toast-manager"
import { format, parseISO } from "date-fns"
import { getSubscriptionByClientIDAPI } from "@/services/subscription"
import { RenewalConfirmationDialog } from "./renewal-confirmation-dialog"
import { getCurrentSubscriptionFromList } from "@/lib/getCurrentSubscriptionFromList"
import { getFutureSubscriptionsFromList } from "@/lib/getFutureSubscriptionFromList"
import LoadingSpinner from "../ui/loading-spinner"
import { getPastSubscriptionFromList } from "@/lib/getPastSubscriptionFromList"


export default function ClientDrawer({
  open,
  onOpenChange,
  client,
  subscriptionList,
  setSubscriptionList,
  refreshClients,
  refreshSubscriptions
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: ClientType,
  subscriptionList: SubscriptionType[] | [],
  setSubscriptionList: (subsciption: SubscriptionType[] | []) => void,
  refreshClients: () => void,
  refreshSubscriptions: (clientID: string) => void,
}) {
  const [tab, setTab] = useState("renewals")
  const [editClient, setEditClient] = useState<boolean>(false)
  const [sending, setSending] = useState<boolean>(false)
  const [text, setText] = useState<string>('')

  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
  const [futureSubscriptions, setFutureSubscriptions] = useState<SubscriptionType[] | null>(null);
  const [pastSubscriptions, setPastSubscriptions] = useState<SubscriptionType[] | null>(null)
  const [currentFuturePlanIndex, setCurrentFuturePlanIndex] = useState<number>(0);

  const [showRenewalDialog, setShowRenewalDialog] = useState<boolean>(false)
  const [subscriptionRefreshing, setSubscriptionRefreshing] = useState<boolean>(true);

  let first_name = client?.first_name ?? "Not Set"
  let last_name = client?.last_name ?? "Not Set"
  let phone = client?.phone_number ?? "Loading..."
  let email = client?.email ?? "Email not set"
  let plan = client?.plan ?? "Not Set"
  let risk = client?.risk ?? "Setting"

  useEffect(() => {
    setCurrentSubscription(getCurrentSubscriptionFromList(subscriptionList))
    setFutureSubscriptions(getFutureSubscriptionsFromList(subscriptionList))
    setPastSubscriptions(getPastSubscriptionFromList(subscriptionList))
  }, [subscriptionList])

  useEffect(() => {
    if (open) {
      setTab("renewals");
      first_name = client?.first_name ?? "Not Set"
      last_name = client?.last_name ?? "Not Set"
      phone = client?.phone_number ?? "Loading..."
      email = client?.email ?? "Email not set"
      plan = client?.plan ?? "Not Set"
      risk = client?.risk ?? "Setting"
      refreshSubscriptions(client?.id)
    }
    else {
      setSubscriptionList([])

    }
  }, [client?.id, open]);

  function cancelFutureSubscription() { }

  async function handleEditClientSubmit() {

    const editableClient: EditableClient = {
      ...(text != client.notes ? { notes: text } : {}),
    };

    setSending(true)

    try {
      const response = await editLeadAPI(editableClient, client.id)
      showToast({
        title: 'Success',
        description: "Lead successfully edited",
        type: 'success'
      })
    } catch (e) {
      showToast({
        title: 'Error',
        description: "An error has occured",
        type: 'warning'
      })
      return
    }
    finally {
      setSending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[840px] lg:max-w-[730px] p-0 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e4e7ec] px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SheetTitle className="truncate text-[18px] max-w-[220px] font-semibold text-[#101828]">{first_name} {last_name}</SheetTitle>
              <button onClick={() => setEditClient(true)} className="rounded p-1 text-[#667085] hover:bg-[#f2f4f7]" aria-label="Edit name">
                <PencilLine className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475467]">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#98a2b3]" />
                <span>{phone}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#98a2b3]" />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-start gap-2">
            <Badge text={plan} />
            <Badge text={risk ?? ""} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-[#e4e7ec] px-6 pt-2">
            <TabsList className="bg-transparent p-0 text-sm">
              <Tab value="chat" label="Chat" />
              <Tab value="trades" label="Trades" />
              <Tab value="contract" label="Contract" />
              <Tab value="renewals" label="Renewals" />
              <Tab value="notes" label="Notes" />
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto thin-scrollbar">
            <TabsContent value="chat" className="px-6 py-5 text-sm text-[#667085]">Coming soon.</TabsContent>
            <TabsContent value="trades" className="space-y-4 px-6 py-5">
              <TradeFilters />

              {/* Example future trade (collapsed header style) */}

              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <TradeHeader
                  order="BUY"
                  symbol="TATACHEM"
                  segment="EQUITY"
                  horizon="SWING"
                  placedAt="24 Oct 2024 11:15:58 AM"
                  defaultOpen={false}
                >
                  <div className="mt-1 grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <TradeStat icon={<Clock className="h-4 w-4 text-[#98a2b3]" />} label="Entry" value={<span>80124 - 80312</span>} />
                      <TradeStat icon={<Target className="h-4 w-4 text-[#98a2b3]" />} label="Stoploss" value={<span>80000</span>} />
                      <TradeStat icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} label="Exited" value={<span className="inline-flex items-center gap-2">82000 <ArrowRight className="h-3 w-3 text-[#98a2b3]" /> 103000</span>} />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 pr-1">
                      <DateStack top="2 Nov 2024" bottom="1:15:28 PM" icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} />
                    </div>
                  </div>
                </TradeHeader>
              </div>

              {/* Section divider: Exited */}
              <div className="flex items-center gap-3 px-2">
                <div className="h-px w-full bg-[#e4e7ec]" />
                <div className="text-xs text-[#667085]">Exited</div>
                <div className="h-px w-full bg-[#e4e7ec]" />
              </div>

              {/* Example exited trade (accordion style, same as Trade) */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <TradeHeader
                  order="BUY"
                  symbol="TATACHEM"
                  segment="EQUITY"
                  horizon="SWING"
                  placedAt="24 Oct 2024 11:15:58 AM"
                  defaultOpen={false}
                >
                  <div className="mt-1 grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <TradeStat icon={<Clock className="h-4 w-4 text-[#98a2b3]" />} label="Entry" value={<span>80124 - 80312</span>} />
                      <TradeStat icon={<Target className="h-4 w-4 text-[#98a2b3]" />} label="Stoploss" value={<span>80000</span>} />
                      <TradeStat icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} label="Exited" value={<span className="inline-flex items-center gap-2">82000 <ArrowRight className="h-3 w-3 text-[#98a2b3]" /> 103000</span>} />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 pr-1">
                      <DateStack top="2 Nov 2024" bottom="1:15:28 PM" icon={<Flag className="h-4 w-4 text-[#98a2b3]" />} />
                    </div>
                  </div>
                </TradeHeader>
              </div>

              {/* Footer controls */}
              <div className="flex items-center justify-between border-t border-[#e4e7ec] px-2 pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                <div className="text-xs text-[#667085]">Showing 1-2 of 2 trades</div>
              </div>
            </TabsContent>
            <TabsContent value="contract" className="px-6 py-5">
              {client.setu_signed_document_url ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-[#344054] mb-3">Contract Document</div>
                  <ContractViewer 
                    url={client.setu_signed_document_url}
                    fileName={`${first_name}_${last_name}_contract.pdf`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-[#f2f4f7] flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-[#98a2b3]" />
                  </div>
                  <div className="text-sm font-medium text-[#344054] mb-1">No contract available</div>
                  <div className="text-xs text-[#667085]">Contract document has not been uploaded yet</div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="notes" className="px-6 py-5  text-sm text-[#667085]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-[#344054]">Notepad</Label>
                </div>
                <div className="rounded-lg border border-[#e4e7ec]">
                  <textarea
                    value={text} onChange={e => setText(e.target.value)}
                    placeholder="Start typing"
                    className="w-full h-[300px] resize-none rounded-t-lg border-0 bg-[#f9fafb] p-3 text-sm text-[#101828] outline-none"
                  />
                  <div className="flex items-center gap-3 border-t border-[#e4e7ec] bg-[#f9fafb] px-3 py-2 text-[#667085]">
                    <ToolbarBtn icon={<Bold className="h-4 w-4" />} label="Bold" />
                    <ToolbarBtn icon={<Italic className="h-4 w-4" />} label="Italic" />
                    <ToolbarBtn icon={<Heading className="h-4 w-4" />} label="Heading" />
                    <ToolbarBtn icon={<Quote className="h-4 w-4" />} label="Quote" />
                    <ToolbarBtn icon={<List className="h-4 w-4" />} label="Bulleted list" />
                    <ToolbarBtn icon={<ListOrdered className="h-4 w-4" />} label="Numbered list" />
                  </div>
                </div>
                <div className="border-t border-[#e4e7ec] pt-4">
                  <Button
                    className="w-full"
                    onClick={handleEditClientSubmit}
                    disabled={sending || (text === client.notes) || text === ''}
                  >
                    {sending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Renewals */}
            <TabsContent value="renewals" className="space-y-6 px-6 py-3">
              {/* Active plan card */}
              <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                  <div className="text-xs font-medium text-[#667085]">{plan === 'Not Set' ? 'No ' : ''}Active Plan</div>
                  {<button
                    className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-[#344054] hover:bg-[#f2f4f7]"
                    onClick={() => setShowRenewalDialog(true)}
                  >
                    {plan === 'Not Set' ? <PlusSquare className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
                    {plan === 'Not Set' ? 'Add Plan' : 'Renew'}
                  </button>}
                </div>
                {plan === 'Not Set' ? '' : currentSubscription ? <div className="grid grid-cols-1 gap-6 px-5 py-3 pb-0 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-4">
                    <div className="text-base font-semibold text-[#101828]">{plan}</div>
                    <div className="flex flex-row gap-4 p-4 justify-between">
                      <Info label="Period" value={`${formatDateToReadable(currentSubscription.start_date)} - ${formatDateToReadable(currentSubscription.end_date)}`} />
                      <Info label="Amount Received" value={(`₹ ${currentSubscription?.amount_paid ?? 'None'}/-`)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {(currentSubscription?.start_date && currentSubscription.end_date) && <ExpiryGauge daysLeft={Math.floor((Date.parse(currentSubscription?.end_date) - Date.now()) / 86400000)} totalDays={Math.floor((Date.parse(currentSubscription.end_date) - Date.parse(currentSubscription.start_date)) / 86400000)} />
                    } </div>
                </div> :
                  <div className="pl-5 p-3 mb-20 text-sm text-gray-600 flex flex-row items-left gap-2">Loading <LoadingSpinner /></div>
                }
              </div>

              {/* Future plan card */}
              {futureSubscriptions && futureSubscriptions.length > 0 ? (
                <div className="relative h-[135px] overflow-hidden"> {/* Added h-[180px] and overflow-hidden */}
                  {futureSubscriptions.map((sub, index) => {
                    const isActive = index === currentFuturePlanIndex;
                    const isPrevious = index === (currentFuturePlanIndex - 1 + futureSubscriptions.length) % futureSubscriptions.length;
                    const isNext = index === (currentFuturePlanIndex + 1) % futureSubscriptions.length;

                    let translateXValue = '0%';
                    if (!isActive) {
                      if (index < currentFuturePlanIndex) {
                        translateXValue = '-100%'; // Cards to the left
                      } else {
                        translateXValue = '100%'; // Cards to the right
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`rounded-lg border border-[#e4e7ec] bg-white absolute top-0 left-0 w-full transition-all duration-300 ease-in-out`}
                        style={{
                          transform: `translateX(${translateXValue})`,
                          opacity: isActive ? 1 : 0,
                          zIndex: isActive ? 10 : 0,
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="text-xs font-medium text-[#667085]">Upcoming Plan</div>
                            {futureSubscriptions.length > 1 && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setCurrentFuturePlanIndex((prevIndex) => (prevIndex - 1 + futureSubscriptions.length) % futureSubscriptions.length)}
                                  className="rounded-md p-1 text-[#667085] hover:bg-[#f2f4f7]"
                                  aria-label="Previous plan"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-xs font-medium text-gray-600">{`${currentFuturePlanIndex + 1} / ${futureSubscriptions.length}`}</div>
                                <button
                                  onClick={() => setCurrentFuturePlanIndex((prevIndex) => (prevIndex + 1) % futureSubscriptions.length)}
                                  className="rounded-md p-1 text-[#667085] hover:bg-[#f2f4f7]"
                                  aria-label="Next plan"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {futureSubscriptions.length === 1 && (
                              <div className="text-xs font-medium text-gray-600">{`1 / 1`}</div>
                            )}
                          </div>
                          <button
                            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#344054] hover:bg-[#f2f4f7]"
                            onClick={() => cancelFutureSubscription()}
                            disabled={false}
                          >
                            Cancel
                          </button>
                        </div>
                        {
                          <div className="flex flex-row justify-between px-5 py-3 mb-2 w-full">
                            <div className="flex-[1] text-base font-semibold text-[#101828]">{sub.plan_name}</div>
                            <div className="flex-[2]">
                              <Info label="Period" value={`${formatDateToReadable(sub.start_date)} - ${formatDateToReadable(sub.end_date)}`} />
                            </div>
                            <div className="flex-[1]">
                              <Info label="Amount Received" value={(`₹ ${sub?.amount_paid ?? 'None'}/-`)} />
                            </div>
                          </div>
                        }
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-[#e4e7ec] bg-white">
                  <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-xs font-medium text-[#667085]/70">No Upcoming Plans</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Past plans */}
              {pastSubscriptions ? <div className="rounded-lg border border-[#e4e7ec] bg-white">
                <div className="flex flex-row justify-between">
                  <div className="flex-[2] border-b border-[#f2f4f7] px-5 py-3 text-xs font-medium text-[#667085]">Past plans</div>
                  <div className="flex-[5] border-b border-[#f2f4f7] px-5 py-3 text-xs font-medium text-[#667085]">Period</div>
                  <div className="flex-[2] border-b border-[#f2f4f7] px-5 py-3 text-xs font-medium text-[#667085]">Paid</div>

                </div>
                <div className="divide-y divide-[#f2f4f7]">
                  {<div className={`flex flex-col gap-2 ${pastSubscriptions?.length > 3 ? 'max-h-64 overflow-y-auto pr-2 thin-scrollbar' : ''}`}>
                    {pastSubscriptions?.length > 0 && pastSubscriptions.map((sub, index) => (
                      <Row
                        key={index}
                        plan={sub.plan_type!}
                        period={`${formatDateToReadable(sub.start_date)} - ${formatDateToReadable(sub.end_date)}`}
                        amount={`₹ ${sub.amount_paid ?? 'None'}/-`}
                      />
                    ))
                    }
                  </div>

                  }
                </div>
              </div>
                :
                <div className="rounded-lg border border-[#e4e7ec] bg-white">
                  <div className="flex items-center justify-between border-b border-[#f2f4f7] px-5 py-3">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-xs font-medium text-[#667085]/70">No Past Plans</div>
                    </div>

                  </div></div>
              }
            </TabsContent>
          </div>
        </Tabs>
        <EditClient client={client} open={editClient} setOpen={setEditClient} refreshClients={refreshClients} refreshSubsciption={refreshSubscriptions} />
        <RenewalConfirmationDialog
          open={showRenewalDialog}
          onOpenChange={setShowRenewalDialog}
          client={client}
          subscriptionList={subscriptionList}
          refreshSubscriptions={refreshSubscriptions}
          refreshClients={refreshClients}
        />
      </SheetContent>
    </Sheet>
  )
}


function Tab({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-0 px-3 py-3 text-[#667085] data-[state=active]:border-b data-[state=active]:border-[#7f56d9] data-[state=active]:text-[#7f56d9]"
    >
      {label}
    </TabsTrigger>
  )
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-3 py-1 text-xs text-[#475467]">
      {text}
    </span>
  )
}

export function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-[#667085]">{label}</div>
      <div className="text-[#101828] text-sm">{value}</div>
    </div>
  )
}

function Row({ plan, period, amount }: { plan: string; period: string; amount: string }) {
  return (
    <div className={`flex flex-row px-5 py-3 text-sm`}>
      <div className="flex-[3] text-[#101828]">{plan}</div>
      <div className="flex-[7] text-sm text-gray-700">{period}</div>
      <div className="flex-[2] text-sm text-gray-700">{amount}</div>
    </div>
  )
}
function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-md p-1.5 hover:bg-[#eef2f6]"
    >
      {icon}
    </button>
  )
}

function formatDateToReadable(dateString: string | null | undefined) {
  if (!dateString || dateString == undefined) return null

  const date = parseISO(dateString);

  const day = format(date, 'd');
  const month = format(date, 'MMM');
  const year = format(date, 'yyyy');

  const suffix =
    day.endsWith('1') && day !== '11' ? 'st' :
      day.endsWith('2') && day !== '12' ? 'nd' :
        day.endsWith('3') && day !== '13' ? 'rd' :
          'th';

  return `${day}${suffix} ${month} ${year}`;
}

function ContractViewer({ 
  url, 
  fileName = 'Contract Document' 
}: { 
  url: string; 
  fileName?: string; 
}) {
  const handleDownload = () => {
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePreview = () => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#f2f4f7] flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#667085]" />
            </div>
            <div>
              <div className="text-sm font-medium text-[#101828]">
                {fileName}
              </div>
              <div className="text-xs text-[#667085]">
                Signed contract document
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 px-2"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
              title="Download document"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview content */}
        <div className="rounded-md border border-[#e4e7ec] overflow-hidden">
          <div className="p-8 text-center bg-[#f9fafb]">
            <FileText className="h-12 w-12 text-[#667085] mx-auto mb-3" />
            <div className="text-sm text-[#667085] mb-3">
              Contract Document Preview
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Document
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
