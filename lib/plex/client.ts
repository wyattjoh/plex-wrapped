const PLEX_TV_BASE = "https://plex.tv"

const APP_NAME = "Plex Wrapped"
const APP_VERSION = "1.0.0"

type PlexHeaders = Record<string, string>

function getBaseHeaders(clientId: string, token?: string): PlexHeaders {
  const headers: PlexHeaders = {
    "X-Plex-Client-Identifier": clientId,
    "X-Plex-Product": APP_NAME,
    "X-Plex-Version": APP_VERSION,
    Accept: "application/json",
  }

  if (token) {
    headers["X-Plex-Token"] = token
  }

  return headers
}

export async function plexTvFetch<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST"
    clientId: string
    token?: string
    body?: URLSearchParams
  }
): Promise<T> {
  const { method = "GET", clientId, token, body } = options

  const headers = getBaseHeaders(clientId, token)

  const response = await fetch(`${PLEX_TV_BASE}${endpoint}`, {
    method,
    headers: {
      ...headers,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body?.toString(),
  })

  if (!response.ok) {
    throw new Error(`Plex API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function plexServerFetch<T>(
  serverUrl: string,
  endpoint: string,
  options: {
    clientId: string
    token: string
    params?: Record<string, string>
  }
): Promise<T> {
  const { clientId, token, params } = options

  const url = new URL(`${serverUrl}${endpoint}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }

  // Add token as query param for server requests
  url.searchParams.set("X-Plex-Token", token)

  const headers = getBaseHeaders(clientId, token)

  // Use AbortController for timeout (30 seconds)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(
        `Plex Server API error: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Plex Server timeout: ${serverUrl}`)
    }

    throw error
  }
}
