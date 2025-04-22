"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Wind, MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherIntegrationProps {
  connected: boolean
  temperatureUnit: string
}

interface WeatherData {
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
  location: string
  feelsLike: number
}

export default function WeatherIntegration({ connected, temperatureUnit }: WeatherIntegrationProps) {
  const [weather, setWeather] = useState<WeatherData>({
    condition: "sunny",
    temperature: 28,
    humidity: 45,
    windSpeed: 5,
    location: "Kanpur, India",
    feelsLike: 30,
  })

  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [geoPermission, setGeoPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateWeather = async () => {
    if (!connected) return

    setLoading(true)
    setError(null)

    try {
      // Get current season and time in Kanpur
      const now = new Date()
      const month = now.getMonth() + 1 // 1-12
      const hour = now.getHours()
      const isNight = hour < 6 || hour > 18

      // Seasonal weather patterns for Kanpur based on real data
      let seasonalData = {
        condition: isNight ? "clear" : "sunny",
        baseTemp: 30,
        tempVariation: 5,
        baseHumidity: 45,
        humidityVariation: 15,
        baseWindSpeed: 5,
        windVariation: 3,
      }

      // Winter (November to February)
      if (month >= 11 || month <= 2) {
        // Winter in Kanpur is cool and dry
        seasonalData = {
          condition: isNight ? "clear" : Math.random() > 0.7 ? "cloudy" : "sunny",
          baseTemp: isNight ? 12 : 18,
          tempVariation: 4,
          baseHumidity: 55,
          humidityVariation: 10,
          baseWindSpeed: 3,
          windVariation: 2,
        }
      }
      // Summer (March to June)
      else if (month >= 3 && month <= 6) {
        // Summer in Kanpur is very hot and dry
        seasonalData = {
          condition: isNight ? "clear" : Math.random() > 0.8 ? "windy" : "sunny",
          baseTemp: isNight ? 28 : 38,
          tempVariation: 4,
          baseHumidity: 30,
          humidityVariation: 15,
          baseWindSpeed: 6,
          windVariation: 4,
        }

        // May-June can reach extreme temperatures
        if (month >= 5) {
          seasonalData.baseTemp += 4
        }
      }
      // Monsoon (July to October)
      else {
        // Monsoon in Kanpur brings rain and humidity
        const rainChance = isNight ? 0.3 : 0.6
        seasonalData = {
          condition:
            Math.random() > rainChance ? (isNight ? "clear" : "sunny") : Math.random() > 0.5 ? "rainy" : "cloudy",
          baseTemp: isNight ? 25 : 30,
          tempVariation: 3,
          baseHumidity: 75,
          humidityVariation: 15,
          baseWindSpeed: 4,
          windVariation: 3,
        }
      }

      // Calculate values with some randomness to simulate real data
      const temperature = Math.round(
        seasonalData.baseTemp + (Math.random() * seasonalData.tempVariation * 2 - seasonalData.tempVariation),
      )
      const humidity = Math.round(
        seasonalData.baseHumidity +
          (Math.random() * seasonalData.humidityVariation * 2 - seasonalData.humidityVariation),
      )
      const windSpeed = Math.round(
        seasonalData.baseWindSpeed + (Math.random() * seasonalData.windVariation * 2 - seasonalData.windVariation),
      )

      // Calculate feels like temperature based on heat index and wind chill
      let feelsLike = temperature

      // Heat index calculation (simplified) for hot weather
      if (temperature > 27) {
        const heatEffect = 0.05 * humidity
        feelsLike = temperature + heatEffect
      }
      // Wind chill effect for cooler weather
      else if (temperature < 20 && windSpeed > 3) {
        const windEffect = 0.1 * windSpeed
        feelsLike = temperature - windEffect
      }

      feelsLike = Math.round(feelsLike)

      // Update weather state
      setWeather({
        condition: seasonalData.condition,
        temperature,
        humidity,
        windSpeed,
        location: "Kanpur, India",
        feelsLike,
      })

      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching weather:", err)
      setError("Failed to update weather data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected) {
      // Check for geolocation permission
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((result) => {
            setGeoPermission(result.state === "granted")
          })
          .catch(() => {
            setGeoPermission(false)
          })
      } else {
        setGeoPermission(false)
      }

      updateWeather()
    }
  }, [connected])

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
      case "clear":
        return <Sun className="h-10 w-10 text-yellow-400" />
      case "cloudy":
        return <Cloud className="h-10 w-10 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-400" />
      case "windy":
        return <Wind className="h-10 w-10 text-cyan-400" />
      default:
        return <Cloud className="h-10 w-10 text-gray-400" />
    }
  }

  const getRecommendation = () => {
    if (weather.condition === "sunny" && weather.temperature > 35) {
      return "Extreme heat detected. Maximum fan speed recommended for comfort."
    } else if (weather.condition === "sunny" && weather.temperature > 30) {
      return "High temperature detected. Increasing fan speed recommended."
    } else if (weather.condition === "rainy" && weather.humidity > 70) {
      return "High humidity detected. Consider running fan to improve air circulation."
    } else if (weather.condition === "windy" && weather.windSpeed > 10) {
      return "Strong winds outside. Natural ventilation may be sufficient."
    } else if (weather.temperature < 20) {
      return "Cool temperature detected. Consider reducing fan speed or using auto mode."
    } else {
      return "Current weather conditions are optimal for standard fan operation."
    }
  }

  // Convert temperature if needed
  const displayTemp = temperatureUnit === "F" ? Math.round((weather.temperature * 9) / 5 + 32) : weather.temperature

  const displayFeelsLike = temperatureUnit === "F" ? Math.round((weather.feelsLike * 9) / 5 + 32) : weather.feelsLike

  if (!connected) {
    return (
      <div className="flex h-full items-center justify-center py-6">
        <div className="text-center">
          <p className="text-red-300/70">Connect to device to fetch weather data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon()}
          <div>
            <div className="text-xl font-bold text-white font-mono">
              {displayTemp}°{temperatureUnit}
            </div>
            <div className="text-sm text-red-300/70 capitalize">{weather.condition}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-white">
            Feels like: {displayFeelsLike}°{temperatureUnit}
          </div>
          <div className="text-sm text-red-300/70">{weather.humidity}% Humidity</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-red-300/70">
        <MapPin className="h-4 w-4" />
        <span>{weather.location}</span>
      </div>

      <div className="bg-black/30 p-3 rounded-lg">
        <div className="text-sm text-white font-medium mb-1">Recommendation:</div>
        <p className="text-sm text-red-300/70">{getRecommendation()}</p>
      </div>

      <div className="flex justify-between items-center text-xs text-red-300/70">
        <span>{lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Not updated yet"}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={updateWeather}
          disabled={loading}
          className="border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-3 w-3" />
              Update
            </>
          )}
        </Button>
      </div>
      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  )
}
