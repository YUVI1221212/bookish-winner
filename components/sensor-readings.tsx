"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Gauge } from "lucide-react"

interface SensorReadingsProps {
  data: {
    temperature: number
    humidity: number
    rpm: number
    fanPower: boolean
  }
  connected: boolean
  temperatureUnit: string
}

export default function SensorReadings({ data, connected, temperatureUnit }: SensorReadingsProps) {
  // Convert temperature if needed
  const displayTemp =
    temperatureUnit === "F" ? ((data.temperature * 9) / 5 + 32).toFixed(1) : data.temperature.toFixed(1)

  if (!connected) {
    return (
      <div className="flex h-full items-center justify-center py-6">
        <div className="text-center">
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-red-500 mx-auto"></div>
          <p className="text-red-300/70">Connecting to device...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SensorCard
          icon={<Thermometer className="h-8 w-8 text-red-500" />}
          value={`${displayTemp}°${temperatureUnit}`}
          label="Temperature"
          color="bg-gradient-to-br from-black to-red-900/70"
        />
        <SensorCard
          icon={<Droplets className="h-8 w-8 text-blue-400" />}
          value={`${data.humidity.toFixed(1)}%`}
          label="Humidity"
          color="bg-gradient-to-br from-black to-blue-900/70"
        />
      </div>
      <SensorCard
        icon={<Gauge className="h-8 w-8 text-red-400" />}
        value={data.fanPower ? `${data.rpm} RPM` : "0 RPM"}
        label="Fan Speed"
        color="bg-gradient-to-br from-black to-red-950/70"
        fullWidth
      />
    </div>
  )
}

interface SensorCardProps {
  icon: React.ReactNode
  value: string
  label: string
  color: string
  fullWidth?: boolean
}

function SensorCard({ icon, value, label, color, fullWidth }: SensorCardProps) {
  return (
    <Card className={`border-red-900/40 ${fullWidth ? "col-span-2" : ""}`}>
      <CardContent className={`flex items-center p-4 ${color} rounded-lg backdrop-blur-sm`}>
        <div className="mr-4">{icon}</div>
        <div>
          <div className="text-xl font-bold text-white font-mono">{value}</div>
          <div className="text-sm text-red-300/70">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
