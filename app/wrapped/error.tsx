"use client"

import { Button } from "@/app/components/ui/Button"
import { getCurrentYear } from "@/lib/utils/dates"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const year = getCurrentYear()

  function getErrorMessage(): { title: string; description: string } {
    if (error.message === "NO_SERVERS") {
      return {
        title: "No Plex Servers Found",
        description:
          "We couldn't find any Plex servers with remote access enabled. Make sure remote access is enabled in your Plex server settings.",
      }
    }

    if (error.message === "NO_HISTORY") {
      return {
        title: `No Watch History for ${year}`,
        description: `We couldn't find any watch history for ${year}. This might be because you haven't watched anything, or your server doesn't have history tracking enabled.`,
      }
    }

    return {
      title: "Something Went Wrong",
      description:
        "We encountered an error while loading your Wrapped. Please try again.",
    }
  }

  const { title, description } = getErrorMessage()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black p-8">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Error icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-900/50">
          <svg
            className="h-10 w-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={reset}>Try Again</Button>
          <form action="/auth/logout" method="post">
            <Button type="submit" variant="secondary">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
