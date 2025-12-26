import { cookies } from "next/headers"
import type { PlexSession } from "@/lib/plex/types"

const SESSION_COOKIE_NAME = "plex_session"
const PENDING_AUTH_COOKIE_NAME = "plex_pending_auth"

export interface PendingAuth {
  pinId: number
  clientId: string
}

export async function getSession(): Promise<PlexSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as PlexSession
  } catch {
    return null
  }
}

export async function setSession(session: PlexSession): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    // No maxAge = session cookie (cleared when browser closes)
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getPendingAuth(): Promise<PendingAuth | null> {
  const cookieStore = await cookies()
  const pendingCookie = cookieStore.get(PENDING_AUTH_COOKIE_NAME)

  if (!pendingCookie) {
    return null
  }

  try {
    return JSON.parse(pendingCookie.value) as PendingAuth
  } catch {
    return null
  }
}

export async function setPendingAuth(pending: PendingAuth): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(PENDING_AUTH_COOKIE_NAME, JSON.stringify(pending), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 300, // 5 minutes
  })
}

export async function clearPendingAuth(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(PENDING_AUTH_COOKIE_NAME)
}
