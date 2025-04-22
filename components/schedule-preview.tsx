"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface ScheduleEvent {
  start: string // HH:MM format
  end: string // HH:MM format
  speed: number
}

interface SchedulePreviewProps {
  schedule: {
    enabled: boolean
    startTime: string
    endTime: string
  }
  events?: ScheduleEvent[]
}

export default function SchedulePreview({ schedule, events = [] }: SchedulePreviewProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [currentPosition, setCurrentPosition] = useState(0)

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const timeString = `${hours}:${minutes}`
      setCurrentTime(timeString)

      // Calculate position (0-100%)
      const totalMinutes = 24 * 60
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      setCurrentPosition((currentMinutes / totalMinutes) * 100)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Generate default events if none provided
  const scheduleEvents = events.length > 0 ? events : [{ start: schedule.startTime, end: schedule.endTime, speed: 60 }]

  // Convert time string to percentage position
  const timeToPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const totalMinutes = 24 * 60
    const timeMinutes = hours * 60 + minutes
    return (timeMinutes / totalMinutes) * 100
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Schedule Preview</span>
        </div>
        <span className="text-sm">{currentTime}</span>
      </div>

      <div className="schedule-timeline">
        {/* Time markers */}
        <div className="absolute inset-0 flex justify-between px-2 text-xs text-red-300/70">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>

        {/* Schedule events */}
        {schedule.enabled &&
          scheduleEvents.map((event, index) => {
            const startPos = timeToPosition(event.start)
            const endPos = timeToPosition(event.end)
            const width = endPos - startPos

            return (
              <div
                key={index}
                className="schedule-event"
                style={{
                  left: `${startPos}%`,
                  width: `${width}%`,
                  opacity: 0.5 + event.speed / 200,
                }}
              >
                {width > 10 && (
                  <>
                    <span>{event.speed}%</span>
                  </>
                )}
              </div>
            )
          })}

        {/* Current time indicator */}
        <div className="schedule-now-indicator" style={{ left: `${currentPosition}%` }} />
      </div>

      {!schedule.enabled && <div className="text-center text-sm text-red-300/70">Schedule is currently disabled</div>}
    </div>
  )
}
