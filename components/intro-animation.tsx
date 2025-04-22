"use client"

import { useState, useEffect, useRef } from "react"
import { Fan, Zap, Power, Thermometer, Wind } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function IntroAnimation() {
  const [progress, setProgress] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showFinalElements, setShowFinalElements] = useState(false)
  const [showFloatingIcons, setShowFloatingIcons] = useState(false)
  const [showWaves, setShowWaves] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio("/intro-sound.mp3")
      audio.volume = 0.5
      audioRef.current = audio
    }

    // Sequence the animations for a more cinematic experience
    const sequence = async () => {
      // Start with a dark screen
      setTimeout(() => {
        setShowParticles(true)

        // Play intro sound
        if (audioRef.current && !audioPlayed) {
          audioRef.current.play().catch(() => {
            console.log("Audio play attempted")
          })
          setAudioPlayed(true)
        }
      }, 300)

      // Show waves
      setTimeout(() => {
        setShowWaves(true)
      }, 600)

      // Then show the logo with a dramatic entrance
      setTimeout(() => {
        setShowLogo(true)
      }, 1000)

      // Show floating icons
      setTimeout(() => {
        setShowFloatingIcons(true)
      }, 1500)

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
  }, [audioPlayed])

  // Generate more particles for a richer background
  const particles = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.6 + 0.2,
  }))

  // Generate floating geometric shapes for added depth
  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 100 + 50,
    rotation: Math.random() * 360,
    duration: Math.random() * 30 + 20,
    delay: Math.random() * 5,
    type: Math.random() > 0.5 ? "circle" : Math.random() > 0.5 ? "square" : "triangle",
  }))

  // Generate floating icons
  const icons = [
    { Icon: Fan, color: "#ef4444" },
    { Icon: Zap, color: "#f59e0b" },
    { Icon: Power, color: "#10b981" },
    { Icon: Thermometer, color: "#3b82f6" },
    { Icon: Wind, color: "#8b5cf6" },
  ]

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden relative">
      {/* Dynamic background gradient with animated transitions */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-red-900"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: [
            "linear-gradient(to bottom right, #000000, #500000)",
            "linear-gradient(to bottom right, #000000, #800000)",
            "linear-gradient(to bottom right, #000000, #a00000)",
          ],
        }}
        transition={{ duration: 3, times: [0, 0.5, 1] }}
      />

      {/* Animated wave background */}
      {showWaves && (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute w-[200%] h-[50px] bg-red-500/10"
              style={{
                bottom: `${i * 50 + 100}px`,
                left: "-50%",
                borderRadius: "50%",
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Floating geometric shapes for depth */}
      <AnimatePresence>
        {showParticles &&
          shapes.map((shape) => (
            <motion.div
              key={`shape-${shape.id}`}
              className={`absolute rounded-lg border border-red-500/10 ${
                shape.type === "circle" ? "rounded-full" : shape.type === "square" ? "" : "clip-path-triangle"
              }`}
              style={{
                left: `${shape.x}%`,
                top: `${shape.y}%`,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                transform: `rotate(${shape.rotation}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.1, 0],
                scale: [0, 1, 0],
                rotate: [shape.rotation, shape.rotation + 360],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: shape.duration,
                delay: shape.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Floating icons */}
      <AnimatePresence>
        {showFloatingIcons &&
          icons.map((icon, i) => (
            <motion.div
              key={`icon-${i}`}
              className="absolute"
              style={{
                color: icon.color,
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 15}%`,
              }}
              initial={{ opacity: 0, scale: 0, y: 50 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [50, -100],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 4 + i,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <icon.Icon size={24 + i * 4} />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Enhanced animated particles with varying sizes and speeds */}
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
                x: [0, Math.random() * 150 - 75],
                y: [0, Math.random() * 150 - 75],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Multiple radial glow effects for depth */}
      <motion.div
        className="absolute inset-0 bg-radial-gradient from-red-500/20 via-transparent to-transparent opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Animated background shapes with more dramatic movement */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`bg-shape-${i}`}
            className="absolute rounded-full border border-red-500/20"
            style={{
              left: `${50 + Math.cos((i * Math.PI) / 4) * 40}%`,
              top: `${50 + Math.sin((i * Math.PI) / 4) * 40}%`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 5,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content with enhanced animations */}
      <div className="relative z-10 text-center">
        {/* Fan icon with more dramatic spinning animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: -50 }}
          animate={{
            opacity: showLogo ? 1 : 0,
            scale: showLogo ? 1 : 0,
            y: showLogo ? 0 : -50,
          }}
          transition={{ duration: 1.2, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              rotate: 360,
              filter: [
                "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))",
                "drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))",
                "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))",
              ],
            }}
            transition={{
              rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              filter: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="inline-block"
          >
            <Fan className="h-32 w-32 text-red-500" />
          </motion.div>

          {/* Multiple pulsing rings with varying speeds and sizes */}
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={`ring-${ring}`}
              animate={{
                scale: [1, 1.3 + ring * 0.1, 1],
                opacity: [0.7, 0.1, 0.7],
              }}
              transition={{
                duration: 2 + ring * 0.5,
                delay: ring * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border-2 border-red-500/30"
            />
          ))}

          {/* Additional decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showLogo ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -inset-4 rounded-full border border-red-500/20"
          />

          {/* Fan blades animation */}
          {showLogo && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`blade-${i}`}
                  className="absolute w-1 h-16 bg-red-500/30 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    transformOrigin: "center bottom",
                    transform: `translateX(-50%) rotate(${i * 72}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Text animations with staggered reveal and glow effects */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 30,
            filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.7))",
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-7xl font-bold text-white mb-2"
        >
          fan
          <motion.span
            animate={{
              color: ["#ef4444", "#f87171", "#ef4444"],
              textShadow: [
                "0 0 10px rgba(239, 68, 68, 0.7)",
                "0 0 25px rgba(239, 68, 68, 0.9)",
                "0 0 10px rgba(239, 68, 68, 0.7)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="relative"
          >
            C
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"
              animate={{
                opacity: [1, 0.5, 1],
                scale: [1, 1.8, 1],
                boxShadow: [
                  "0 0 5px rgba(239, 68, 68, 0.7)",
                  "0 0 15px rgba(239, 68, 68, 0.9)",
                  "0 0 5px rgba(239, 68, 68, 0.7)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.span>
        </motion.h1>

        {/* Animated subtitle with letter-by-letter reveal */}
        <div className="h-8 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: showText ? 1 : 0,
              y: showText ? 0 : 20,
            }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-red-300 text-2xl mb-8"
          >
            {"Smart Fan Control System".split("").map((char, index) => (
              <motion.span
                key={`char-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* Enhanced progress bar with glow effect */}
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

          {/* Enhanced glow effect under progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 w-80 h-3 bg-red-500 rounded-full filter blur-md mx-auto"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* System initialization text with typing effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-red-300/70 mt-4 text-sm"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            Initializing system
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0, 1, 0, 1, 0, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            ...
          </motion.span>
        </motion.p>

        {/* Additional cinematic elements */}
        {showFinalElements && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-8"
          >
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
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                LOADING INTERFACE
              </motion.span>
            </motion.div>
          </motion.div>
        )}

        {/* Decorative tech elements */}
        {showFinalElements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-[-50px] left-0 right-0 flex justify-center"
          >
            <div className="relative w-[200px] h-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`tech-${i}`}
                  className="absolute top-0 h-[2px] bg-red-500"
                  style={{ left: `${i * 25}%`, width: "15%" }}
                  animate={{ opacity: [0.2, 1, 0.2], scaleX: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Digital circuit pattern */}
        {showFinalElements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.3" />
                <circle cx="10" cy="10" r="2" fill="#ef4444" fillOpacity="0.5" />
                <circle cx="90" cy="10" r="2" fill="#ef4444" fillOpacity="0.5" />
                <circle cx="90" cy="90" r="2" fill="#ef4444" fillOpacity="0.5" />
                <circle cx="10" cy="90" r="2" fill="#ef4444" fillOpacity="0.5" />
                <path
                  d="M10 50 H40 V30 H60 V70 H90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  )
}
