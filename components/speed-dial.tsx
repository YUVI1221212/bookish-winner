"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface SpeedDialProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export default function SpeedDial({ value, onChange, min = 0, max = 100, step = 5 }: SpeedDialProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dialRef = useRef<HTMLDivElement>(null)

  // Calculate rotation angle based on value
  const getRotationFromValue = (val: number) => {
    // Map value range to rotation range (0-270 degrees)
    return ((val - min) / (max - min)) * 270 - 135
  }

  // Calculate value from rotation angle
  const getValueFromRotation = (rotation: number) => {
    // Map rotation range to value range
    const normalizedRotation = rotation + 135
    const percentage = Math.max(0, Math.min(1, normalizedRotation / 270))
    const rawValue = min + percentage * (max - min)
    // Round to nearest step
    return Math.round(rawValue / step) * step
  }

  const rotation = getRotationFromValue(value)

  // Handle mouse/touch events
  const handlePointerDown = () => {
    setIsDragging(true)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dialRef.current) return

    const rect = dialRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate angle from center to pointer
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

    // Adjust angle to match our rotation system
    let adjustedAngle = 90 - angle
    if (adjustedAngle < -135) adjustedAngle = -135
    if (adjustedAngle > 135) adjustedAngle = 135

    const newValue = getValueFromRotation(adjustedAngle)
    onChange(newValue)
  }

  // Add global event listeners
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("pointerup", handleGlobalPointerUp)
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp)
    }
  }, [])

  // Create dial marks
  const marks = Array.from({ length: 11 }).map((_, i) => {
    const markRotation = -135 + (i * 270) / 10
    return (
      <div
        key={i}
        className="speed-dial-mark"
        style={{
          transform: `rotate(${markRotation}deg)`,
          height: i % 5 === 0 ? 15 : 10,
          opacity: i % 5 === 0 ? 0.8 : 0.5,
        }}
      />
    )
  })

  // Get speed label
  const getSpeedLabel = () => {
    if (value === 0) return "OFF"
    if (value <= 20) return "LOW"
    if (value <= 60) return "MED"
    return "HIGH"
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={dialRef} className="speed-dial" onPointerMove={handlePointerMove}>
        <div className="speed-dial-marks">{marks}</div>
        <div className="speed-dial-inner" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          <motion.div
            className="speed-dial-handle"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="speed-dial-value">{value}</div>
        </div>
      </div>
      <div className="mt-2 text-lg font-bold">{getSpeedLabel()}</div>
    </div>
  )
}
