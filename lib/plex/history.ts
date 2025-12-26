import { plexServerFetch } from "./client"
import type { WatchHistoryEntry, PlexServer } from "./types"
import { getYearBounds } from "@/lib/utils/dates"
import { getBestConnection } from "./servers"
import { debug } from "@/lib/utils/debug"
import { enrichHistoryWithDurations } from "./metadata"

interface HistoryMediaContainer {
  MediaContainer: {
    size: number
    Metadata?: Array<{
      historyKey: string
      ratingKey: string
      viewedAt: number
      accountID: number
      type: "movie" | "episode" | "track"
      title: string
      grandparentTitle?: string
      parentTitle?: string
      thumb?: string
      duration?: number
    }>
  }
}

async function fetchServerHistory(
  serverUrl: string,
  serverName: string,
  token: string,
  clientId: string,
  year: number,
  accountId: number | undefined,
  isOwnedServer: boolean
): Promise<WatchHistoryEntry[]> {
  const { start, end } = getYearBounds(year)
  const allHistory: WatchHistoryEntry[] = []

  console.log(
    `[${serverName}] Looking for history from ${new Date(start * 1000).toISOString()} to ${new Date(end * 1000).toISOString()}`
  )

  // Determine which accountID to filter by:
  // - For owned servers: use local ID 1 (admin/owner account)
  // - For shared servers: use the user's plex.tv account ID
  const filterAccountId = isOwnedServer ? 1 : accountId

  if (filterAccountId !== undefined) {
    console.log(
      `[${serverName}] Filtering by accountID: ${filterAccountId}${isOwnedServer ? " (local admin ID for owned server)" : " (plex.tv ID)"}`
    )
  }

  let containerStart = 0
  const containerSize = 1000 // Plex default max

  while (true) {
    try {
      // Build params
      const params: Record<string, string> = {
        "X-Plex-Container-Start": containerStart.toString(),
        "X-Plex-Container-Size": containerSize.toString(),
        sort: "viewedAt:desc",
        // Filter to only entries within the target year
        // This dramatically reduces data transfer for servers with lots of history
        "viewedAt>=": start.toString(),
        "viewedAt<": end.toString(),
      }

      // Add accountID filter
      if (filterAccountId !== undefined) {
        params.accountID = filterAccountId.toString()
      }

      const response = await plexServerFetch<HistoryMediaContainer>(
        serverUrl,
        "/status/sessions/history/all",
        {
          clientId,
          token,
          params,
        }
      )

      console.log(
        `[${serverName}] Got ${response.MediaContainer?.Metadata?.length ?? 0} entries (container size: ${response.MediaContainer?.size ?? 0})`
      )

      const entries = response.MediaContainer?.Metadata ?? []

      if (entries.length === 0) {
        console.log(`[${serverName}] No more entries`)
        break
      }

      // Log first and last entry dates for debugging
      if (entries.length > 0) {
        const firstDate = new Date(entries[0].viewedAt * 1000).toISOString()
        const lastDate = new Date(
          entries[entries.length - 1].viewedAt * 1000
        ).toISOString()
        console.log(
          `[${serverName}] Entry date range: ${lastDate} to ${firstDate}`
        )

        // Debug: log raw API response structure for first few entries
        debug("history", `[${serverName}] Raw API response sample:`)
        for (const entry of entries.slice(0, 3)) {
          debug("history", `  Raw entry:`, entry)
        }

        // Debug: log sample thumb URL construction
        const sampleThumb = entries[0]?.thumb
        if (sampleThumb) {
          debug(
            "history",
            `[${serverName}] Sample thumb path: ${sampleThumb} (will be proxied via /api/image)`
          )
        }
      }

      // Filter entries within the target year
      for (const entry of entries) {
        // Skip entries outside our year range
        if (entry.viewedAt < start) {
          // History is ordered by viewedAt desc, so if we hit entries before our year,
          // we've gone past our range
          console.log(
            `[${serverName}] Found ${allHistory.length} entries for ${year}`
          )
          return allHistory
        }

        if (entry.viewedAt >= start && entry.viewedAt < end) {
          // Construct proxy URL for thumbnail
          // The thumb path is relative (e.g., /library/metadata/123/thumb/456)
          // We proxy through /api/image to avoid exposing tokens in client-side HTML
          let thumbUrl: string | undefined
          if (entry.thumb) {
            thumbUrl = `/api/image?server=${encodeURIComponent(serverUrl)}&path=${encodeURIComponent(entry.thumb)}`
          }

          allHistory.push({
            historyKey: entry.historyKey,
            ratingKey: entry.ratingKey,
            viewedAt: entry.viewedAt,
            accountID: entry.accountID,
            type: entry.type,
            title: entry.title,
            grandparentTitle: entry.grandparentTitle,
            parentTitle: entry.parentTitle,
            thumb: thumbUrl,
            duration: entry.duration,
            serverName,
            serverUri: serverUrl,
          })
        }
      }

      // If fewer entries than requested, we've reached the end
      if (entries.length < containerSize) {
        break
      }

      containerStart += containerSize
    } catch (error) {
      console.error(`Failed to fetch history from ${serverName}:`, error)
      // Continue with what we have rather than failing completely
      break
    }
  }

  console.log(
    `[${serverName}] Returning ${allHistory.length} entries for ${year}`
  )
  return allHistory
}

