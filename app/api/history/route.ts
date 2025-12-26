import { NextResponse } from "next/server"
import { getSession } from "@/lib/session/cookies"
import { getServers } from "@/lib/plex/servers"
import { getAggregatedHistory } from "@/lib/plex/history"
import { getCurrentYear } from "@/lib/utils/dates"

export async function GET(): Promise<NextResponse> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all servers
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

    // Get aggregated history from all servers
    const year = getCurrentYear()
    const { history, serverResults } = await getAggregatedHistory(
      servers,
      session.clientId,
      year,
      session.accountId
    )

    if (history.length === 0) {
      return NextResponse.json(
        {
          error: `No watch history found for ${year}`,
          code: "NO_HISTORY",
          year,
          serverResults,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      history,
      year,
      serverResults,
    })
  } catch (error) {
    console.error("Failed to fetch history:", error)
    return NextResponse.json(
      { error: "Failed to fetch watch history" },
      { status: 500 }
    )
  }
}
