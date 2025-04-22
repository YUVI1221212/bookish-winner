"use client"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fan, Power, Gauge, Thermometer, Moon, Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

interface FanControlsProps {
  data: {
    fanPower: boolean
    fanSpeed: number
    autoMode: boolean
    autoThreshold: number
    energySaving: boolean
    nightMode: boolean
  }
  onUpdate: (updates: Partial<FanControlsProps["data"]>) => void
  connected: boolean
}

export default function FanControls({ data, onUpdate, connected }: FanControlsProps) {
  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={data.fanPower ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: data.fanPower ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          >
            <Power className={`h-5 w-5 ${data.fanPower ? "text-green-400" : "text-slate-400"}`} />
          </motion.div>
          <Label htmlFor="fan-power" className="text-base font-medium">
            Power
          </Label>
        </div>
        <Switch
          id="fan-power"
          checked={data.fanPower}
          onCheckedChange={(checked) => onUpdate({ fanPower: checked })}
          disabled={!connected}
          className="data-[state=checked]:bg-red-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-red-500" />
          <Label htmlFor="fan-speed" className="text-base font-medium">
            Fan Speed: {data.fanSpeed}%
          </Label>
        </div>
        <div className="p-1 bg-black/30 rounded-lg">
          <Slider
            id="fan-speed"
            min={0}
            max={100}
            step={5}
            value={[data.fanSpeed]}
            onValueChange={(value) => onUpdate({ fanSpeed: value[0] })}
            disabled={!connected || !data.fanPower || data.autoMode}
            className={`${data.autoMode ? "opacity-50" : ""}`}
          />
        </div>
        <div className="flex justify-between text-xs text-red-300/70">
          <span>Min</span>
          <span>Max</span>
        </div>
      </div>

      <Separator className="bg-red-900/40" />

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Thermometer className={`h-5 w-5 ${data.autoMode ? "text-red-500" : "text-slate-400"}`} />
          <Label htmlFor="auto-mode" className="text-base font-medium">
            Auto Mode
          </Label>
        </div>
        <Switch
          id="auto-mode"
          checked={data.autoMode}
          onCheckedChange={(checked) => onUpdate({ autoMode: checked })}
          disabled={!connected || !data.fanPower}
          className="data-[state=checked]:bg-red-500"
        />
      </div>

      {data.autoMode && (
        <div className="space-y-2 pt-2 bg-black/30 p-3 rounded-lg">
          <Label htmlFor="temp-threshold" className="text-sm">
            Temperature Threshold: {data.autoThreshold}°C
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="temp-threshold"
              type="number"
              min={18}
              max={35}
              value={data.autoThreshold}
              onChange={(e) => onUpdate({ autoThreshold: Number(e.target.value) })}
              disabled={!connected || !data.autoMode}
              className="w-20 bg-black/30 border-red-900/40 text-white"
            />
            <span className="text-sm text-red-300/70">°C</span>
          </div>
          <p className="text-xs text-red-300/70">Fan speed will automatically adjust based on temperature</p>
        </div>
      )}

      <Separator className="bg-red-900/40" />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`h-5 w-5 ${data.energySaving ? "text-green-400" : "text-slate-400"}`} />
            <Label htmlFor="energy-saving" className="text-sm font-medium">
              Energy Saving
            </Label>
          </div>
          <Switch
            id="energy-saving"
            checked={data.energySaving}
            onCheckedChange={(checked) => onUpdate({ energySaving: checked })}
            disabled={!connected || !data.fanPower}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className={`h-5 w-5 ${data.nightMode ? "text-blue-400" : "text-slate-400"}`} />
            <Label htmlFor="night-mode" className="text-sm font-medium">
              Night Mode
            </Label>
          </div>
          <Switch
            id="night-mode"
            checked={data.nightMode}
            onCheckedChange={(checked) => onUpdate({ nightMode: checked })}
            disabled={!connected || !data.fanPower}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      </div>

      <div className="pt-2 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300 active:bg-red-900/50 active:text-red-200"
          disabled={!connected || !data.fanPower}
          onClick={() => onUpdate({ fanSpeed: 100 })}
        >
          <Fan className="mr-2 h-4 w-4" />
          Boost (100%)
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300 active:bg-red-900/50 active:text-red-200"
          disabled={!connected || !data.fanPower}
          onClick={() => onUpdate({ fanSpeed: 20 })}
        >
          <Fan className="mr-2 h-4 w-4" />
          Quiet (20%)
        </Button>
      </div>
    </div>
  )
}
