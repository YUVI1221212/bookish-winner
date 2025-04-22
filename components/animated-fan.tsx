"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface AnimatedFanProps {
  speed: number
  size?: number
  color?: string
  blades?: number
}

export default function AnimatedFan({ speed, size = 100, color = "#ff3333", blades = 5 }: AnimatedFanProps) {
  const fanRef = useRef<HTMLDivElement>(null)

  // Calculate animation duration based on speed (lower speed = slower animation)
  const duration = speed > 0 ? 10 / (speed / 20) : 0

  // Create blade elements
  const bladeElements = Array.from({ length: blades }).map((_, index) => {
    const rotation = (360 / blades) * index
    return (
      <motion.div
        key={index}
        className="absolute bg-current rounded-t-full"
        style={{
          width: size * 0.1,
          height: size * 0.4,
          left: `calc(50% - ${size * 0.05}px)`,
          bottom: "50%",
          transformOrigin: "center bottom",
          rotate: `${rotation}deg`,
        }}
      />
    )
  })

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        ref={fanRef}
        className="relative w-full h-full flex items-center justify-center text-current"
        animate={{ rotate: 360 }}
        transition={{
          duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          paused: speed === 0,
        }}
        style={{ color }}
      >
        {bladeElements}
        <div
          className="absolute rounded-full bg-current"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: `calc(50% - ${size * 0.1}px)`,
            left: `calc(50% - ${size * 0.1}px)`,
          }}
        />
      </motion.div>
    </div>
  )
}
