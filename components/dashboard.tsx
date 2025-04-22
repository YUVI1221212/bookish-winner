"use client"

import { Switch } from "@/components/ui/switch"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FanControls from "@/components/fan-controls"
import SensorReadings from "@/components/sensor-readings"
import FanSpeedChart from "@/components/fan-speed-chart"
import TemperatureChart from "@/components/temperature-chart"
import { useToast } from "@/hooks/use-toast"
import {
  Fan,
  Thermometer,
  Gauge,
  History,
  Settings,
  Calendar,
  Zap,
  Cloud,
  Mic,
  Minimize,
  Maximize,
  Sun,
  Moon,
  UserCircle,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PowerConsumption from "@/components/power-consumption"
import WeatherIntegration from "@/components/weather-integration"
import ScheduleSettings from "@/components/schedule-settings"
import VoiceControl from "@/components/voice-control"
import SettingsModal from "@/components/settings-modal"
import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

// Import new components
import AnimatedFan from "./animated-fan"
import SpeedDial from "./speed-dial"
import GradientSpeedBar from "./gradient-speed-bar"
import QuickPresets from "./quick-presets"
import RoomSelector from "./room-selector"
import SchedulePreview from "./schedule-preview"
import TemperatureForecast from "./temperature-forecast"
import ThemePersonalizer from "./theme-personalizer"
import AmbientBackground from "./ambient-background"
import ConfettiAnimation from "./confetti-animation"
import HelpMode from "./help-mode"
import BackgroundMusic from "./background-music"
import KeyboardShortcuts from "./keyboard-shortcuts"
import VibrationFeedback from "./vibration-feedback"
import LanguageSwitcher from "./language-switcher"
import TooltipWrapper from "./tooltip-wrapper"
import LoginSignupModal from "./login-signup-modal"

// Mock data - in a real application, this would come from the ESP32
const initialData = {
  fanPower: true,
  fanSpeed: 50,
  temperature: 24.5,
  humidity: 45,
  rpm: 1200,
  autoMode: false,
  autoThreshold: 26,
  energySaving: false,
  nightMode: false,
  schedule: {
    enabled: false,
    startTime: "08:00",
    endTime: "22:00",
  },
  powerUsage: 15, // watts
}

// Temperature forecast data
const forecastData = [
  { time: "Now", temperature: 24.5 },
  { time: "1h", temperature: 25.2 },
  { time: "2h", temperature: 26.0 },
  { time: "3h", temperature: 25.8 },
  { time: "4h", temperature: 25.0 },
  { time: "5h", temperature: 24.2 },
]

export default function Dashboard() {
  const [data, setData] = useState(initialData)
  const [connected, setConnected] = useState(false)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const { toast } = useToast()
  const isMobile = useMobile()
  const connectionToastShown = useRef(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { t, settings, updateSettings } = useLanguage()
  const [isOffline, setIsOffline] = useState(false)
  const { setTheme, theme } = useTheme()

  // New state variables for added features
  const [miniDashboard, setMiniDashboard] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [accentColor, setAccentColor] = useState("red")
  const [currentRoom, setCurrentRoom] = useState("living-room")
  const [isDayMode, setIsDayMode] = useState(true)
  const [accessibilityMode, setAccessibilityMode] = useState({
    highContrast: false,
    largeText: false,
  })
  const [loggedInUser, setLoggedInUser] = useState<{ name?: string; email: string } | null>(null)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check day/night mode based on time
  useEffect(() => {
    const checkDayNightMode = () => {
      const hour = new Date().getHours()
      const isDay = hour >= 6 && hour < 18
      setIsDayMode(isDay)

      // Auto switch theme if enabled
      if (settings.autoThemeSwitch) {
        setTheme(isDay ? "light" : "dark")
      }
    }

    checkDayNightMode()
    const interval = setInterval(checkDayNightMode, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [settings.autoThemeSwitch, setTheme])

  // Apply accessibility settings
  useEffect(() => {
    // Apply large text mode
    if (accessibilityMode.largeText) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }

    // Apply high contrast mode
    if (accessibilityMode.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [accessibilityMode])

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getAccentColorValue(accentColor))
  }, [accentColor])

  // Simulate WebSocket connection to ESP32
  useEffect(() => {
    // In a real application, this would be a WebSocket connection to the ESP32
    const connectToDevice = () => {
      setTimeout(() => {
        setConnected(true)
        // Only show the toast if we haven't shown it before
        if (!connectionToastShown.current) {
          toast({
            title: t("dashboard.connected"),
            description: "Successfully connected to your smart fan device.",
          })
          connectionToastShown.current = true
        }
      }, 1500)
    }

    connectToDevice()

    // Simulate receiving data from the ESP32
    const interval = setInterval(() => {
      if (connected) {
        const newTemp = data.temperature + (Math.random() * 0.4 - 0.2)
        const newHumidity = data.humidity + (Math.random() * 2 - 1)
        const newRpm = data.fanPower ? data.fanSpeed * 24 + (Math.random() * 50 - 25) : 0
        const newPowerUsage = data.fanPower ? data.fanSpeed * 0.3 * (data.energySaving ? 0.7 : 1) : 0.5 // standby power

        // Update current data
        setData((prev) => ({
          ...prev,
          temperature: Number.parseFloat(newTemp.toFixed(1)),
          humidity: Number.parseFloat(newHumidity.toFixed(1)),
          rpm: Math.round(newRpm),
          powerUsage: Number.parseFloat(newPowerUsage.toFixed(1)),
        }))

        // Add to historical data
        const timestamp = new Date()
        setHistoricalData((prev) =>
          [
            ...prev,
            {
              timestamp,
              temperature: Number.parseFloat(newTemp.toFixed(1)),
              humidity: Number.parseFloat(newHumidity.toFixed(1)),
              rpm: Math.round(newRpm),
              fanSpeed: data.fanSpeed,
              powerUsage: Number.parseFloat(newPowerUsage.toFixed(1)),
            },
          ].slice(-30),
        ) // Keep last 30 data points
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [connected, data.fanPower, data.fanSpeed, data.temperature, data.humidity, data.energySaving, toast, t])

  // Check if auto mode should adjust fan
  useEffect(() => {
    if (data.autoMode && connected) {
      const newSpeed =
        data.temperature > data.autoThreshold
          ? Math.min(100, Math.round((data.temperature - data.autoThreshold) * 20) + 40)
          : 20

      if (newSpeed !== data.fanSpeed) {
        setData((prev) => ({ ...prev, fanSpeed: newSpeed }))
        if (settings.notifications) {
          toast({
            title: "Auto-adjusted fan speed",
            description: `Temperature: ${data.temperature}°${settings.temperatureUnit} → Fan speed: ${newSpeed}%`,
          })
        }
      }
    }
  }, [data.temperature, data.autoMode, data.autoThreshold, data.fanSpeed, connected, toast, settings])

  // Check schedule
  useEffect(() => {
    if (data.schedule.enabled && connected) {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const shouldBeOn = currentTime >= data.schedule.startTime && currentTime <= data.schedule.endTime

      if (shouldBeOn !== data.fanPower) {
        setData((prev) => ({ ...prev, fanPower: shouldBeOn }))
        if (settings.notifications) {
          toast({
            title: shouldBeOn ? "Fan turned on by schedule" : "Fan turned off by schedule",
            description: shouldBeOn
              ? `Schedule activated at ${data.schedule.startTime}`
              : `Schedule deactivated at ${data.schedule.endTime}`,
          })
        }
      }
    }
  }, [connected, data.schedule, data.fanPower, toast, settings])

  const handleFanControl = (updates: Partial<typeof data>) => {
    // Show confetti when turning on the fan
    if (updates.fanPower === true && !data.fanPower) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setData((prev) => ({ ...prev, ...updates }))

    // In a real application, this would send commands to the ESP32
    if (!settings.notifications) return

    if (updates.fanPower !== undefined) {
      toast({
        title: updates.fanPower ? "Fan turned on" : "Fan turned off",
        description: updates.fanPower ? "Your fan is now running." : "Your fan has been stopped.",
      })
    } else if (updates.fanSpeed !== undefined) {
      toast({
        title: "Fan speed updated",
        description: `Fan speed set to ${updates.fanSpeed}%`,
      })
    } else if (updates.autoMode !== undefined) {
      toast({
        title: updates.autoMode ? "Auto mode enabled" : "Auto mode disabled",
        description: updates.autoMode
          ? `Fan will adjust based on temperature threshold (${data.autoThreshold}°${settings.temperatureUnit})`
          : "Manual control mode activated",
      })
    } else if (updates.autoThreshold !== undefined) {
      toast({
        title: "Temperature threshold updated",
        description: `Auto mode will activate at ${updates.autoThreshold}°${settings.temperatureUnit}`,
      })
    } else if (updates.energySaving !== undefined) {
      toast({
        title: updates.energySaving ? "Energy saving mode enabled" : "Energy saving mode disabled",
        description: updates.energySaving
          ? "Fan will operate at reduced power to save energy"
          : "Fan will operate at normal power",
      })
    } else if (updates.nightMode !== undefined) {
      toast({
        title: updates.nightMode ? "Night mode enabled" : "Night mode disabled",
        description: updates.nightMode
          ? "Fan will operate quietly during night hours"
          : "Fan will operate at normal sound levels",
      })
    } else if (updates.schedule !== undefined) {
      toast({
        title: updates.schedule.enabled ? "Schedule enabled" : "Schedule disabled",
        description: updates.schedule.enabled
          ? `Fan will run from ${updates.schedule.startTime} to ${updates.schedule.endTime}`
          : "Fan will operate manually",
      })
    }
  }

  const handleVoiceCommand = (command: string) => {
    if (settings.notifications) {
      toast({
        title: "Voice command received",
        description: `"${command}" - Processing your request`,
      })
    }

    // Process voice commands
    if (command.includes("turn on") || command.includes("start")) {
      handleFanControl({ fanPower: true })
    } else if (command.includes("turn off") || command.includes("stop")) {
      handleFanControl({ fanPower: false })
    } else if (command.includes("increase") || command.includes("faster")) {
      handleFanControl({ fanSpeed: Math.min(100, data.fanSpeed + 20) })
    } else if (command.includes("decrease") || command.includes("slower")) {
      handleFanControl({ fanSpeed: Math.max(0, data.fanSpeed - 20) })
    } else if (command.includes("maximum") || command.includes("full")) {
      handleFanControl({ fanSpeed: 100 })
    } else if (command.includes("minimum") || command.includes("low")) {
      handleFanControl({ fanSpeed: 20 })
    } else if (command.includes("auto")) {
      handleFanControl({ autoMode: true })
    } else if (command.includes("manual")) {
      handleFanControl({ autoMode: false })
    } else if (command.includes("energy") || command.includes("saving")) {
      handleFanControl({ energySaving: !data.energySaving })
    } else if (command.includes("night")) {
      handleFanControl({ nightMode: !data.nightMode })
    } else if (command.includes("schedule")) {
      handleFanControl({
        schedule: {
          ...data.schedule,
          enabled: !data.schedule.enabled,
        },
      })
    } else {
      if (settings.notifications) {
        toast({
          title: "Command not recognized",
          description: "Please try again with a valid command",
          variant: "destructive",
        })
      }
    }
  }

  const handleSettingsChange = (newSettings: typeof settings) => {
    updateSettings(newSettings)
    if (newSettings.notifications) {
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      })
    }
  }

  const handleThemeChange = (theme: string) => {
    setTheme(theme)

    // Apply accessibility modes
    if (theme === "high-contrast") {
      setAccessibilityMode((prev) => ({ ...prev, highContrast: true }))
    } else {
      setAccessibilityMode((prev) => ({ ...prev, highContrast: false }))
    }
  }

  const handleAccentChange = (accent: string) => {
    setAccentColor(accent)
  }

  const getAccentColorValue = (accent: string) => {
    switch (accent) {
      case "red":
        return "346.8 77.2% 49.8%"
      case "blue":
        return "217.2 91.2% 59.8%"
      case "green":
        return "142.1 76.2% 36.3%"
      case "purple":
        return "262.1 83.3% 57.8%"
      case "orange":
        return "27.2 96.5% 54.5%"
      case "pink":
        return "330.4 81.2% 60.4%"
      default:
        return "346.8 77.2% 49.8%"
    }
  }

  const toggleLargeText = () => {
    const newValue = !accessibilityMode.largeText
    setAccessibilityMode((prev) => ({ ...prev, largeText: newValue }))
  }

  const handleRoomChange = (roomId: string) => {
    setCurrentRoom(roomId)
    toast({
      title: "Room Changed",
      description: `Now controlling fan in ${roomId.replace("-", " ")}`,
    })
  }

  const handleQuickPreset = (preset: any) => {
    handleFanControl({
      fanSpeed: preset.fanSpeed,
      autoMode: preset.autoMode,
      energySaving: preset.energySaving,
      nightMode: preset.nightMode,
    })
  }

  // Toggle day/night mode
  const toggleDayNightMode = () => {
    const newMode = !isDayMode
    setIsDayMode(newMode)
    setTheme(newMode ? "light" : "dark")
  }

  // Handle login
  const handleLogin = (userData: { email: string; password: string }) => {
    setLoggedInUser({
      name: userData.email.split("@")[0], // Simple name extraction from email
      email: userData.email,
    })
  }

  // Show offline message if the user is offline
  if (isOffline) {
    return (
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Cloud className="h-20 w-20 text-red-500/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t("app.offline")}</h2>
            <p className="text-red-300/70 mb-6">Please check your internet connection and try again.</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white active:bg-red-800"
            >
              {t("app.retry")}
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Apply ambient background based on temperature
  const getTemperatureClass = () => {
    if (data.temperature < 18) return "temp-cool"
    if (data.temperature < 24) return "temp-comfortable"
    if (data.temperature < 28) return "temp-warm"
    return "temp-hot"
  }

  return (
    <>
      {/* Ambient background */}
      <AmbientBackground temperature={data.temperature} humidity={data.humidity} />

      {/* Confetti animation */}
      <ConfettiAnimation active={showConfetti} />

      {/* Help mode */}
      <HelpMode />

      {/* Background music */}
      <BackgroundMusic />

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts
        onFanPower={(state) => handleFanControl({ fanPower: state })}
        onFanSpeed={(speed) => handleFanControl({ fanSpeed: speed })}
        onAutoMode={(state) => handleFanControl({ autoMode: state })}
        onEnergySaving={(state) => handleFanControl({ energySaving: state })}
        onNightMode={(state) => handleFanControl({ nightMode: state })}
        fanData={data}
      />

      <div
        className={`container mx-auto max-w-5xl ${miniDashboard ? "mini-dashboard" : ""} ${accessibilityMode.largeText ? "large-text" : ""} ${accessibilityMode.highContrast ? "high-contrast" : ""}`}
      >
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-6 bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-red-900/40 ${getTemperatureClass()}`}
          data-help="header"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TooltipWrapper text="Fan Status">
                <div className="relative mr-2">
                  <AnimatedFan speed={data.fanPower ? data.fanSpeed : 0} size={40} />
                </div>
              </TooltipWrapper>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  fan<span className="text-red-500">C</span>
                </h1>
                <p className="text-red-300">{t("dashboard.title")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipWrapper text="Connection Status">
                <Badge
                  variant={connected ? "success" : "outline"}
                  className={
                    connected
                      ? "bg-green-900/60 text-green-300 border-green-700/40"
                      : "bg-black/40 text-red-300 border-red-700/40"
                  }
                >
                  {connected ? t("dashboard.connected") : t("dashboard.connecting")}
                </Badge>
              </TooltipWrapper>

              <TooltipWrapper text="Toggle Day/Night Mode">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 active:bg-white/20"
                  onClick={toggleDayNightMode}
                >
                  {isDayMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </TooltipWrapper>

              <TooltipWrapper text="Toggle Mini Dashboard">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 active:bg-white/20"
                  onClick={() => setMiniDashboard(!miniDashboard)}
                >
                  {miniDashboard ? <Maximize className="h-5 w-5" /> : <Minimize className="h-5 w-5" />}
                </Button>
              </TooltipWrapper>

              <TooltipWrapper text="Change Language">
                <LanguageSwitcher />
              </TooltipWrapper>

              <TooltipWrapper text="Settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 active:bg-white/20"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipWrapper>

              <TooltipWrapper text={loggedInUser ? "Account" : "Login/Signup"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 active:bg-white/20"
                  onClick={() => setLoginOpen(true)}
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
            </div>
          </div>

          {/* User info if logged in */}
          {loggedInUser && (
            <div className="mt-2 text-right">
              <p className="text-xs text-red-300/70">
                Logged in as <span className="font-medium text-white">{loggedInUser.name}</span>
              </p>
            </div>
          )}

          {/* Room selector */}
          <div className="mt-4">
            <RoomSelector onRoomChange={handleRoomChange} />
          </div>
        </motion.header>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card
              className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}
              data-help="fan-controls"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Fan className="h-5 w-5 text-red-500" />
                  {t("fan.controls")}
                </CardTitle>
                <CardDescription className="text-red-300/70">{t("fan.controls.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Fan status badge */}
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={data.fanPower ? "default" : "outline"}
                      className={
                        data.fanPower ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 text-gray-300 border-gray-700"
                      }
                    >
                      {data.fanPower ? "ON" : "OFF"}
                    </Badge>

                    <div className="text-sm text-white">
                      {data.fanPower ? (data.autoMode ? "Auto Mode" : "Manual Mode") : "Standby"}
                    </div>
                  </div>

                  {/* Speed dial for larger screens */}
                  {!isMobile && (
                    <div className="flex justify-center mb-4">
                      <VibrationFeedback>
                        <SpeedDial
                          value={data.fanSpeed}
                          onChange={(value) => handleFanControl({ fanSpeed: value })}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </VibrationFeedback>
                    </div>
                  )}

                  {/* Gradient speed bar */}
                  <div className="mb-4">
                    <GradientSpeedBar value={data.fanSpeed} className="mb-2" />
                  </div>

                  {/* Quick presets */}
                  <QuickPresets onSelect={handleQuickPreset} disabled={!connected} />

                  {/* Standard controls */}
                  <FanControls data={data} onUpdate={handleFanControl} connected={connected} />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}
              data-help="sensor-readings"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  {t("sensor.readings")}
                </CardTitle>
                <CardDescription className="text-red-300/70">{t("sensor.readings.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SensorReadings data={data} connected={connected} temperatureUnit={settings.temperatureUnit} />

                  {/* Temperature forecast */}
                  <TemperatureForecast data={forecastData} temperatureUnit={settings.temperatureUnit} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {!miniDashboard && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card
                  className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}
                  data-help="schedule"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Calendar className="h-5 w-5 text-red-500" />
                      {t("schedule.title")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("schedule.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <ScheduleSettings
                        schedule={data.schedule}
                        onUpdate={(schedule) => handleFanControl({ schedule })}
                        connected={connected}
                      />

                      {/* Schedule preview */}
                      <SchedulePreview schedule={data.schedule} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}
                  data-help="voice-control"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Mic className="h-5 w-5 text-red-500" />
                      {t("voice.title")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("voice.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VoiceControl onCommand={handleVoiceCommand} connected={connected} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="h-5 w-5 text-red-500" />
                      {t("power.title")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("power.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PowerConsumption data={data} historicalData={historicalData} currency={settings.currency} />
                  </CardContent>
                </Card>

                <Card className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Cloud className="h-5 w-5 text-red-500" />
                      {t("weather.title")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("weather.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WeatherIntegration connected={connected} temperatureUnit={settings.temperatureUnit} />
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs
              defaultValue="temperature"
              className={`bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-xl border border-red-900/40 ${getTemperatureClass()}`}
              data-help="charts"
            >
              <TabsList className="grid w-full grid-cols-2 bg-black/60">
                <TabsTrigger
                  value="temperature"
                  className="flex items-center gap-2 text-white data-[state=active]:bg-red-900/60"
                >
                  <Thermometer className="h-4 w-4" />
                  {isMobile ? "Temp" : t("sensor.temperature")}
                </TabsTrigger>
                <TabsTrigger
                  value="fanspeed"
                  className="flex items-center gap-2 text-white data-[state=active]:bg-red-900/60"
                >
                  <Gauge className="h-4 w-4" />
                  {isMobile ? "Fan" : t("fan.speed")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="temperature">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <History className="h-5 w-5 text-red-500" />
                      {t("chart.temperature")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("chart.temperature.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemperatureChart data={historicalData} temperatureUnit={settings.temperatureUnit} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="fanspeed">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <History className="h-5 w-5 text-red-500" />
                      {t("chart.fanspeed")}
                    </CardTitle>
                    <CardDescription className="text-red-300/70">{t("chart.fanspeed.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FanSpeedChart data={historicalData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Theme personalizer with added spacing */}
          {!miniDashboard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8" // Added spacing
            >
              <Card className={`bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl ${getTemperatureClass()}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="h-5 w-5 text-red-500" />
                    Personalization
                  </CardTitle>
                  <CardDescription className="text-red-300/70">Customize your fanC experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ThemePersonalizer onThemeChange={handleThemeChange} onAccentChange={handleAccentChange} />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-red-500" />
                        <h3 className="text-sm font-medium">Accessibility Options</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high-contrast" className="text-sm">
                            High Contrast Mode
                          </Label>
                          <Switch
                            id="high-contrast"
                            checked={accessibilityMode.highContrast}
                            onCheckedChange={(checked) => {
                              setAccessibilityMode((prev) => ({ ...prev, highContrast: checked }))
                            }}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="large-text" className="text-sm">
                            Large Text Mode
                          </Label>
                          <Switch
                            id="large-text"
                            checked={accessibilityMode.largeText}
                            onCheckedChange={toggleLargeText}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Settings Modal */}
        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />

        {/* Login/Signup Modal */}
        <LoginSignupModal open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
      </div>
    </>
  )
}
