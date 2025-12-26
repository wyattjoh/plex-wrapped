import { NextResponse } from "next/server"
import { clearSession } from "@/lib/session/cookies"

export async function POST(): Promise<NextResponse> {
  await clearSession()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return NextResponse.redirect(new URL("/", appUrl))
}
