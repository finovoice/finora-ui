"use client"

import { useMemo, useState } from "react"
import Sidebar from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import "react-datepicker/dist/react-datepicker.css";

import { CalendarDays } from "lucide-react"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"

type Granularity = "Daily" | "Weekly" | "Monthly"

type StackedPoint = { label: string; planA: number; planB: number; planC: number }
type SinglePoint = { label: string; value: number }

function formatDailyLabel(date: Date) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function monthShortName(idx: number) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][idx]
}

function formatMonthLabel(d: Date) {
    const yr = String(d.getFullYear()).slice(2)
    return `${monthShortName(d.getMonth())} ${yr}`
}

export default function DashboardPage() {
    // Filters state
    const [granularity, setGranularity] = useState<Granularity>("Daily")
    const [period, setPeriod] = useState<number>(30) // default to 30

    // Generate labels and data based on filters
    const { totalCustomerBase, newCustomers, revenueCollected, tradesSent } = useMemo(() => {
        const stacked: StackedPoint[] = []
        const singleA: SinglePoint[] = []
        const singleB: SinglePoint[] = []
        const singleC: SinglePoint[] = []

        const now = new Date()

        for (let i = 0; i < period; i++) {
            const idx = i // oldest to newest
            let label = String(idx + 1)

            if (granularity === "Daily") {
                const d = new Date(now)
                d.setDate(now.getDate() - (period - 1 - i))
                label = formatDailyLabel(d)
            } else if (granularity === "Weekly") {
                label = `Wk ${idx + 1}`
            } else if (granularity === "Monthly") {
                const d = new Date(now)
                d.setMonth(now.getMonth() - (period - 1 - i))
                label = formatMonthLabel(d)
            }

            // deterministic mock values that vary with index but stay in ranges
            const planA = 80 + ((i % 3) * 10)
            const planB = 60 + (((i + 1) % 4) * 8)
            const planC = 40 + (((i + 2) % 5) * 6)

            const val1 = 120 + ((i * 37) % 60)
            const val2 = 700 + ((i * 83) % 300)
            const val3 = 300 + ((i * 53) % 180)

            stacked.push({ label, planA, planB, planC })
            singleA.push({ label, value: val1 })
            singleB.push({ label, value: val2 })
            singleC.push({ label, value: val3 })
        }

        return {
            totalCustomerBase: stacked,
            newCustomers: singleA,
            revenueCollected: singleB,
            tradesSent: singleC,
        }
    }, [granularity, period])

    const periodOptions = [7, 30, 60, 90]
    const granularityOptions: Granularity[] = ["Daily", "Weekly", "Monthly"]

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#101828]">
            <div className="mx-auto flex max-w-[1440px] gap-0">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8">
                    {/* Header navigation */}
                    <div className="mb-8 border-b border-[#e4e7ec]">
                        <div className="flex items-center gap-8">
                            <div className="pb-3 text-lg font-semibold text-[#101828]">
                                Dashboard
                            </div>
                            <button className="pb-3 text-sm font-medium text-[#667085] hover:text-[#344054]">
                                Actions
                            </button>
                            <button className="pb-3 text-sm font-medium text-[#667085] hover:text-[#344054]">
                                Business trends
                            </button>
                        </div>
                    </div>

                    {/* Top bar to mirror the filter controls in the image */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-[#344054]">Filter by</div>
                            <div className="flex items-center gap-1">
                                {granularityOptions.map((g) => (
                                    <Button
                                        key={g}
                                        variant={g === granularity ? undefined : "outline"}
                                        className={`h-8 px-3 text-sm ${g === granularity ? "bg-[#7f56d9] text-white hover:bg-[#6e46c4]" : "border-[#e4e7ec] bg-white"
                                            }`}
                                        onClick={() => setGranularity(g)}
                                    >
                                        {g}
                                    </Button>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-[#344054]">for</div>
                            <div className="flex items-center gap-2">
                                {periodOptions.map((p) => (
                                    <Button
                                        key={p}
                                        variant={p === period ? undefined : "outline"}
                                        className={`h-8 px-3 text-sm ${p === period ? "bg-[#7f56d9] text-white hover:bg-[#6e46c4]" : "border-[#e4e7ec] bg-white"
                                            }`}
                                        onClick={() => setPeriod(p)}
                                    >
                                        {p} {granularity === "Daily" ? "days" : granularity === "Weekly" ? "weeks" : "months"}
                                    </Button>
                                ))}
                                <Button variant="outline" className="h-8 gap-1 border-[#e4e7ec] bg-white text-sm">
                                    <CalendarDays className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-[#667085]">Business trends</div>
                    </div>

                    {/* 2x2 grid of cards */}
                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Total customer base (stacked) */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm font-medium text-[#344054]">Total customer base</CardTitle>
                                        <span className="text-[#98a2b3]" title="Number of actively subscribed customers categorised by top three plans (by revenue)">ⓘ</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[#667085]">
                                        {[
                                            { name: "Plan A", color: "#7F56D9" },
                                            { name: "Plan B", color: "#C7A7F5" },
                                            { name: "Plan C", color: "#E9D7FE" },
                                        ].map((p) => (
                                            <div key={p.name} className="flex items-center gap-1">
                                                <span className="inline-block size-2 rounded-sm" style={{ background: p.color }} />
                                                <span>{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={totalCustomerBase}>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                                        <Bar dataKey="planC" stackId="a" fill="#E9D7FE" radius={4} />
                                        <Bar dataKey="planB" stackId="a" fill="#C7A7F5" />
                                        <Bar dataKey="planA" stackId="a" fill="#7F56D9" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* New customers joined (single series) */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-[#344054]">New customers joined</CardTitle>
                                    <span className="text-[#98a2b3]">ⓘ</span>
                                </div>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={newCustomers}>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                                        <Bar dataKey="value" fill="#7F56D9" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Revenue collected */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-[#344054]">Revenue collected</CardTitle>
                                    <span className="text-[#98a2b3]">ⓘ</span>
                                </div>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueCollected}>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                                        <Bar dataKey="value" fill="#7F56D9" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Trades sent */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-[#344054]">Trades sent</CardTitle>
                                    <div className="flex items-center gap-2 text-xs text-[#667085]">
                                        <span className="inline-block size-2 rounded-sm bg-[#7F56D9]" />
                                        Profitable trades
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={tradesSent}>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                                        <Bar dataKey="value" fill="#7F56D9" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            </div>
        </div>
    )
}
