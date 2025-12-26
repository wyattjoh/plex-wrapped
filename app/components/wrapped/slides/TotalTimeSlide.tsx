"use client"

import { formatDurationLong } from "@/lib/utils/format"

interface TotalTimeSlideProps {
  totalWatchTimeMs: number
  totalItemsWatched: number
}

export function TotalTimeSlide({
  totalWatchTimeMs,
  totalItemsWatched,
}: TotalTimeSlideProps) {
  const { days, hours, minutes } = formatDurationLong(totalWatchTimeMs)

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
      <p className="text-xl text-zinc-400">You spent</p>

      <div className="flex flex-wrap items-baseline justify-center gap-4">
        {days > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold text-[#E5A00D]">{days}</span>
            <span className="text-2xl text-zinc-400">days</span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-bold text-[#E5A00D]">{hours}</span>
          <span className="text-2xl text-zinc-400">hours</span>
        </div>
        {days === 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold text-[#E5A00D]">{minutes}</span>
            <span className="text-2xl text-zinc-400">minutes</span>
          </div>
        )}
      </div>

      <p className="text-xl text-zinc-400">watching Plex</p>

      <div className="mt-8 rounded-2xl bg-zinc-900 px-8 py-4">
        <p className="text-lg text-zinc-400">
          That&apos;s{" "}
          <span className="font-bold text-white">{totalItemsWatched}</span>{" "}
          things watched
        </p>
      </div>
    </div>
  )
}
