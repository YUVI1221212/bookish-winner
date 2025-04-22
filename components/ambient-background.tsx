"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AmbientBackgroundProps {
  temperature: number
  humidity: number
}

export default function AmbientBackground({ temperature, humidity }: AmbientBackgroundProps) {
  const [bgClass, setBgClass] = useState("temp-comfortable")
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )

  // Update background class based on temperature
  useEffect(() => {
    if (temperature < 18) {
      setBgClass("temp-cool")
    } else if (temperature < 24) {
      setBgClass("temp-comfortable")
    } else if (temperature < 28) {
      setBgClass("temp-warm")
    } else {
      setBgClass("temp-hot")
    }

    // Generate particles based on humidity
    const particleCount = Math.floor(humidity / 5)
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 5 + 1,
    }))
    setParticles(newParticles)
  }, [temperature, humidity])

  return (
    <motion.div
      className={`ambient-background ${bgClass}`}
      style={{
        background: `var(--background-gradient)`,
        opacity: 0.8,
      }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 2 }}
    >
      {/* Animated particles based on humidity */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.speed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  )
}
