import { plexTvFetch } from "./client"
import type { PlexPin } from "./types"

interface PinResponse {
  id: number
  code: string
  authToken: string | null
  expiresAt: string
  clientIdentifier: string
}

interface UserResponse {
  id: number
  uuid: string
  email: string
  username: string
  title: string
  thumb: string
}

export interface PlexUser {
  id: number
  uuid: string
  email: string
  username: string
  title: string
  thumb: string
}

export async function createPin(clientId: string): Promise<PlexPin> {
  const response = await plexTvFetch<PinResponse>("/api/v2/pins", {
    method: "POST",
    clientId,
    body: new URLSearchParams({ strong: "true" }),
  })

  return {
    id: response.id,
    code: response.code,
    authToken: response.authToken,
    expiresAt: response.expiresAt,
    clientIdentifier: response.clientIdentifier,
  }
}

export async function checkPin(
  pinId: number,
  clientId: string
): Promise<PlexPin> {
  const response = await plexTvFetch<PinResponse>(`/api/v2/pins/${pinId}`, {
    method: "GET",
    clientId,
  })

  return {
    id: response.id,
    code: response.code,
    authToken: response.authToken,
    expiresAt: response.expiresAt,
    clientIdentifier: response.clientIdentifier,
  }
}

export function buildAuthUrl(
  clientId: string,
  code: string,
  callbackUrl: string
): string {
  const params = new URLSearchParams({
    clientID: clientId,
    code,
    "context[device][product]": "Plex Wrapped",
    forwardUrl: callbackUrl,
  })

  return `https://app.plex.tv/auth#?${params.toString()}`
}

export async function getUser(
  clientId: string,
  token: string
): Promise<PlexUser> {
  const response = await plexTvFetch<UserResponse>("/api/v2/user", {
    method: "GET",
    clientId,
    token,
  })

  return {
    id: response.id,
    uuid: response.uuid,
    email: response.email,
    username: response.username,
    title: response.title,
    thumb: response.thumb,
  }
}
