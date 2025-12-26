"use client"

interface TopGenresSlideProps {
  movieCount: number
  episodeCount: number
}

export function TopGenresSlide({
  movieCount,
  episodeCount,
}: TopGenresSlideProps) {
  const total = movieCount + episodeCount
  const moviePercentage = total > 0 ? Math.round((movieCount / total) * 100) : 0
  const episodePercentage = total > 0 ? 100 - moviePercentage : 0

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
      <p className="text-xl text-zinc-400">Your viewing breakdown</p>

      <div className="w-full max-w-sm space-y-6">
        {/* Movies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              <span className="text-lg font-medium">Movies</span>
            </div>
            <span className="text-2xl font-bold text-[#E5A00D]">
              {moviePercentage}%
            </span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#E5A00D] transition-all duration-1000"
              style={{ width: `${moviePercentage}%` }}
            />
          </div>
          <p className="text-sm text-zinc-500">{movieCount} watched</p>
        </div>

        {/* TV Shows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📺</span>
              <span className="text-lg font-medium">TV Episodes</span>
            </div>
            <span className="text-2xl font-bold text-[#E5A00D]">
              {episodePercentage}%
            </span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#E5A00D] transition-all duration-1000"
              style={{ width: `${episodePercentage}%` }}
            />
          </div>
          <p className="text-sm text-zinc-500">{episodeCount} watched</p>
        </div>
      </div>

      <p className="mt-4 text-lg text-zinc-400">
        {moviePercentage > episodePercentage
          ? "You're a movie buff! 🎬"
          : moviePercentage < episodePercentage
            ? "You love binge-watching! 📺"
            : "A perfect balance! ⚖️"}
      </p>
    </div>
  )
}
