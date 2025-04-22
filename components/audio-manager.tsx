"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface AudioManagerProps {
  playIntroSound?: boolean
}

export default function AudioManager({ playIntroSound = true }: AudioManagerProps) {
  const introSoundRef = useRef<HTMLAudioElement | null>(null)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const [audioInitialized, setAudioInitialized] = useState(false)

  useEffect(() => {
    // Only initialize audio on client side
    if (typeof window !== "undefined" && !audioInitialized) {
      // Create audio elements
      const introSound = new Audio()
      introSound.src = "/intro-sound.mp3"
      introSound.volume = 0.5
      introSound.preload = "auto"
      introSoundRef.current = introSound

      const bgMusic = new Audio()
      bgMusic.src = "/ambient-music.mp3"
      bgMusic.loop = true
      bgMusic.volume = 0.3
      bgMusic.preload = "auto"
      bgMusicRef.current = bgMusic

      setAudioInitialized(true)

      // Play intro sound if needed
      if (playIntroSound) {
        // Add a small delay to ensure the audio is loaded
        setTimeout(() => {
          if (introSoundRef.current) {
            const playPromise = introSoundRef.current.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Intro sound play attempted")
              })
            }
          }
        }, 1000)

        // Start background music after intro
        introSound.addEventListener("ended", () => {
          if (bgMusicRef.current) {
            const playPromise = bgMusicRef.current.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Background music play attempted")
              })
            }
          }
        })
      }
    }

    // Cleanup function
    return () => {
      if (introSoundRef.current) {
        introSoundRef.current.pause()
        introSoundRef.current = null
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
    }
  }, [audioInitialized, playIntroSound])

  // This component doesn't render anything visible
  return null
}
