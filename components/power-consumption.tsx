"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMobile } from "@/hooks/use-mobile"
import { Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface PowerConsumptionProps {
  data: {
    fanPower: boolean
    fanSpeed: number
    powerUsage: number
  }
  historicalData: Array<{
    timestamp: Date
    powerUsage: number
  }>
  currency: string
}

// Currency conversion rates (approximate)
const currencyRates = {
  USD: { symbol: "$", rate: 1 },
  INR: { symbol: "₹", rate: 83.16 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  JPY: { symbol: "¥", rate: 151.77 },
}

export default function PowerConsumption({ data, historicalData, currency }: PowerConsumptionProps) {
  const isMobile = useMobile()
  const [selectedCurrency, setSelectedCurrency] = useState(currency)

  // Calculate total energy consumption (kWh)
  const totalEnergy =
    historicalData.length > 0
      ? ((historicalData.reduce((sum, item) => sum + item.powerUsage, 0) * 3) / 3600 / 1000).toFixed(5)
      : "0.00000"

  // Calculate estimated monthly cost (assuming $0.15 per kWh and 24/7 operation)
  const hourlyRate = data.powerUsage / 1000 // kW
  const dailyCost = hourlyRate * 24 * 0.15 // $ (base in USD)
  const monthlyCostUSD = dailyCost * 30

  // Convert to selected currency
  const currencyInfo = currencyRates[selectedCurrency as keyof typeof currencyRates] || currencyRates.USD
  const monthlyCost = (monthlyCostUSD * currencyInfo.rate).toFixed(2)

  // Format data for the chart
  const chartData = historicalData.map((item) => ({
    name: formatTime(item.timestamp),
    power: item.powerUsage,
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-xs text-red-300/70">Current Power</div>
          <div className="flex items-center gap-1 mt-1">
            <Zap className="h-4 w-4 text-red-500" />
            <span className="text-xl font-bold text-white font-mono">{data.powerUsage.toFixed(1)} W</span>
          </div>
        </div>

        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-xs text-red-300/70">Est. Monthly Cost</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xl font-bold text-white font-mono">
              {currencyInfo.symbol}
              {monthlyCost}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-32 bg-black/30 border-red-900/40 text-white text-xs h-8">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-red-900/40 text-white">
            <SelectItem value="USD">US Dollar ($)</SelectItem>
            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
            <SelectItem value="EUR">Euro (€)</SelectItem>
            <SelectItem value="GBP">British Pound (£)</SelectItem>
            <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[150px] w-full">
        {historicalData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-300/70">Collecting data...</p>
          </div>
        ) : (
          <ChartContainer
            config={{
              power: {
                label: "Power (W)",
                color: "hsl(130, 100%, 70%)",
              },
            }}
            className="text-white"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
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
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.7)" }}
                  tickCount={isMobile ? 3 : 6}
                  stroke="rgba(255,255,255,0.2)"
                />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.7)" }} stroke="rgba(255,255,255,0.2)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="power" stroke="var(--color-power)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>

      <div className="text-xs text-red-300/70 text-center">
        Total Energy: {totalEnergy} kWh ({currencyInfo.symbol}
        {(Number(totalEnergy) * 0.15 * currencyInfo.rate).toFixed(4)})
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
