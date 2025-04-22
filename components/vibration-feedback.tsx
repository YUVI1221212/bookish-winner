"use client"

import type React from "react"

interface VibrationFeedbackProps {
  children: React.ReactNode
  onClick?: () => void
  duration?: number
}

export default function VibrationFeedback({ children, onClick, duration = 50 }: VibrationFeedbackProps) {
  const handleClick = () => {
    // Check if vibration API is supported
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }

    // Call the original onClick handler if provided
    if (onClick) {
      onClick()
    }
  }

  return <div onClick={handleClick}>{children}</div>
}
