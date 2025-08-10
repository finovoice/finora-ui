"use client"

import Sidebar from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, TrendingUp, ShieldCheck } from "lucide-react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
} from "recharts"

const lineData = Array.from({ length: 30 }).map((_, i) => ({
    day: String(i + 1),
    value: 120 + Math.round(Math.sin(i / 3) * 20 + i * 2),
}))
const onboarded = Array.from({ length: 30 }).map((_, i) => ({
    day: String(i + 1),
    value: 10 + Math.round(Math.cos(i / 4) * 5 + i * 1.4),
}))
const pieData = [
    { name: "Plan A", value: 45, color: "#7F56D9" },
    { name: "Plan B", value: 30, color: "#C7A7F5" },
    { name: "Plan C", value: 25, color: "#E9D7FE" },
]
const gaugeValue = 58 // compliance %

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#f9fafb] text-[#101828]">
            <div className="mx-auto flex max-w-[1440px] gap-0">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8">
                    <header className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">{"Hi <RA Name>!"}</h1>
                        <p className="mt-1 text-sm text-[#667085]">Your business at a glance</p>
                    </header>

                    {/* Top KPI row */}
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#344054]">Active client</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between gap-4">
                                <div className="w-56">
                                    <ResponsiveContainer width="100%" height={180}>
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value">
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-2 space-y-1 text-xs text-[#667085]">
                                        {pieData.map((p) => (
                                            <div key={p.name} className="flex items-center gap-2">
                                                <span className="inline-block size-2 rounded-sm" style={{ background: p.color }} />
                                                <span>{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pr-4 text-3xl font-semibold text-[#101828]">865</div>
                            </CardContent>
                        </Card>

                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-[#344054]">Current compliance score</CardTitle>
                                <Button size="sm" className="bg-[#7f56d9] text-white hover:bg-[#6e46c4]">
                                    Improve
                                </Button>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Radial gauge */}
                                <div className="flex items-center justify-center">
                                    <ResponsiveContainer width={220} height={180}>
                                        <RadialBarChart
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="70%"
                                            outerRadius="95%"
                                            barSize={12}
                                            data={[{ name: "score", value: gaugeValue, fill: "#7F56D9" }]}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar background dataKey="value" cornerRadius={10} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute text-xl font-semibold">{`${gaugeValue}%`}</div>
                                </div>
                                {/* Checklist */}
                                <ul className="space-y-2">
                                    {["Rationales for all exited trades sent", "Monthly SEBI scores uploaded", "Compliance area #3"].map(
                                        (t, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 rounded-md border border-[#e4e7ec] bg-[#f9fafb] p-2 text-xs text-[#475467]"
                                            >
                                                <ShieldCheck className="mt-0.5 h-4 w-4 text-[#12b76a]" />
                                                <div>
                                                    <div className="font-medium text-[#344054]">{t}</div>
                                                    <div className="text-[#667085]">{"Explanation of what the area is all about"}</div>
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Trends */}
                    <h2 className="mt-8 mb-3 text-xl font-semibold">Trends</h2>
                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Revenue generated (line) */}
                        <Card className="lg:col-span-2 border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-[#344054]">Revenue generated</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-[#344054]">
                                        <TrendingUp className="h-4 w-4 text-[#7f56d9]" />
                                        <span className="font-semibold">23345</span>
                                        <span className="text-[#12b76a]">+2.4% Monthly</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={lineData}>
                                        <defs>
                                            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7F56D9" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#7F56D9" stopOpacity={0.06} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#7F56D9" fillOpacity={1} fill="url(#rev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Employee targets */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-[#344054]">Employee targets</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-[#344054]">
                                        <span className="font-semibold">82%</span>
                                        <span className="text-[#12b76a]">+0.8% Monthly</span>
                                        <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
                                            <CalendarDays className="h-4 w-4" />
                                            Jan 2025
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    ["Anmol", 86],
                                    ["Neeraj", 72],
                                    ["Kuldeep", 64],
                                    ["Tousif", 58],
                                    ["Inder", 40],
                                ].map(([name, val]) => (
                                    <div key={name as string}>
                                        <div className="mb-1 flex items-center justify-between text-xs">
                                            <span className="text-[#344054]">{name as string}</span>
                                            <span className="text-[#667085]">{String(val)}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-[#eef2f6]">
                                            <div className="h-2 rounded-full bg-[#7f56d9]" style={{ width: `${val as number}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Profitable trades (gauge) */}
                        <Card className="border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#344054]">Profitable trades</CardTitle>
                            </CardHeader>
                            <CardContent className="flex h-56 items-center justify-center">
                                <ResponsiveContainer width={260} height={180}>
                                    <RadialBarChart
                                        cx="50%"
                                        cy="80%"
                                        innerRadius="60%"
                                        outerRadius="100%"
                                        barSize={14}
                                        startAngle={180}
                                        endAngle={0}
                                        data={[{ name: "profit", value: 42, fill: "#7F56D9" }]}
                                    >
                                        <RadialBar background dataKey="value" cornerRadius={10} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute mt-10 text-center">
                                    <div className="text-3xl font-semibold">38</div>
                                    <div className="text-xs text-[#667085]">for completed trades</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Clients onboarded (line) */}
                        <Card className="lg:col-span-2 border-[#e4e7ec]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#344054]">Clients onboarded</CardTitle>
                            </CardHeader>
                            <CardContent className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={onboarded}>
                                        <defs>
                                            <linearGradient id="co" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7F56D9" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#7F56D9" stopOpacity={0.06} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#f0f2f5" vertical={false} />
                                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#7F56D9" fillOpacity={1} fill="url(#co)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            </div>
        </div>
    )
}
