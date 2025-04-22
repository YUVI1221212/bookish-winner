"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Available languages
export const languages = {
  en: {
    name: "English",
    translations: {
      // Dashboard
      "dashboard.title": "Smart Fan Control System",
      "dashboard.connected": "Connected",
      "dashboard.connecting": "Connecting...",

      // Fan Controls
      "fan.controls": "Fan Controls",
      "fan.controls.description": "Adjust your fan settings",
      "fan.power": "Power",
      "fan.speed": "Fan Speed",
      "fan.auto": "Auto Mode",
      "fan.threshold": "Temperature Threshold",
      "fan.energy": "Energy Saving",
      "fan.night": "Night Mode",
      "fan.boost": "Boost (100%)",
      "fan.quiet": "Quiet (20%)",

      // Sensor Readings
      "sensor.readings": "Sensor Readings",
      "sensor.readings.description": "Current environmental data",
      "sensor.temperature": "Temperature",
      "sensor.humidity": "Humidity",
      "sensor.rpm": "Fan Speed",

      // Schedule
      "schedule.title": "Schedule",
      "schedule.description": "Set operation times",
      "schedule.enable": "Schedule Fan",
      "schedule.start": "Start Time",
      "schedule.end": "End Time",

      // Voice Control
      "voice.title": "Voice Control",
      "voice.description": "Control your fan with voice commands",
      "voice.start": "Start Voice Control",
      "voice.stop": "Stop Listening",
      "voice.listening": "Listening...",
      "voice.initializing": "Initializing microphone...",
      "voice.prompt": "Press the button and speak a command",
      "voice.last": "Last",
      "voice.examples": "Example commands",
      "voice.confidence": "Confidence",

      // Power Consumption
      "power.title": "Power Consumption",
      "power.description": "Energy usage statistics",
      "power.current": "Current Power",
      "power.monthly": "Est. Monthly Cost",
      "power.total": "Total Energy",

      // Weather
      "weather.title": "Weather Integration",
      "weather.description": "Optimize based on weather",
      "weather.feels": "Feels like",
      "weather.humidity": "Humidity",
      "weather.recommendation": "Recommendation",
      "weather.update": "Update",
      "weather.updating": "Updating...",
      "weather.last": "Last updated",

      // Charts
      "chart.temperature": "Temperature History",
      "chart.temperature.description": "Temperature and humidity over time",
      "chart.fanspeed": "Fan Speed History",
      "chart.fanspeed.description": "Fan speed and RPM over time",
      "chart.collecting": "Collecting data...",

      // Settings
      "settings.title": "Settings",
      "settings.description": "Configure your fanC application preferences",
      "settings.general": "General",
      "settings.display": "Display",
      "settings.advanced": "Advanced",
      "settings.notifications": "Notifications",
      "settings.language": "Language",
      "settings.currency": "Currency",
      "settings.theme": "Theme",
      "settings.temperatureUnit": "Temperature Unit",
      "settings.autoConnect": "Auto Connect",
      "settings.reset": "Reset to Default Settings",
      "settings.close": "Close",

      // Misc
      "app.loading": "Loading...",
      "app.offline": "You are offline",
      "app.retry": "Retry",
    },
  },
  hi: {
    name: "हिन्दी",
    translations: {
      // Dashboard
      "dashboard.title": "स्मार्ट पंखा नियंत्रण प्रणाली",
      "dashboard.connected": "कनेक्टेड",
      "dashboard.connecting": "कनेक्ट हो रहा है...",

      // Fan Controls
      "fan.controls": "पंखा नियंत्रण",
      "fan.controls.description": "अपने पंखे की सेटिंग्स समायोजित करें",
      "fan.power": "पावर",
      "fan.speed": "पंखे की गति",
      "fan.auto": "ऑटो मोड",
      "fan.threshold": "तापमान सीमा",
      "fan.energy": "ऊर्जा बचत",
      "fan.night": "रात्रि मोड",
      "fan.boost": "बूस्ट (100%)",
      "fan.quiet": "शांत (20%)",

      // More translations would be added here...
    },
  },
  es: {
    name: "Español",
    translations: {
      // Dashboard
      "dashboard.title": "Sistema de Control de Ventilador Inteligente",
      "dashboard.connected": "Conectado",
      "dashboard.connecting": "Conectando...",

      // Fan Controls
      "fan.controls": "Controles del Ventilador",
      "fan.controls.description": "Ajuste la configuración de su ventilador",
      "fan.power": "Encendido",
      "fan.speed": "Velocidad",
      "fan.auto": "Modo Automático",
      "fan.threshold": "Umbral de Temperatura",
      "fan.energy": "Ahorro de Energía",
      "fan.night": "Modo Nocturno",
      "fan.boost": "Máximo (100%)",
      "fan.quiet": "Silencioso (20%)",

      // More translations would be added here...
    },
  },
}

// Default settings
export const defaultSettings = {
  currency: "USD",
  temperatureUnit: "C",
  theme: "dark",
  notifications: true,
  language: "en",
  autoConnect: true,
}

// Language context type
type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  settings: typeof defaultSettings
  updateSettings: (settings: Partial<typeof defaultSettings>) => void
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en")
  const [settings, setSettings] = useState(defaultSettings)

  // Set language and update settings
  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    setSettings((prev) => ({ ...prev, language: lang }))
  }

  // Update settings
  const updateSettings = (newSettings: Partial<typeof defaultSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    if (newSettings.language) {
      setLanguageState(newSettings.language)
    }
  }

  // Translation function
  const t = (key: string): string => {
    const currentLang = languages[language as keyof typeof languages]
    if (!currentLang) return key

    return currentLang.translations[key as keyof typeof currentLang.translations] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, settings, updateSettings }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
