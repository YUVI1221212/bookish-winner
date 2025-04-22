"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMobile } from "@/hooks/use-mobile"

interface TemperatureChartProps {
  data: Array<{
    timestamp: Date
    temperature: number
    humidity: number
  }>
  temperatureUnit: string
}

export default function TemperatureChart({ data, temperatureUnit }: TemperatureChartProps) {
  const isMobile = useMobile()

  // Format data for the chart, converting temperature if needed
  const chartData = data.map((item, index) => {
    const temp = temperatureUnit === "F" ? (item.temperature * 9) / 5 + 32 : item.temperature

    return {
      name: formatTime(item.timestamp),
      temperature: temp,
      humidity: item.humidity,
      index,
    }
  })

  return (
    <div className="h-[300px] w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-300/70">Collecting data...</p>
        </div>
      ) : (
        <ChartContainer
          config={{
            temperature: {
              label: `Temperature (°${temperatureUnit})`,
              color: "hsl(0, 100%, 70%)",
            },
            humidity: {
              label: "Humidity (%)",
              color: "hsl(220, 100%, 70%)",
            },
          }}
          className="text-white"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
                tickCount={isMobile ? 3 : 6}
                stroke="rgba(255,255,255,0.2)"
              />
              <YAxis
                yAxisId="temperature"
                domain={[(dataMin: number) => Math.floor(dataMin - 1), (dataMax: number) => Math.ceil(dataMax + 1)]}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
                tickCount={5}
                stroke="rgba(255,255,255,0.2)"
              />
              <YAxis
                yAxisId="humidity"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
                tickCount={5}
                stroke="rgba(255,255,255,0.2)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="temperature"
                yAxisId="temperature"
                stroke="var(--color-temperature)"
                fill="var(--color-temperature)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                yAxisId="humidity"
                stroke="var(--color-humidity)"
                fill="var(--color-humidity)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
