"use client"

import type { WrappedStats } from "@/lib/plex/types"
import type { ServerFetchResult } from "@/lib/plex/history"
import { formatDurationLong, formatNumber } from "@/lib/utils/format"
import { Button } from "@/app/components/ui/Button"

interface SummarySlideProps {
  stats: WrappedStats
  serverResults: ServerFetchResult[]
}

export function SummarySlide({ stats, serverResults }: SummarySlideProps) {
  const { days, hours } = formatDurationLong(stats.totalWatchTimeMs)

  const successfulServers = serverResults.filter((r) => r.success)
  const failedServers = serverResults.filter((r) => !r.success)

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h2 className="text-4xl font-bold">
        Your <span className="text-[#E5A00D]">{stats.year}</span> in Review
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-900 p-6">
          <p className="text-3xl font-bold text-[#E5A00D]">
            {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
          </p>
          <p className="text-sm text-zinc-400">Watch time</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-6">
          <p className="text-3xl font-bold text-[#E5A00D]">
            {formatNumber(stats.totalItemsWatched)}
          </p>
          <p className="text-sm text-zinc-400">Items watched</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-6">
          <p className="text-3xl font-bold text-[#E5A00D]">
            {stats.uniqueMovies}
          </p>
          <p className="text-sm text-zinc-400">Movies</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-6">
          <p className="text-3xl font-bold text-[#E5A00D]">
            {stats.uniqueShows}
          </p>
          <p className="text-sm text-zinc-400">Shows</p>
        </div>
      </div>

      {stats.topMovies[0] && (
        <p className="max-w-sm text-zinc-400">
          Top movie:{" "}
          <span className="font-medium text-white">
            {stats.topMovies[0].title}
          </span>
        </p>
      )}

      {stats.topShows[0] && (
        <p className="max-w-sm text-zinc-400">
          Top show:{" "}
          <span className="font-medium text-white">
            {stats.topShows[0].title}
          </span>
        </p>
      )}

      {/* Server status */}
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <p className="mb-2 text-xs text-zinc-500">Servers included:</p>
        <div className="space-y-1">
          {successfulServers.map((server) => (
            <div
              key={server.serverName}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span className="truncate">{server.serverName}</span>
              </span>
              <span className="text-zinc-500">
                {server.historyCount} items
              </span>
            </div>
          ))}
          {failedServers.map((server) => (
            <div
              key={server.serverName}
              className="flex items-center justify-between text-sm text-zinc-500"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-600" />
                <span className="truncate">{server.serverName}</span>
              </span>
              <span className="text-xs">unreachable</span>
            </div>
          ))}
        </div>
      </div>

      <form action="/auth/logout" method="post" className="mt-2">
        <Button type="submit" variant="ghost">
          Sign Out
        </Button>
      </form>

      <p className="text-sm text-zinc-500">See you next year!</p>
    </div>
  )
}
