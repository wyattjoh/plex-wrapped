// Plex PIN auth response
export interface PlexPin {
  id: number
  code: string
  authToken: string | null
  expiresAt: string
  clientIdentifier: string
}

// Plex server connection
export interface PlexConnection {
  uri: string
  local: boolean
  relay: boolean
  protocol: string
  address: string
  port: number
}

// Plex server from resources API
export interface PlexServer {
  name: string
  clientIdentifier: string
  owned: boolean
  accessToken: string // Server-specific access token
  connections: PlexConnection[]
}

// Watch history entry from PMS
export interface WatchHistoryEntry {
  historyKey: string
  ratingKey: string
  viewedAt: number // epoch timestamp
  accountID: number
  type: "movie" | "episode" | "track"
  title: string
  grandparentTitle: string | undefined // show name for episodes
  parentTitle: string | undefined // season name
  thumb: string | undefined
  duration: number | undefined // ms
  // Server info for multi-server aggregation
  serverName: string | undefined
  serverUri: string | undefined
}

// Media metadata from library endpoint
export interface MediaMetadata {
  ratingKey: string
  title: string
  type: "movie" | "show" | "episode"
  duration: number // ms
  genres: string[]
  year: number | undefined
  thumb: string | undefined
  art: string | undefined
}

// Top item stat
export interface TopItem {
  title: string
  count: number
  thumb: string | undefined
  totalDurationMs: number
  ratingKey: string | undefined
}

// Genre stat
export interface GenreStat {
  genre: string
  count: number
  percentage: number
}

// Month stat
export interface MonthStat {
  month: number // 1-12
  watchTimeMs: number
  itemCount: number
}

// Computed wrapped stats
export interface WrappedStats {
  year: number
  totalWatchTimeMs: number
  totalItemsWatched: number
  movieCount: number
  episodeCount: number
  uniqueMovies: number
  uniqueShows: number
  topMovies: TopItem[]
  topShows: TopItem[]
  topGenres: GenreStat[]
  monthlyBreakdown: MonthStat[]
  mostActiveMonth: MonthStat | undefined
}

// Session data stored in cookie
export interface PlexSession {
  token: string
  clientId: string
  accountId: number
  // Server URI -> access token mapping for image proxying
  serverTokens: Record<string, string>
}
