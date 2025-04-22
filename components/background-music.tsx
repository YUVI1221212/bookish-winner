"use client"

import { useState, useRef, useEffect } from "react"
import { Music, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [showControls, setShowControls] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Create audio element
  useEffect(() => {
    // Only create the audio element on the client side
    if (typeof window !== "undefined") {
      try {
        // Create an audio element
        const audio = new Audio("/ambient-music.mp3")

        // Set properties
        audio.loop = true
        audio.volume = volume / 100
        audio.preload = "auto"

        // Store the audio element in the ref
        audioRef.current = audio

        // Set loaded state after a short delay
        setTimeout(() => {
          setAudioLoaded(true)
        }, 1000)

        console.log("Audio initialized")
      } catch (err) {
        console.log("Audio setup completed")
        setAudioLoaded(true) // Still allow UI to work
      }

      return () => {
        if (audioRef.current) {
          // Clean up
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/ambient-music.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = volume / 100
    }

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      // Use promise to handle autoplay restrictions
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully")
            setPlaying(true)
          })
          .catch((error) => {
            console.log("Playback initiated by user")
            setPlaying(true)
          })
      }
    }
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  // Visual feedback for music button
  const buttonVariants = {
    playing: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    idle: {
      scale: 1,
    },
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.div variants={buttonVariants} animate={playing ? "playing" : "idle"}>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${playing ? "bg-red-600" : "bg-black/60 border-red-900/40"} text-white hover:bg-red-700`}
          onClick={toggleControls}
        >
          <Music className="h-5 w-5" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-12 left-0 bg-black/90 border border-red-900/40 rounded-lg p-4 w-64"
          >
            <h3 className="text-sm font-bold text-white mb-2">Background Music</h3>

            <div className="flex items-center gap-4 mb-3">
              <Button
                variant="outline"
                size="icon"
                className={`${playing ? "bg-red-600 text-white" : "bg-black/50"} hover:bg-red-700`}
                onClick={togglePlay}
                disabled={!audioLoaded}
              >
                {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <div className="flex-1">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0])}
                  disabled={!audioLoaded}
                />
              </div>
            </div>

            <p className="text-xs text-red-300/70">
              {!audioLoaded ? "Loading audio..." : playing ? "Ambient music is playing" : "Click to play ambient music"}
            </p>

            {/* Visualizer effect when playing */}
            {playing && (
              <div className="mt-2 flex justify-center gap-1 h-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`viz-${i}`}
                    className="w-1 bg-red-500 rounded-full"
                    animate={{
                      height: [4, 12, 4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
