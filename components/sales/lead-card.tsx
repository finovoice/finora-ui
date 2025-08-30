import { CalendarDays, Flame, ShieldCheck, UserRound, RefreshCw, MessageSquare, ShoppingBag } from 'lucide-react'

export type LeadCardProps = {
  name: string
  date?: string
  owner?: string
  hot?: boolean
  tier?: string
}

export default function LeadCard({ name, date, owner, hot = false, tier }: LeadCardProps) {
  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-medium text-[#1f2937]">{name}</h4>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-[#f2f4f7] pt-2 text-xs text-[#667085]">
        <div className="flex flex-row w-full justify-between items-center">
          <div>
            <MessageSquare size={12} />
          </div>
          <div className='flex flex-row gap-1'>
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>

        </div>
      </div>

      <div className='border-1 w-full my-3'></div>

      <div className="mt-3 space-y-2 text-xs">
        {owner &&
          <div className="flex items-center gap-1 text-[#475467]">
            <span className='border-1 rounded border-black/40 text-[0.6rem] px-0.5 font-xs'>RM</span>
            <span>{owner}</span>
          </div>}
        {
          (hot || tier == 'ELITE') &&
          <div className="flex flex-col items-left w-fit gap-2">
            {hot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-0.5 text-[11px] font-medium text-[#c2410c]">
                <Flame className="h-3 w-3" />
                Hot
              </span>
            )}
            {tier == 'ELITE' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-medium text-blue-700">
                <ShoppingBag size={11} />
                Elite
              </span>
            )}
          </div>}
      </div>
    </div>
  )
}
