"use client"

import type React from "react"

interface TooltipWrapperProps {
  text: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
}

export default function TooltipWrapper({ text, children, position = "top" }: TooltipWrapperProps) {
  // Calculate position styles
  const getPositionStyles = () => {
    switch (position) {
      case "bottom":
        return {
          top: "125%",
          left: "50%",
          transform: "translateX(-50%)",
        }
      case "left":
        return {
          top: "50%",
          right: "125%",
          transform: "translateY(-50%)",
        }
      case "right":
        return {
          top: "50%",
          left: "125%",
          transform: "translateY(-50%)",
        }
      case "top":
      default:
        return {
          bottom: "125%",
          left: "50%",
          transform: "translateX(-50%)",
        }
    }
  }

  return (
    <div className="tooltip">
      {children}
      <div className="tooltip-text" style={getPositionStyles()}>
        {text}
      </div>
    </div>
  )
}
