"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface ScheduleProps {
  schedule: {
    enabled: boolean
    startTime: string
    endTime: string
  }
  onUpdate: (schedule: ScheduleProps["schedule"]) => void
  connected: boolean
}

export default function ScheduleSettings({ schedule, onUpdate, connected }: ScheduleProps) {
  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className={`h-5 w-5 ${schedule.enabled ? "text-red-500" : "text-slate-400"}`} />
          <Label htmlFor="schedule-enabled" className="text-base font-medium">
            Schedule Fan
          </Label>
        </div>
        <Switch
          id="schedule-enabled"
          checked={schedule.enabled}
          onCheckedChange={(checked) => onUpdate({ ...schedule, enabled: checked })}
          disabled={!connected}
          className="data-[state=checked]:bg-red-500"
        />
      </div>

      {schedule.enabled && (
        <div className="space-y-4 bg-black/30 p-3 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="start-time" className="text-sm">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              value={schedule.startTime}
              onChange={(e) => onUpdate({ ...schedule, startTime: e.target.value })}
              className="bg-black/30 border-red-900/40 text-white"
              disabled={!connected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time" className="text-sm">
              End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={schedule.endTime}
              onChange={(e) => onUpdate({ ...schedule, endTime: e.target.value })}
              className="bg-black/30 border-red-900/40 text-white"
              disabled={!connected}
            />
          </div>

          <p className="text-xs text-red-300/70">Fan will automatically turn on and off according to this schedule</p>
        </div>
      )}
    </div>
  )
}
