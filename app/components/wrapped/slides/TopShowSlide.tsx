"use client"

import type { TopItem } from "@/lib/plex/types"
import { formatDuration } from "@/lib/utils/format"

interface TopShowSlideProps {
  shows: TopItem[]
  totalShows: number
  totalEpisodes: number
}

export function TopShowSlide({
  shows,
  totalShows,
  totalEpisodes,
}: TopShowSlideProps) {
  if (shows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        <p className="text-xl text-zinc-400">No shows watched this year</p>
      </div>
    )
  }

  const topShow = shows[0]
  const runnerUps = shows.slice(1, 5)

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-xl text-zinc-400">Your top shows</p>

      {/* #1 Show - Featured */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {topShow.thumb ? (
            <div className="relative h-36 w-56 overflow-hidden rounded-xl shadow-2xl shadow-[#E5A00D]/20">
              {/* eslint-disable-next-line @next/next/no-img-element -- Plex thumbnails are from dynamic external servers */}
              <img
                src={topShow.thumb}
                alt={topShow.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="flex h-36 w-56 items-center justify-center rounded-xl bg-zinc-800">
              <svg
                className="h-12 w-12 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E5A00D] text-sm font-bold text-black">
            #1
          </div>
        </div>
        <div className="min-w-0 max-w-[200px] text-left">
          <h2 className="text-xl font-bold">{topShow.title}</h2>
          <p className="text-sm text-zinc-400">
            {topShow.count} {topShow.count === 1 ? "episode" : "episodes"} •{" "}
            {formatDuration(topShow.totalDurationMs)}
          </p>
        </div>
      </div>

      {/* Runner-ups */}
      {runnerUps.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          {runnerUps.map((show, index) => (
            <div
              key={show.title}
              className="flex items-center gap-3 rounded-lg bg-zinc-900/50 p-2"
            >
              <span className="w-6 text-sm font-bold text-zinc-500">
                #{index + 2}
              </span>
              {show.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element -- Plex thumbnails are from dynamic external servers
                <img
                  src={show.thumb}
                  alt={show.title}
                  className="h-10 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-16 items-center justify-center rounded bg-zinc-800">
                  <svg
                    className="h-4 w-4 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium truncate">{show.title}</p>
                <p className="text-xs text-zinc-500">
                  {show.count} eps • {formatDuration(show.totalDurationMs)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex gap-4">
        <div className="rounded-2xl bg-zinc-900 px-4 py-2">
          <p className="text-sm text-zinc-400">
            <span className="font-bold text-white">{totalShows}</span> shows
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900 px-4 py-2">
          <p className="text-sm text-zinc-400">
            <span className="font-bold text-white">{totalEpisodes}</span>{" "}
            episodes
          </p>
        </div>
      </div>
    </div>
  )
}
