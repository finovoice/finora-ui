import { Waypoints } from 'lucide-react'

export default function Brand() {
  return (
    <div className="flex items-center gap-2" aria-label="FinoRA brand">
      
      <div className="grid h-8 w-8 place-items-center rounded-md bg-[#7f56d9] text-white">
        <Waypoints className="h-4 w-4" />
      </div>
      <span className="text-base font-semibold text-[#252b37]">FinoRA</span>
    </div>
  )
}
