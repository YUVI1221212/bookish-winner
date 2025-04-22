"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface KeyboardShortcutsProps {
  onFanPower: (state: boolean) => void
  onFanSpeed: (speed: number) => void
  onAutoMode: (state: boolean) => void
  onEnergySaving: (state: boolean) => void
  onNightMode: (state: boolean) => void
  fanData: {
    fanPower: boolean
    fanSpeed: number
    autoMode: boolean
    energySaving: boolean
    nightMode: boolean
  }
}

export default function KeyboardShortcuts({
  onFanPower,
  onFanSpeed,
  onAutoMode,
  onEnergySaving,
  onNightMode,
  fanData,
}: KeyboardShortcutsProps) {
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case " ": // Space bar
          e.preventDefault()
          onFanPower(!fanData.fanPower)
          toast({
            title: fanData.fanPower ? "Fan turned off" : "Fan turned on",
            description: `Keyboard shortcut: Space`,
          })
          break

        case "ArrowUp":
          e.preventDefault()
          if (fanData.fanPower && !fanData.autoMode) {
            const newSpeed = Math.min(100, fanData.fanSpeed + 10)
            onFanSpeed(newSpeed)
            toast({
              title: "Fan speed increased",
              description: `Speed: ${newSpeed}% (↑ key)`,
            })
          }
          break

        case "ArrowDown":
          e.preventDefault()
          if (fanData.fanPower && !fanData.autoMode) {
            const newSpeed = Math.max(0, fanData.fanSpeed - 10)
            onFanSpeed(newSpeed)
            toast({
              title: "Fan speed decreased",
              description: `Speed: ${newSpeed}% (↓ key)`,
            })
          }
          break

        case "a":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onAutoMode(!fanData.autoMode)
            toast({
              title: fanData.autoMode ? "Auto mode disabled" : "Auto mode enabled",
              description: `Keyboard shortcut: Ctrl+A`,
            })
          }
          break

        case "e":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onEnergySaving(!fanData.energySaving)
            toast({
              title: fanData.energySaving ? "Energy saving disabled" : "Energy saving enabled",
              description: `Keyboard shortcut: Ctrl+E`,
            })
          }
          break

        case "n":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            onNightMode(!fanData.nightMode)
            toast({
              title: fanData.nightMode ? "Night mode disabled" : "Night mode enabled",
              description: `Keyboard shortcut: Ctrl+N`,
            })
          }
          break

        case "1":
          if (fanData.fanPower) {
            onFanSpeed(20)
            toast({
              title: "Fan speed set to Low",
              description: `Speed: 20% (1 key)`,
            })
          }
          break

        case "2":
          if (fanData.fanPower) {
            onFanSpeed(50)
            toast({
              title: "Fan speed set to Medium",
              description: `Speed: 50% (2 key)`,
            })
          }
          break

        case "3":
          if (fanData.fanPower) {
            onFanSpeed(100)
            toast({
              title: "Fan speed set to High",
              description: `Speed: 100% (3 key)`,
            })
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [fanData, onFanPower, onFanSpeed, onAutoMode, onEnergySaving, onNightMode, toast])

  // This component doesn't render anything visible
  return null
}
