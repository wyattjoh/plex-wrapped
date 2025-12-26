import { NextResponse, type NextRequest } from "next/server"
import { checkPin, getUser } from "@/lib/plex/auth"
import {
  getPendingAuth,
  clearPendingAuth,
  setSession,
} from "@/lib/session/cookies"
import { getServers, getBestConnection } from "@/lib/plex/servers"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    // Get the pending auth info from cookie
    const pendingAuth = await getPendingAuth()

    if (!pendingAuth) {
      return NextResponse.redirect(
        new URL("/?error=auth_expired", request.url)
      )
    }

    const { pinId, clientId } = pendingAuth

    // Check the PIN to get the auth token
    const pin = await checkPin(pinId, clientId)

    if (!pin.authToken) {
      return NextResponse.redirect(
        new URL("/?error=auth_failed", request.url)
      )
    }

    // Fetch user info to get account ID
    const user = await getUser(clientId, pin.authToken)

    // Clear the pending auth cookie
    await clearPendingAuth()

    // Fetch servers and build token map for image proxying
    const servers = await getServers(pin.authToken, clientId)
    const serverTokens: Record<string, string> = {}
    for (const server of servers) {
      const connection = getBestConnection(server)
      if (connection) {
        serverTokens[connection.uri] = server.accessToken
      }
    }

    // Set the session cookie with the token, account ID, and server tokens
    await setSession({
      token: pin.authToken,
      clientId,
      accountId: user.id,
      serverTokens,
    })

    // Redirect to the wrapped page
    return NextResponse.redirect(new URL("/wrapped", appUrl))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/?error=auth_error", request.url))
  }
}
