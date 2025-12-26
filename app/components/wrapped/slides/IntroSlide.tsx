"use client"

import Image from "next/image"

interface IntroSlideProps {
  year: number
}

export function IntroSlide({ year }: IntroSlideProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="animate-bounce">
        <Image
          src="/icon.png"
          alt="Plex Wrapped"
          width={120}
          height={120}
          className="drop-shadow-2xl"
          priority
        />
      </div>
      <div className="space-y-4">
        <h1 className="text-6xl font-bold tracking-tight">
          Your <span className="text-[#E5A00D]">{year}</span>
        </h1>
        <h2 className="text-4xl font-bold">Wrapped</h2>
      </div>
      <p className="text-xl text-zinc-400">
        Let&apos;s see what you watched this year
      </p>
    </div>
  )
}
