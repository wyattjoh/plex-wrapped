"use client"

import { useEffect } from "react"
import type { MonthStat } from "@/lib/plex/types"
import { getMonthName } from "@/lib/utils/dates"
import { formatDuration } from "@/lib/utils/format"

interface MonthlySlideProps {
  monthlyBreakdown: MonthStat[]
  mostActiveMonth: MonthStat | undefined
}

export function MonthlySlide({
  monthlyBreakdown,
  mostActiveMonth,
}: MonthlySlideProps) {
  const maxItems = Math.max(...monthlyBreakdown.map((m) => m.itemCount))

  // Debug logging for monthly breakdown
  useEffect(() => {
    console.log("[DEBUG:MonthlySlide] Monthly breakdown:", monthlyBreakdown)
    console.log("[DEBUG:MonthlySlide] Max items:", maxItems)
    console.log(
      "[DEBUG:MonthlySlide] Bar heights:",
      monthlyBreakdown.map((m) => ({
        month: getMonthName(m.month),
        items: m.itemCount,
        heightPercent: maxItems > 0 ? (m.itemCount / maxItems) * 100 : 0,
      }))
    )
  }, [monthlyBreakdown, maxItems])

  // Calculate bar heights in pixels (container is 128px / h-32, minus label space)
  const barContainerHeight = 96 // pixels for bars (leaving room for labels)

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
      {mostActiveMonth && (
        <>
          <p className="text-xl text-zinc-400">Your most active month was</p>

          <div className="space-y-2">
            <h2 className="text-5xl font-bold text-[#E5A00D]">
              {getMonthName(mostActiveMonth.month)}
            </h2>
            <p className="text-lg text-zinc-400">
              {mostActiveMonth.itemCount} items •{" "}
              {formatDuration(mostActiveMonth.watchTimeMs)}
            </p>
          </div>
        </>
      )}

      <div className="mt-4 w-full max-w-md">
        <p className="mb-4 text-sm text-zinc-500">Activity throughout the year</p>
        <div className="flex items-end justify-between gap-1" style={{ height: barContainerHeight + 24 }}>
          {monthlyBreakdown.map((month) => {
            const heightPercent =
              maxItems > 0 ? (month.itemCount / maxItems) * 100 : 0
            // Use pixel height instead of percentage for reliability
            const barHeight = Math.max((heightPercent / 100) * barContainerHeight, 4)
            return (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-[#E5A00D] transition-all duration-500"
                  style={{ height: barHeight }}
                />
                <span className="text-xs text-zinc-500">
                  {getMonthName(month.month).slice(0, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
