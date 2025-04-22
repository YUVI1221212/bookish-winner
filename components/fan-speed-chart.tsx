"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMobile } from "@/hooks/use-mobile"

interface FanSpeedChartProps {
  data: Array<{
    timestamp: Date
    rpm: number
    fanSpeed: number
  }>
}

export default function FanSpeedChart({ data }: FanSpeedChartProps) {
  const isMobile = useMobile()

  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: formatTime(item.timestamp),
    rpm: item.rpm,
    fanSpeed: item.fanSpeed,
    index,
  }))

  return (
    <div className="h-[300px] w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-300/70">Collecting data...</p>
        </div>
      ) : (
        <ChartContainer
          config={{
            rpm: {
              label: "Fan RPM",
              color: "hsl(350, 100%, 60%)",
            },
            fanSpeed: {
              label: "Fan Speed (%)",
              color: "hsl(180, 100%, 70%)",
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
                yAxisId="rpm"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
                tickCount={5}
                stroke="rgba(255,255,255,0.2)"
              />
              <YAxis
                yAxisId="fanSpeed"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.7)" }}
                tickCount={5}
                stroke="rgba(255,255,255,0.2)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="rpm"
                yAxisId="rpm"
                stroke="var(--color-rpm)"
                fill="var(--color-rpm)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="fanSpeed"
                yAxisId="fanSpeed"
                stroke="var(--color-fanSpeed)"
                fill="var(--color-fanSpeed)"
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
