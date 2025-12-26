import Image from "next/image"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session/cookies"
import { LoginButton } from "@/app/components/auth/LoginButton"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error: string | undefined }>
}) {
  // Check if user is already authenticated
  const session = await getSession()
  if (session) {
    redirect("/wrapped")
  }

  const { error } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black px-4">
      <main className="flex flex-col items-center gap-12 text-center">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/icon.png"
            alt="Plex Wrapped"
            width={96}
            height={96}
            className="drop-shadow-2xl"
            priority
          />
          <h1 className="text-5xl font-bold tracking-tight">
            Plex <span className="text-[#E5A00D]">Wrapped</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Discover your watching habits from the past year. See your top
            movies, shows, genres, and more.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-900/50 px-4 py-2 text-red-200">
            {error === "auth_expired" && "Authentication expired. Please try again."}
            {error === "auth_failed" && "Authentication failed. Please try again."}
            {error === "auth_error" && "An error occurred. Please try again."}
          </div>
        )}

        {/* Login button */}
        <LoginButton />

        {/* Features */}
        <div className="mt-8 grid max-w-2xl gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-3 text-3xl">🎬</div>
            <h3 className="font-semibold">Top Movies</h3>
            <p className="mt-1 text-sm text-zinc-400">
              See which films you watched the most
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-3 text-3xl">📺</div>
            <h3 className="font-semibold">Top Shows</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Discover your binge-watching habits
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-3 text-3xl">⏱️</div>
            <h3 className="font-semibold">Watch Time</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Total hours spent watching
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-sm text-zinc-500">
          Your data stays private. We only access your watch history.
        </p>
      </main>
    </div>
  )
}
