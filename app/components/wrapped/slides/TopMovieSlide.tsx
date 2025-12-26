"use client"

import type { TopItem } from "@/lib/plex/types"
import { formatDuration } from "@/lib/utils/format"

interface TopMovieSlideProps {
  movies: TopItem[]
  totalMovies: number
}

export function TopMovieSlide({ movies, totalMovies }: TopMovieSlideProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        <p className="text-xl text-zinc-400">No movies watched this year</p>
      </div>
    )
  }

  const topMovie = movies[0]
  const runnerUps = movies.slice(1, 5)

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-xl text-zinc-400">Your top movies</p>

      {/* #1 Movie - Featured */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {topMovie.thumb ? (
            <div className="relative h-48 w-32 overflow-hidden rounded-xl shadow-2xl shadow-[#E5A00D]/20">
              {/* eslint-disable-next-line @next/next/no-img-element -- Plex thumbnails are from dynamic external servers */}
              <img
                src={topMovie.thumb}
                alt={topMovie.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="flex h-48 w-32 items-center justify-center rounded-xl bg-zinc-800">
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
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
          )}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E5A00D] text-sm font-bold text-black">
            #1
          </div>
        </div>
        <div className="min-w-0 max-w-[200px] text-left">
          <h2 className="text-2xl font-bold">{topMovie.title}</h2>
          <p className="text-sm text-zinc-400">
            {topMovie.count} {topMovie.count === 1 ? "watch" : "watches"} •{" "}
            {formatDuration(topMovie.totalDurationMs)}
          </p>
        </div>
      </div>

      {/* Runner-ups */}
      {runnerUps.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          {runnerUps.map((movie, index) => (
            <div
              key={movie.ratingKey ?? movie.title}
              className="flex items-center gap-3 rounded-lg bg-zinc-900/50 p-2"
            >
              <span className="w-6 text-sm font-bold text-zinc-500">
                #{index + 2}
              </span>
              {movie.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element -- Plex thumbnails are from dynamic external servers
                <img
                  src={movie.thumb}
                  alt={movie.title}
                  className="h-12 w-8 rounded object-cover"
                />
              ) : (
                <div className="flex h-12 w-8 items-center justify-center rounded bg-zinc-800">
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
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"
                    />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium truncate">{movie.title}</p>
                <p className="text-xs text-zinc-500">
                  {formatDuration(movie.totalDurationMs)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 rounded-2xl bg-zinc-900 px-6 py-3">
        <p className="text-zinc-400">
          You watched{" "}
          <span className="font-bold text-white">{totalMovies}</span> unique
          movies
        </p>
      </div>
    </div>
  )
}
