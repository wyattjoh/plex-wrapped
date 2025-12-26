"use client"

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < current ? "bg-[#E5A00D]" : "bg-zinc-700"
          } ${i === current - 1 ? "animate-pulse" : ""}`}
        />
      ))}
    </div>
  )
}
