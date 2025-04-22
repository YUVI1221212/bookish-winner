"use client"

import { Button } from "@/components/ui/button"
import { Moon, Zap, Wind, Coffee } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface QuickPresetsProps {
  onSelect: (preset: {
    name: string
    fanSpeed: number
    autoMode: boolean
    energySaving: boolean
    nightMode: boolean
  }) => void
  disabled?: boolean
}

export default function QuickPresets({ onSelect, disabled = false }: QuickPresetsProps) {
  const { toast } = useToast()

  const presets = [
    {
      name: "Sleep",
      icon: Moon,
      fanSpeed: 20,
      autoMode: false,
      energySaving: true,
      nightMode: true,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Eco",
      icon: Zap,
      fanSpeed: 40,
      autoMode: true,
      energySaving: true,
      nightMode: false,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Comfort",
      icon: Coffee,
      fanSpeed: 60,
      autoMode: true,
      energySaving: false,
      nightMode: false,
      color: "bg-amber-600 hover:bg-amber-700",
    },
    {
      name: "Boost",
      icon: Wind,
      fanSpeed: 100,
      autoMode: false,
      energySaving: false,
      nightMode: false,
      color: "bg-red-600 hover:bg-red-700",
    },
  ]

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    onSelect({
      name: preset.name,
      fanSpeed: preset.fanSpeed,
      autoMode: preset.autoMode,
      energySaving: preset.energySaving,
      nightMode: preset.nightMode,
    })

    toast({
      title: `${preset.name} Mode Activated`,
      description: `Fan speed set to ${preset.fanSpeed}%`,
    })
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {presets.map((preset, index) => (
        <motion.div
          key={preset.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="default"
            size="sm"
            className={`w-full ${preset.color} text-white flex flex-col items-center justify-center h-auto py-2`}
            onClick={() => handlePresetClick(preset)}
            disabled={disabled}
          >
            <preset.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{preset.name}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