export interface ServerFetchResult {
  serverName: string
  success: boolean
  historyCount: number
  error: string | undefined
  connectionType: "relay" | "direct" | "none"
}

export interface AggregatedHistoryResult {
  history: WatchHistoryEntry[]
  serverResults: ServerFetchResult[]
}

export async function getAggregatedHistory(
  servers: PlexServer[],
  clientId: string,
  year: number,
  accountId: number | undefined
): Promise<AggregatedHistoryResult> {
  const serverResults: ServerFetchResult[] = []

  debug("history", `Fetching history for accountId: ${accountId}`)

  // Fetch history from all servers in parallel
  // Each server uses its own accessToken for authentication
  const historyPromises = servers.map(async (server) => {
    const connection = getBestConnection(server)

    if (!connection) {
      console.log(`No connections available for server: ${server.name}`)
      serverResults.push({
        serverName: server.name,
        success: false,
        historyCount: 0,
        error: "No remote connections available",
        connectionType: "none",
      })
      return []
    }

    const connectionType = connection.relay ? "relay" : "direct"
    console.log(
      `Fetching history from ${server.name} via ${connectionType}: ${connection.uri}`
    )

    try {
      const history = await fetchServerHistory(
        connection.uri,
        server.name,
        server.accessToken,
        clientId,
        year,
        accountId,
        server.owned
      )

      serverResults.push({
        serverName: server.name,
        success: true,
        historyCount: history.length,
        error: undefined,
        connectionType,
      })

      return history
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      console.error(`Failed to fetch from ${server.name}:`, errorMessage)

      serverResults.push({
        serverName: server.name,
        success: false,
        historyCount: 0,
        error: errorMessage,
        connectionType,
      })

      return []
    }
  })

  const results = await Promise.all(historyPromises)

  const allHistory: WatchHistoryEntry[] = []
  for (const serverHistory of results) {
    allHistory.push(...serverHistory)
  }

  // Sort by viewedAt descending (most recent first)
  allHistory.sort((a, b) => b.viewedAt - a.viewedAt)

  // Log summary
  const successCount = serverResults.filter((r) => r.success).length
  console.log(
    `Fetched history from ${successCount}/${servers.length} servers, ${allHistory.length} total items`
  )

  // Build server token map for metadata fetching
  const serverTokens = new Map<string, { token: string; clientId: string }>()
  for (const server of servers) {
    const connection = getBestConnection(server)
    if (connection) {
      serverTokens.set(connection.uri, {
        token: server.accessToken,
        clientId,
      })
    }
  }

  // Enrich history with duration data from metadata
  if (allHistory.length > 0) {
    console.log(`Fetching duration metadata for ${allHistory.length} items...`)
    await enrichHistoryWithDurations(allHistory, serverTokens)
    const withDuration = allHistory.filter((h) => h.duration !== undefined).length
    console.log(`Duration enrichment complete: ${withDuration}/${allHistory.length} items`)
  }

  return { history: allHistory, serverResults }
}
