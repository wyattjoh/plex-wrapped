import { NextResponse } from "next/server"
import { createPin, buildAuthUrl } from "@/lib/plex/auth"
import { setPendingAuth } from "@/lib/session/cookies"

export async function POST(): Promise<NextResponse> {
  try {
    // Generate a unique client identifier for this session
    const clientId = crypto.randomUUID()

    // Create a PIN with Plex
    const pin = await createPin(clientId)

    // Store the PIN info for the callback
    await setPendingAuth({
      pinId: pin.id,
      clientId,
    })

    // Build the callback URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const callbackUrl = `${appUrl}/auth/callback`

    // Build the Plex auth URL
    const authUrl = buildAuthUrl(clientId, pin.code, callbackUrl)

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("Failed to create Plex PIN:", error)
    return NextResponse.json(
      { error: "Failed to initiate Plex authentication" },
      { status: 500 }
    )
  }
}
