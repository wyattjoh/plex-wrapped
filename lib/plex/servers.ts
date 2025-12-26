import { plexTvFetch } from "./client"
import type { PlexServer, PlexConnection } from "./types"

interface ResourceResponse {
  name: string
  clientIdentifier: string
  owned: boolean
  provides: string
  accessToken: string
  connections: Array<{
    uri: string
    local: boolean
    relay: boolean
    protocol: string
    address: string
    port: number
  }>
}

export async function getServers(
  token: string,
  clientId: string
): Promise<PlexServer[]> {
  const resources = await plexTvFetch<ResourceResponse[]>(
    "/api/v2/resources",
    {
      clientId,
      token,
    }
  )

  // Filter for servers (not players/clients) that have remote connections
  const servers = resources.filter((resource) =>
    resource.provides.includes("server")
  )

  console.log(
    `Found ${servers.length} Plex servers:`,
    servers.map((s) => ({
      name: s.name,
      owned: s.owned,
      connections: s.connections.length,
      remoteConnections: s.connections.filter((c) => !c.local).length,
    }))
  )

  return servers
    .map((server) => ({
      name: server.name,
      clientIdentifier: server.clientIdentifier,
      owned: server.owned,
      accessToken: server.accessToken,
      connections: server.connections
        .filter((conn) => !conn.local) // Only remote connections
        .map(
          (conn): PlexConnection => ({
            uri: conn.uri,
            local: conn.local,
            relay: conn.relay,
            protocol: conn.protocol,
            address: conn.address,
            port: conn.port,
          })
        ),
    }))
    .filter((server) => server.connections.length > 0) // Must have at least one remote connection
}

export function getBestConnection(server: PlexServer): PlexConnection | null {
  if (server.connections.length === 0) {
    return null
  }

  // Prefer relay connections - they're more reliable from cloud environments
  // Direct connections often fail due to firewalls/NAT
  const relayConnection = server.connections.find((conn) => conn.relay)
  if (relayConnection) {
    return relayConnection
  }

  // Fall back to direct connection
  return server.connections[0]
}
