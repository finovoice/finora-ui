import { CalendarDays, Flame, ShieldCheck, UserRound, RefreshCw, MessageSquare, ShoppingBag, Snowflake, Sun, Minus, PhoneOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {Profile} from "@/constants/types";

export type LeadCardProps = {
  name: string
  date?: string
  owner?: string
  hot?: boolean
  tier?: string
  profile: Profile
}

const getProfileIcon = (profile: Profile) => {
  switch (profile) {
    case 'HOT':
      return <Flame className="h-3 w-3" />
    case 'COLD':
      return <Snowflake className="h-3 w-3" />
    case 'WARM':
      return <Sun className="h-3 w-3" />
    case 'NEUTRAL':
      return <Minus className="h-3 w-3" />
    case 'DND':
      return <PhoneOff className="h-3 w-3" />
    default:
      return <UserRound className="h-3 w-3" />
  }
}

const getProfileColor = (profile: Profile) => {
  switch (profile) {
    case 'HOT':
      return 'bg-[#fff7ed] text-[#c2410c]'
    case 'COLD':
      return 'bg-[#f0f9ff] text-[#0284c7]'
    case 'WARM':
      return 'bg-[#fefce8] text-[#ca8a04]'
    case 'NEUTRAL':
      return 'bg-[#f9fafb] text-[#6b7280]'
    case 'DND':
      return 'bg-[#fef2f2] text-[#dc2626]'
    default:
      return 'bg-[#f3f4f6] text-[#374151]'
  }
}

export default function LeadCard({ name, date, owner, hot = false, tier, profile }: LeadCardProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isOverflowing = el.scrollHeight > el.clientHeight;
      setIsTruncated(isOverflowing);
    }
  }, [name]);

  return (
    <div className="rounded-lg border border-[#e4e7ec] bg-white p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="relative group w-fit">
          <h4
            ref={textRef}
            className="text-[15px] font-medium text-[#1f2937] line-clamp-2"
          >
            {name}
          </h4>

          {isTruncated && (
            <div className="absolute top-full mt-1 left-0 z-10 hidden group-hover:block bg-white text-gray-700 text-sm px-3 py-2 rounded shadow-lg max-w-sm w-max whitespace-normal border border-gray-200">
              {name}
            </div>
          )}
        </div>

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
        <div className="flex flex-col items-left w-fit gap-2">
          {profile && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${getProfileColor(profile)}`}>
              {getProfileIcon(profile)}
              {profile}
            </span>
          )}
          {tier == 'ELITE' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-medium text-blue-700">
              <ShoppingBag size={11} />
              Elite
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
