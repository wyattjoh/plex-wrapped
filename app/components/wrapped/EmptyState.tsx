"use client"

import { Button } from "@/app/components/ui/Button"

type EmptyStateType = "no-servers" | "no-history"

interface EmptyStateProps {
  type: EmptyStateType
  year: number
}

function getContent(type: EmptyStateType, year: number) {
  if (type === "no-servers") {
    return {
      icon: (
        <svg
          className="h-10 w-10 text-orange-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
      title: "No Plex Servers Found",
      description:
        "We couldn't find any Plex servers with remote access enabled. Make sure remote access is enabled in your Plex server settings.",
    }
  }

  return {
    icon: (
      <svg
        className="h-10 w-10 text-orange-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
    title: `No Watch History for ${year}`,
    description: `It looks like you haven't watched anything in ${year} yet, or your viewing history from this year isn't available on the connected servers. Start watching something and check back later!`,
  }
}

export function EmptyState({ type, year }: EmptyStateProps) {
  const { icon, title, description } = getContent(type, year)

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black p-8">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-900/50">
          {icon}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
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
