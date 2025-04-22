"use client"

import { motion } from "framer-motion"

interface ForecastPoint {
  time: string
  temperature: number
}

interface TemperatureForecastProps {
  data: ForecastPoint[]
  temperatureUnit: string
}

export default function TemperatureForecast({ data, temperatureUnit }: TemperatureForecastProps) {
  // Find min and max temperatures for scaling
  const temperatures = data.map((point) => point.temperature)
  const minTemp = Math.min(...temperatures)
  const maxTemp = Math.max(...temperatures)
  const range = maxTemp - minTemp

  // Convert temperature to vertical position (0-100%)
  const tempToPosition = (temp: number) => {
    if (range === 0) return 50
    return 100 - ((temp - minTemp) / range) * 80 - 10 // 10-90% range
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Temperature Forecast</h3>

      <div className="forecast-strip h-16">
        {/* Temperature line */}
        <div className="forecast-line w-full" />

        {/* Forecast points */}
        {data.map((point, index) => {
          const position = (index / (data.length - 1)) * 100
          const yPosition = tempToPosition(point.temperature)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{ left: `${position}%` }}
            >
              <div
                className="forecast-point"
                style={{
                  top: `${yPosition}%`,
                  background: point.temperature > 25 ? "#e74c3c" : point.temperature > 20 ? "#f1c40f" : "#3498db",
                }}
              />
              <div className="forecast-label" style={{ left: `${position}%` }}>
                <div>{point.time}</div>
                <div>
                  {point.temperature}°{temperatureUnit}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
