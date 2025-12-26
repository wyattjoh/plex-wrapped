import { NextResponse } from "next/server"
import { getSession } from "@/lib/session/cookies"
import { getServers } from "@/lib/plex/servers"

export async function GET(): Promise<NextResponse> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const servers = await getServers(session.token, session.clientId)

    if (servers.length === 0) {
      return NextResponse.json(
        {
          error: "No Plex servers found with remote access enabled",
          code: "NO_SERVERS",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ servers })
  } catch (error) {
    console.error("Failed to fetch servers:", error)
    return NextResponse.json(
      { error: "Failed to fetch Plex servers" },
      { status: 500 }
    )
  }
}
