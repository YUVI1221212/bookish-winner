"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiAnimationProps {
  active: boolean
  duration?: number
}

export default function ConfettiAnimation({ active, duration = 3000 }: ConfettiAnimationProps) {
  const [pieces, setPieces] = useState<
    Array<{
      id: number
      x: number
      y: number
      rotation: number
      color: string
      size: number
    }>
  >([])

  useEffect(() => {
    if (active) {
      // Generate confetti pieces
      const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"]
      const newPieces = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: 50 + (Math.random() * 40 - 20), // Center +/- 20%
        y: 0,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }))
      setPieces(newPieces)

      // Clear confetti after duration
      const timer = setTimeout(() => {
        setPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, duration])

  if (!active && pieces.length === 0) return null

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
          initial={{ y: "0%", x: `${piece.x}%`, rotate: 0 }}
          animate={{
            y: "100vh",
            x: `${piece.x + (Math.random() * 20 - 10)}%`,
            rotate: piece.rotation + Math.random() * 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
