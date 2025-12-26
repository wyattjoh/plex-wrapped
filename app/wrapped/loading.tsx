import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Plex logo */}
        <div className="animate-pulse">
          <Image
            src="/icon.png"
            alt="Plex Wrapped"
            width={96}
            height={96}
            className="drop-shadow-2xl"
            priority
          />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Loading your Wrapped...</h2>
          <p className="text-zinc-400">Gathering your watch history</p>
        </div>

        {/* Loading bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
          <div className="loading-bar h-full w-1/2 rounded-full bg-[#E5A00D]" />
        </div>
      </div>
    </div>
  )
}
