import { plexServerFetch } from "./client"
import { debug } from "@/lib/utils/debug"

interface MetadataResponse {
  MediaContainer: {
    size: number
    Metadata?: Array<{
      ratingKey: string
      type: string
      title: string
      duration?: number // Duration in milliseconds
    }>
  }
}

export interface ItemDuration {
  ratingKey: string
  duration: number // milliseconds
}

// Maximum items per batch request (Plex has URL length limits)
const BATCH_SIZE = 50

/**
 * Fetches duration metadata for multiple items from a Plex server.
 * Uses batch requests to efficiently fetch metadata for many items.
 */
export async function fetchItemDurations(
  serverUrl: string,
  serverName: string,
  token: string,
  clientId: string,
  ratingKeys: string[]
): Promise<Map<string, number>> {
  const durations = new Map<string, number>()

  if (ratingKeys.length === 0) {
    return durations
  }

  // Deduplicate ratingKeys
  const uniqueKeys = [...new Set(ratingKeys)]

  debug(
    "metadata",
    `[${serverName}] Fetching duration for ${uniqueKeys.length} unique items`
  )

  // Split into batches to avoid URL length limits
  const batches: string[][] = []
  for (let i = 0; i < uniqueKeys.length; i += BATCH_SIZE) {
    batches.push(uniqueKeys.slice(i, i + BATCH_SIZE))
  }

  debug("metadata", `[${serverName}] Split into ${batches.length} batches`)

  // Process batches in parallel (but limit concurrency to avoid overwhelming server)
  const MAX_CONCURRENT = 3
  for (let i = 0; i < batches.length; i += MAX_CONCURRENT) {
    const batchPromises = batches.slice(i, i + MAX_CONCURRENT).map(async (batch, batchIndex) => {
      const actualBatchIndex = i + batchIndex
      try {
        // Plex supports comma-separated ratingKeys in the URL
        const keysPath = batch.join(",")
        const response = await plexServerFetch<MetadataResponse>(
          serverUrl,
          `/library/metadata/${keysPath}`,
          {
            clientId,
            token,
          }
        )

        const items = response.MediaContainer?.Metadata ?? []
        for (const item of items) {
          if (item.duration !== undefined) {
            durations.set(item.ratingKey, item.duration)
          }
        }

        debug(
          "metadata",
          `[${serverName}] Batch ${actualBatchIndex + 1}/${batches.length}: Got ${items.length} items with duration`
        )
      } catch (error) {
        console.error(
          `[${serverName}] Failed to fetch metadata batch ${actualBatchIndex + 1}:`,
          error instanceof Error ? error.message : error
        )
      }
    })

    await Promise.all(batchPromises)
  }

  debug(
    "metadata",
    `[${serverName}] Fetched duration for ${durations.size}/${uniqueKeys.length} items`
  )

  return durations
}

/**
 * Enriches history entries with duration data by fetching metadata from servers.
 * Groups entries by server and fetches metadata in batches.
 */
export async function enrichHistoryWithDurations<
  T extends {
    ratingKey: string
    serverUri: string | undefined
    serverName: string | undefined
    duration: number | undefined
  }
>(
  history: T[],
  serverTokens: Map<string, { token: string; clientId: string }>
): Promise<void> {
  // Group entries by server
  const entriesByServer = new Map<string, T[]>()
  for (const entry of history) {
    if (!entry.serverUri) {
      continue
    }
    const existing = entriesByServer.get(entry.serverUri) ?? []
    existing.push(entry)
    entriesByServer.set(entry.serverUri, existing)
  }

  debug(
    "metadata",
    `Enriching duration for ${history.length} entries across ${entriesByServer.size} servers`
  )

  // Fetch durations from each server in parallel
  const serverPromises = [...entriesByServer.entries()].map(
    async ([serverUri, entries]) => {
      const serverInfo = serverTokens.get(serverUri)
      if (!serverInfo) {
        debug("metadata", `No token found for server: ${serverUri}`)
        return
      }

      const serverName = entries[0]?.serverName ?? serverUri
      const ratingKeys = entries.map((e) => e.ratingKey)

      const durations = await fetchItemDurations(
        serverUri,
        serverName,
        serverInfo.token,
        serverInfo.clientId,
        ratingKeys
      )

      // Update entries with duration
      let enrichedCount = 0
      for (const entry of entries) {
        const duration = durations.get(entry.ratingKey)
        if (duration !== undefined) {
          entry.duration = duration
          enrichedCount++
        }
      }

      debug(
        "metadata",
        `[${serverName}] Enriched ${enrichedCount}/${entries.length} entries with duration`
      )
    }
  )

  await Promise.all(serverPromises)

  // Log summary
  const withDuration = history.filter((e) => e.duration !== undefined).length
  debug(
    "metadata",
    `Duration enrichment complete: ${withDuration}/${history.length} entries have duration`
  )
}
