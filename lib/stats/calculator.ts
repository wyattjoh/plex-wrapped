import type {
  WatchHistoryEntry,
  WrappedStats,
  TopItem,
  MonthStat,
  GenreStat,
} from "@/lib/plex/types"
import { debug, debugTable } from "@/lib/utils/debug"

interface MovieWatch {
  ratingKey: string
  title: string
  thumb: string | undefined
  count: number
  totalDurationMs: number
}

interface ShowWatch {
  title: string
  thumb: string | undefined
  episodeCount: number
  totalDurationMs: number
}

export function calculateWrappedStats(
  history: WatchHistoryEntry[],
  year: number
): WrappedStats {
  debug("stats", `Starting calculation for year ${year}`)
  debug("stats", `Total history entries received: ${history.length}`)

  // Log sample of history entries to understand their structure
  if (history.length > 0) {
    debug("stats", "First 5 history entries (sample):")
    for (const entry of history.slice(0, 5)) {
      debug("stats", `  Entry:`, {
        type: entry.type,
        title: entry.title,
        grandparentTitle: entry.grandparentTitle,
        duration: entry.duration,
        viewedAt: entry.viewedAt,
        viewedAtDate: new Date(entry.viewedAt * 1000).toISOString(),
        ratingKey: entry.ratingKey,
        serverName: entry.serverName,
      })
    }
  }

  // Count entry types
  const typeCounts = new Map<string, number>()
  for (const entry of history) {
    typeCounts.set(entry.type, (typeCounts.get(entry.type) ?? 0) + 1)
  }
  debug("stats", "Entry type breakdown:", Object.fromEntries(typeCounts))

  // Check for entries with missing duration
  const missingDuration = history.filter((e) => e.duration === undefined)
  debug(
    "stats",
    `Entries with missing duration: ${missingDuration.length}/${history.length}`
  )
  if (missingDuration.length > 0 && missingDuration.length <= 10) {
    debug("stats", "Entries missing duration:", missingDuration)
  }

  // Track unique movies and their watch counts
  const movieWatches = new Map<string, MovieWatch>()

  // Track shows by grandparentTitle (show name)
  const showWatches = new Map<string, ShowWatch>()

  // Track monthly stats
  const monthlyStats: MonthStat[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    watchTimeMs: 0,
    itemCount: 0,
  }))

  let totalWatchTimeMs = 0
  let movieCount = 0
  let episodeCount = 0
  let skippedCount = 0

  for (const entry of history) {
    const duration = entry.duration ?? 0
    totalWatchTimeMs += duration

    // Get month (0-indexed from Date, but our monthlyStats is 1-indexed)
    const date = new Date(entry.viewedAt * 1000)
    const monthIndex = date.getMonth()
    monthlyStats[monthIndex].watchTimeMs += duration
    monthlyStats[monthIndex].itemCount++

    if (entry.type === "movie") {
      movieCount++

      const existing = movieWatches.get(entry.ratingKey)
      if (existing) {
        existing.count++
        existing.totalDurationMs += duration
      } else {
        movieWatches.set(entry.ratingKey, {
          ratingKey: entry.ratingKey,
          title: entry.title,
          thumb: entry.thumb,
          count: 1,
          totalDurationMs: duration,
        })
      }
    } else if (entry.type === "episode") {
      episodeCount++

      const showTitle = entry.grandparentTitle ?? entry.title
      const existing = showWatches.get(showTitle)
      if (existing) {
        existing.episodeCount++
        existing.totalDurationMs += duration
        // Update thumb if we don't have one yet
        if (!existing.thumb && entry.thumb) {
          existing.thumb = entry.thumb
        }
      } else {
        showWatches.set(showTitle, {
          title: showTitle,
          thumb: entry.thumb,
          episodeCount: 1,
          totalDurationMs: duration,
        })
      }
    } else {
      skippedCount++
    }
  }

  debug("stats", "Processing summary:", {
    movieCount,
    episodeCount,
    skippedCount,
    totalWatchTimeMs,
    totalWatchTimeHours: Math.round(totalWatchTimeMs / 1000 / 60 / 60 * 100) / 100,
    uniqueMovies: movieWatches.size,
    uniqueShows: showWatches.size,
  })

  // Sort movies by total watch duration
  const sortedMovies = [...movieWatches.values()]
    .sort((a, b) => b.totalDurationMs - a.totalDurationMs)
    .slice(0, 10)

  const topMovies: TopItem[] = sortedMovies.map((movie) => ({
    title: movie.title,
    count: movie.count,
    thumb: movie.thumb,
    totalDurationMs: movie.totalDurationMs,
    ratingKey: movie.ratingKey,
  }))

  // Sort shows by total watch duration
  const sortedShows = [...showWatches.values()]
    .sort((a, b) => b.totalDurationMs - a.totalDurationMs)
    .slice(0, 10)

  const topShows: TopItem[] = sortedShows.map((show) => ({
    title: show.title,
    count: show.episodeCount,
    thumb: show.thumb,
    totalDurationMs: show.totalDurationMs,
    ratingKey: undefined,
  }))

  // Calculate genre stats (placeholder - we'd need metadata for real genres)
  // For now, we'll skip genres since we don't have that data from history
  const topGenres: GenreStat[] = []

  // Find most active month
  const mostActiveMonth = monthlyStats.reduce<MonthStat | undefined>(
    (max, current) => {
      if (!max || current.itemCount > max.itemCount) {
        return current
      }
      return max
    },
    undefined
  )

  // Log top movies (sorted by duration)
  debugTable(
    "stats",
    "Top Movies (by watch time):",
    topMovies.map((m) => ({
      title: m.title,
      count: m.count,
      durationHours: Math.round((m.totalDurationMs / 1000 / 60 / 60) * 100) / 100,
      hasThumb: !!m.thumb,
    }))
  )

  // Debug: log sample thumb URLs for movies
  if (topMovies[0]?.thumb) {
    debug("stats", `Top movie thumb URL sample: ${topMovies[0].thumb}`)
  }

  // Log top shows (sorted by duration)
  debugTable(
    "stats",
    "Top Shows (by watch time):",
    topShows.map((s) => ({
      title: s.title,
      episodes: s.count,
      durationHours: Math.round((s.totalDurationMs / 1000 / 60 / 60) * 100) / 100,
      hasThumb: !!s.thumb,
    }))
  )

  // Debug: log sample thumb URLs for shows
  if (topShows[0]?.thumb) {
    debug("stats", `Top show thumb URL sample: ${topShows[0].thumb}`)
  }

  // Log monthly breakdown
  debugTable(
    "stats",
    "Monthly Breakdown:",
    monthlyStats.map((m) => ({
      month: m.month,
      items: m.itemCount,
      watchTimeHours: Math.round((m.watchTimeMs / 1000 / 60 / 60) * 100) / 100,
    }))
  )

  const result: WrappedStats = {
    year,
    totalWatchTimeMs,
    totalItemsWatched: history.length,
    movieCount,
    episodeCount,
    uniqueMovies: movieWatches.size,
    uniqueShows: showWatches.size,
    topMovies,
    topShows,
    topGenres,
    monthlyBreakdown: monthlyStats,
    mostActiveMonth,
  }

  debug("stats", "Final stats result:", {
    year: result.year,
    totalWatchTimeMs: result.totalWatchTimeMs,
    totalWatchTimeHours:
      Math.round((result.totalWatchTimeMs / 1000 / 60 / 60) * 100) / 100,
    totalItemsWatched: result.totalItemsWatched,
    movieCount: result.movieCount,
    episodeCount: result.episodeCount,
    uniqueMovies: result.uniqueMovies,
    uniqueShows: result.uniqueShows,
    topMoviesCount: result.topMovies.length,
    topShowsCount: result.topShows.length,
    mostActiveMonth: result.mostActiveMonth,
  })

  return result
}
