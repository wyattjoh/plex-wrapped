"use client"

import { type ReactNode } from "react"

interface SlideTransitionProps {
  children: ReactNode
  isActive: boolean
}

export function SlideTransition({ children, isActive }: SlideTransitionProps) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        isActive
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      {children}
    </div>
  )
}
