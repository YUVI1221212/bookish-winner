"use client"

import { useState, useEffect, Suspense } from "react"
import IntroAnimation from "@/components/intro-animation"
import LoadingScreen from "@/components/loading-screen"
import AudioManager from "@/components/audio-manager"
import dynamic from "next/dynamic"

// Dynamically import Dashboard to improve initial load time
const Dashboard = dynamic(() => import("@/components/dashboard"), {
  loading: () => <LoadingScreen />,
  ssr: false,
})

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [appReady, setAppReady] = useState(false)
  const [introCompleted, setIntroCompleted] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Register service worker for PWA
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
      const wb = window.workbox

      // Add event listeners to handle PWA lifecycle
      wb.addEventListener("installed", (event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener("controlling", (event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener("activated", (event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      // Register the service worker after page load to avoid affecting TTI
      wb.register()
    }
  }, [])

  // Enable audio after user interaction
  const enableAudio = () => {
    setAudioEnabled(true)
  }

  // Check if intro has been shown before
  useEffect(() => {
    // Always show intro for better experience
    // Show intro for 6 seconds
    const timer = setTimeout(() => {
      setShowIntro(false)
      // Add a small delay before showing the app to ensure smooth transition
      setTimeout(() => {
        setAppReady(true)
        setIntroCompleted(true)
      }, 300)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  // If still showing intro, render the intro animation
  if (showIntro) {
    return (
      <div onClick={enableAudio}>
        <IntroAnimation />
        {audioEnabled && <AudioManager playIntroSound={true} />}
      </div>
    )
  }

  // Render the main dashboard with Suspense for better loading performance
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-black via-red-950 to-red-900 p-4 md:p-8 transition-opacity duration-500 ease-in-out"
      onClick={enableAudio}
    >
      {audioEnabled && <AudioManager playIntroSound={false} />}
      <Suspense fallback={<LoadingScreen />}>
        <Dashboard />
      </Suspense>
    </main>
  )
}
