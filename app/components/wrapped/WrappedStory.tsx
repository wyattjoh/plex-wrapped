"use client"

import { useState, useCallback, useEffect } from "react"
import type { WrappedStats } from "@/lib/plex/types"
import type { ServerFetchResult } from "@/lib/plex/history"
import { ProgressBar } from "@/app/components/ui/ProgressBar"
import { SlideTransition } from "./SlideTransition"
import { IntroSlide } from "./slides/IntroSlide"
import { TotalTimeSlide } from "./slides/TotalTimeSlide"
import { TopMovieSlide } from "./slides/TopMovieSlide"
import { TopShowSlide } from "./slides/TopShowSlide"
import { TopGenresSlide } from "./slides/TopGenresSlide"
import { MonthlySlide } from "./slides/MonthlySlide"
import { SummarySlide } from "./slides/SummarySlide"

interface WrappedStoryProps {
  stats: WrappedStats
  serverResults: ServerFetchResult[]
}

export function WrappedStory({ stats, serverResults }: WrappedStoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    <IntroSlide key="intro" year={stats.year} />,
    <TotalTimeSlide
      key="time"
      totalWatchTimeMs={stats.totalWatchTimeMs}
      totalItemsWatched={stats.totalItemsWatched}
    />,
    <TopMovieSlide
      key="movie"
      movies={stats.topMovies}
      totalMovies={stats.uniqueMovies}
    />,
    <TopShowSlide
      key="show"
      shows={stats.topShows}
      totalShows={stats.uniqueShows}
      totalEpisodes={stats.episodeCount}
    />,
    <TopGenresSlide
      key="genres"
      movieCount={stats.movieCount}
      episodeCount={stats.episodeCount}
    />,
    <MonthlySlide
      key="monthly"
      monthlyBreakdown={stats.monthlyBreakdown}
      mostActiveMonth={stats.mostActiveMonth}
    />,
    <SummarySlide key="summary" stats={stats} serverResults={serverResults} />,
  ]

  const totalSlides = slides.length

  const goToNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1)
    }
  }, [currentSlide, totalSlides])

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }, [currentSlide])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goToNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Progress bar */}
      <div className="p-4">
        <ProgressBar current={currentSlide + 1} total={totalSlides} />
      </div>

      {/* Slide container */}
      <div
        className="relative flex-1 cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          const halfWidth = rect.width / 2

          if (clickX < halfWidth) {
            goToPrev()
          } else {
            goToNext()
          }
        }}
      >
        {slides.map((slide, index) => (
          <SlideTransition key={index} isActive={index === currentSlide}>
            {slide}
          </SlideTransition>
        ))}
      </div>

      {/* Navigation hint */}
      <div className="p-4 text-center text-sm text-zinc-500">
        {currentSlide < totalSlides - 1 ? (
          <span>Tap to continue →</span>
        ) : (
          <span>That&apos;s a wrap!</span>
        )}
      </div>
    </div>
  )
}
