import { CalendarDays, Flame, ShieldCheck, UserRound, RefreshCw } from 'lucide-react'

export type LeadCardProps = {
  name: string
  date?: string
  owner?: string
  hot?: boolean
  tier?: "Elite" | "Premium" | "Standard" | undefined
}

export default function LeadCard({ name, date = "27th Jan 2025", owner = "Olivia Rhye", hot = false, tier = "Elite" }: LeadCardProps) {
  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-medium text-[#1f2937]">{name}</h4>
        <RefreshCw className="h-3.5 w-3.5 text-[#98a2b3]" />
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#f2f4f7] pt-2 text-xs text-[#667085]">
        <div className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#475467]">
          <UserRound className="h-3.5 w-3.5 text-[#98a2b3]" />
          <span>{owner}</span>
        </div>
        <div className="flex items-center gap-2">
          {hot && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-0.5 text-[11px] font-medium text-[#c2410c]">
              <Flame className="h-3 w-3" />
              Hot
            </span>
          )}
          {tier && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-medium text-[#1e40af]">
              <ShieldCheck className="h-3 w-3" />
              {tier}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
