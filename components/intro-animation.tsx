"use client"

import { useState, useEffect, useRef } from "react"
import { Fan } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function IntroAnimation() {
  const [progress, setProgress] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showFinalElements, setShowFinalElements] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Preload audio
    const audio = new Audio()
    audio.src = "/intro-sound.mp3"
    audio.preload = "auto"
    audioRef.current = audio

    // Sequence the animations for a more cinematic experience
    const sequence = async () => {
      // Start with a dark screen
      setTimeout(() => {
        setShowParticles(true)

        // Play intro sound with user interaction already happened
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Audio play attempted")
            })
          }
        }
      }, 300)

      // Then show the logo with a dramatic entrance
      setTimeout(() => {
        setShowLogo(true)
      }, 1000)

      // Then show the text with a staggered animation
      setTimeout(() => {
        setShowText(true)
      }, 1800)

      // Finally show additional elements
      setTimeout(() => {
        setShowFinalElements(true)
      }, 2500)
    }

    sequence()

    // Progress bar animation with acceleration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Accelerate progress as it gets closer to 100%
        const increment = prev < 50 ? 1 : prev < 80 ? 2 : 3
        return Math.min(100, prev + increment)
      })
    }, 80)

    return () => {
      clearInterval(interval)
      // Clean up audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Generate fewer particles for better performance
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.5 + 0.2,
  }))

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden relative">
      {/* Simple background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-red-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Optimized particles with fewer animations */}
      <AnimatePresence>
        {showParticles &&
          particles.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              className="absolute rounded-full bg-red-500/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, particle.opacity, 0],
                scale: [0, 1, 0],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Simple radial glow */}
      <motion.div
        className="absolute inset-0 bg-radial-gradient from-red-500/10 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      />

      {/* Main content with optimized animations */}
      <div className="relative z-10 text-center">
        {/* Fan icon with simplified spinning animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: -20 }}
          animate={{
            opacity: showLogo ? 1 : 0,
            scale: showLogo ? 1 : 0,
            y: showLogo ? 0 : -20,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
            className="inline-block"
          >
            <Fan className="h-32 w-32 text-red-500" />
          </motion.div>

          {/* Single pulsing ring for better performance */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-red-500/30"
          />
        </motion.div>

        {/* Text animations with simplified effects */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 20,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl font-bold text-white mb-2"
        >
          fan
          <motion.span
            animate={{
              color: ["#ef4444", "#f87171", "#ef4444"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="relative"
          >
            C
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"
              animate={{
                opacity: [1, 0.5, 1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 20,
          }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-red-300 text-2xl mb-8"
        >
          Smart Fan Control System
        </motion.p>

        {/* Enhanced progress bar with simplified effects */}
        <div className="relative mt-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5 }}
            className="w-80 h-3 bg-red-900/50 rounded-full overflow-hidden mx-auto"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600"
            />
          </motion.div>

          {/* Simplified glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute inset-0 w-80 h-3 bg-red-500 rounded-full filter blur-md mx-auto"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* System initialization text with simplified effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-red-300/70 mt-4 text-sm"
        >
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Initializing system
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            ...
          </motion.span>
        </motion.p>

        {/* Additional elements with simplified animations */}
        {showFinalElements && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mt-8">
            <motion.div
              className="text-xs text-red-300/50 flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span>SYSTEM READY</span>
              <span>|</span>
              <span>VERSION 2.0</span>
              <span>|</span>
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                LOADING INTERFACE
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
