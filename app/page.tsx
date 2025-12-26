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

        {/* GitHub link */}
        <a
          href="https://github.com/wyattjoh/plex-wrapped"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-zinc-600 transition-colors hover:text-zinc-400"
          aria-label="View source on GitHub"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </main>
    </div>
  )
}
