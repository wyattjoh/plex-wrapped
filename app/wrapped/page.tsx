import { redirect } from "next/navigation"
import { getSession } from "@/lib/session/cookies"
import { getServers } from "@/lib/plex/servers"
import { getAggregatedHistory } from "@/lib/plex/history"
import { calculateWrappedStats } from "@/lib/stats/calculator"
import { getCurrentYear } from "@/lib/utils/dates"
import { WrappedStory } from "@/app/components/wrapped/WrappedStory"

export default async function WrappedPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  // Use current year since that's where recent watch data is
  const year = getCurrentYear()

  // Fetch servers
  const servers = await getServers(session.token, session.clientId)

  if (servers.length === 0) {
    throw new Error("NO_SERVERS")
  }

  // Fetch aggregated history from all servers
  // Each server uses its own accessToken for authentication
  const { history, serverResults } = await getAggregatedHistory(
    servers,
    session.clientId,
    year,
    session.accountId
  )

  if (history.length === 0) {
    throw new Error("NO_HISTORY")
  }

  // Calculate stats
  const stats = calculateWrappedStats(history, year)

  return <WrappedStory stats={stats} serverResults={serverResults} />
}
