"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { motion } from "framer-motion"

interface ThemePersonalizerProps {
  onThemeChange: (theme: string) => void
  onAccentChange: (accent: string) => void
}

export default function ThemePersonalizer({ onThemeChange, onAccentChange }: ThemePersonalizerProps) {
  const [activeTheme, setActiveTheme] = useState("dark")
  const [activeAccent, setActiveAccent] = useState("red")

  const themes = [
    { id: "dark", name: "Dark", color: "#1a1a1a" },
    { id: "light", name: "Light", color: "#f5f5f5" },
    { id: "night", name: "Night", color: "#0F2027" },
    { id: "high-contrast", name: "High Contrast", color: "#000000" },
  ]

  const accents = [
    { id: "red", name: "Red", color: "#e74c3c" },
    { id: "blue", name: "Blue", color: "#3498db" },
    { id: "green", name: "Green", color: "#2ecc71" },
    { id: "purple", name: "Purple", color: "#9b59b6" },
    { id: "orange", name: "Orange", color: "#e67e22" },
    { id: "pink", name: "Pink", color: "#e84393" },
  ]

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId)
    onThemeChange(themeId)
  }

  const handleAccentChange = (accentId: string) => {
    setActiveAccent(accentId)
    onAccentChange(accentId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-red-500" />
        <h3 className="text-sm font-medium">Personalize Theme</h3>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs text-red-300/70 mb-2">Theme</h4>
          <div className="flex gap-2">
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`theme-color-option ${activeTheme === theme.id ? "active" : ""}`}
                style={{ backgroundColor: theme.color }}
                onClick={() => handleThemeChange(theme.id)}
                title={theme.name}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs text-red-300/70 mb-2">Accent Color</h4>
          <div className="flex gap-2">
            {accents.map((accent) => (
              <motion.div
                key={accent.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`theme-color-option ${activeAccent === accent.id ? "active" : ""}`}
                style={{ backgroundColor: accent.color }}
                onClick={() => handleAccentChange(accent.id)}
                title={accent.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
