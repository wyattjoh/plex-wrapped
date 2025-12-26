import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/session/cookies"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const serverUri = searchParams.get("server")
  const path = searchParams.get("path")

  if (!serverUri || !path) {
    return NextResponse.json(
      { error: "Missing server or path parameter" },
      { status: 400 }
    )
  }

  // Look up the token for this server
  const token = session.serverTokens[serverUri]

  if (!token) {
    return NextResponse.json(
      { error: "Unknown server" },
      { status: 400 }
    )
  }

  try {
    // Fetch the image from the Plex server
    const imageUrl = `${serverUri}${path}?X-Plex-Token=${token}`

    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      )
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg"
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    )
  }
}
