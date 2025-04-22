"use client"

import { motion } from "framer-motion"

interface GradientSpeedBarProps {
  value: number
  max?: number
  height?: number
  className?: string
}

export default function GradientSpeedBar({ value, max = 100, height = 10, className = "" }: GradientSpeedBarProps) {
  const percentage = (value / max) * 100

  // Get color based on value
  const getColor = () => {
    if (value === 0) return "#6c757d"
    if (value <= 20) return "#3498db"
    if (value <= 60) return "#2ecc71"
    if (value <= 80) return "#f1c40f"
    return "#e74c3c"
  }

  // Get label based on value
  const getLabel = () => {
    if (value === 0) return "OFF"
    if (value <= 20) return "LOW"
    if (value <= 60) return "MEDIUM"
    if (value <= 80) return "HIGH"
    return "MAX"
  }

  return (
    <div className={`relative ${className}`}>
      <div className="gradient-speed-bar" style={{ height }}>
        <motion.div
          className="gradient-speed-indicator"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span>0%</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-bold"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </motion.span>
        <span>100%</span>
      </div>
    </div>
  )
}
