"use client"

import { useEffect } from "react"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface HelpStep {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

export default function HelpMode() {
  const [active, setActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const helpSteps: HelpStep[] = [
    {
      target: "[data-help='fan-controls']",
      title: "Fan Controls",
      description: "Adjust your fan power, speed, and modes from this panel.",
      position: "right",
    },
    {
      target: "[data-help='sensor-readings']",
      title: "Sensor Readings",
      description: "View current temperature, humidity, and fan speed readings.",
      position: "left",
    },
    {
      target: "[data-help='schedule']",
      title: "Schedule",
      description: "Set up automatic schedules for your fan to turn on and off.",
      position: "right",
    },
    {
      target: "[data-help='voice-control']",
      title: "Voice Control",
      description: "Control your fan with voice commands.",
      position: "left",
    },
    {
      target: "[data-help='charts']",
      title: "Charts",
      description: "View historical data for temperature and fan speed.",
      position: "top",
    },
  ]

  const toggleHelpMode = () => {
    setActive(!active)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < helpSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setActive(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Add highlight to current target element
  useEffect(() => {
    if (active) {
      const targetElements = document.querySelectorAll("[data-help]")
      targetElements.forEach((el) => {
        el.classList.remove("help-highlight")
      })

      const currentTarget = document.querySelector(helpSteps[currentStep].target)
      if (currentTarget) {
        currentTarget.classList.add("help-highlight")

        // Scroll to element
        currentTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    } else {
      // Remove all highlights when help mode is off
      const targetElements = document.querySelectorAll("[data-help]")
      targetElements.forEach((el) => {
        el.classList.remove("help-highlight")
      })
    }
  }, [active, currentStep, helpSteps])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full bg-red-600 text-white hover:bg-red-700 z-50"
        onClick={toggleHelpMode}
      >
        {active ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 bg-black/90 border border-red-900/40 rounded-lg p-4 max-w-xs z-50"
          >
            <h3 className="text-lg font-bold text-white mb-2">{helpSteps[currentStep].title}</h3>
            <p className="text-red-300/70 mb-4">{helpSteps[currentStep].description}</p>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-red-900/40 text-white hover:bg-red-900/30"
              >
                Previous
              </Button>

              <div className="text-xs text-red-300/70 flex items-center">
                {currentStep + 1} / {helpSteps.length}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                className="border-red-900/40 text-white hover:bg-red-900/30"
              >
                {currentStep === helpSteps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
