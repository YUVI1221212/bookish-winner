"use client"

import { useState } from "react"
import { useAuth, type Automation } from "./auth-provider"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash, Play, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

export default function AutomationManager() {
  const { userSettings, updateUserSettings } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)
  const [newAutomation, setNewAutomation] = useState<Automation>({
    id: "",
    name: "",
    condition: {
      type: "temperature",
      value: 25,
    },
    action: {
      type: "fanSpeed",
      value: 80,
    },
    enabled: true,
  })

  const handleAddAutomation = () => {
    setEditingAutomation(null)
    setNewAutomation({
      id: uuidv4(),
      name: "",
      condition: {
        type: "temperature",
        value: 25,
      },
      action: {
        type: "fanSpeed",
        value: 80,
      },
      enabled: true,
    })
    setDialogOpen(true)
  }

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation)
    setNewAutomation({ ...automation })
    setDialogOpen(true)
  }

  const handleDeleteAutomation = (id: string) => {
    const updatedAutomations = userSettings.automations.filter((a) => a.id !== id)
    updateUserSettings({ automations: updatedAutomations })
    toast({
      title: t("automation.delete"),
      description: t("automation.delete") + " " + id,
    })
  }

  const handleSaveAutomation = () => {
    let updatedAutomations: Automation[]

    if (editingAutomation) {
      // Update existing automation
      updatedAutomations = userSettings.automations.map((a) => (a.id === editingAutomation.id ? newAutomation : a))
    } else {
      // Add new automation
      updatedAutomations = [...userSettings.automations, newAutomation]
    }

    updateUserSettings({ automations: updatedAutomations })
    setDialogOpen(false)

    toast({
      title: editingAutomation ? t("automation.edit") : t("automation.add"),
      description: newAutomation.name,
    })
  }

  const handleToggleAutomation = (id: string, enabled: boolean) => {
    const updatedAutomations = userSettings.automations.map((a) => (a.id === id ? { ...a, enabled } : a))

    updateUserSettings({ automations: updatedAutomations })

    toast({
      title: enabled ? "Automation enabled" : "Automation disabled",
      description: userSettings.automations.find((a) => a.id === id)?.name,
    })
  }

  const renderConditionText = (automation: Automation) => {
    switch (automation.condition.type) {
      case "temperature":
        return `${t("automation.if")} ${t("sensor.temperature")} > ${automation.condition.value}°${userSettings.temperatureUnit}`
      case "humidity":
        return `${t("automation.if")} ${t("sensor.humidity")} > ${automation.condition.value}%`
      case "time":
        return `${t("automation.if")} ${t("schedule.title")} = ${automation.condition.value}`
      default:
        return `${t("automation.if")} ${automation.condition.type} > ${automation.condition.value}`
    }
  }

  const renderActionText = (automation: Automation) => {
    switch (automation.action.type) {
      case "fanSpeed":
        return `${t("automation.then")} ${t("fan.speed")} = ${automation.action.value}%`
      case "fanPower":
        return `${t("automation.then")} ${t("fan.power")} = ${automation.action.value ? "On" : "Off"}`
      case "autoMode":
        return `${t("automation.then")} ${t("fan.auto")} = ${automation.action.value ? "On" : "Off"}`
      case "energySaving":
        return `${t("automation.then")} ${t("fan.energy")} = ${automation.action.value ? "On" : "Off"}`
      default:
        return `${t("automation.then")} ${automation.action.type} = ${automation.action.value}`
    }
  }

  return (
    <>
      <Card className="bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Play className="h-5 w-5 text-red-500" />
              {t("automation.title")}
            </CardTitle>
            <CardDescription className="text-red-300/70">{t("automation.description")}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAutomation}
            className="border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("automation.add")}
          </Button>
        </CardHeader>
        <CardContent>
          {userSettings.automations.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500/50 mx-auto mb-4" />
              <p className="text-red-300/70">{t("automation.noAutomations")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAutomation}
                className="mt-4 border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("automation.add")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userSettings.automations.map((automation) => (
                <div
                  key={automation.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-red-900/20"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${automation.enabled ? "bg-green-500" : "bg-gray-500"}`}
                      />
                      <h4 className="font-medium text-white">{automation.name}</h4>
                    </div>
                    <div className="mt-1 text-sm text-red-300/70">
                      <p>{renderConditionText(automation)}</p>
                      <p>{renderActionText(automation)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={automation.enabled}
                      onCheckedChange={(checked) => handleToggleAutomation(automation.id, checked)}
                      className="data-[state=checked]:bg-red-500"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAutomation(automation)}
                      className="h-8 w-8 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAutomation(automation.id)}
                      className="h-8 w-8 text-white hover:bg-white/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black/90 border-red-900/40 text-white">
          <DialogHeader>
            <DialogTitle>{editingAutomation ? t("automation.edit") : t("automation.add")}</DialogTitle>
            <DialogDescription className="text-red-300/70">{t("automation.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("automation.name")}</Label>
              <Input
                id="name"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                className="bg-black/30 border-red-900/40 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("automation.condition")}</Label>
              <div className="flex gap-2">
                <Select
                  value={newAutomation.condition.type}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      condition: { ...newAutomation.condition, type: value },
                    })
                  }
                >
                  <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-900/40 text-white">
                    <SelectItem value="temperature">{t("sensor.temperature")}</SelectItem>
                    <SelectItem value="humidity">{t("sensor.humidity")}</SelectItem>
                    <SelectItem value="time">{t("schedule.title")}</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  value={newAutomation.condition.value}
                  onChange={(e) =>
                    setNewAutomation({
                      ...newAutomation,
                      condition: {
                        ...newAutomation.condition,
                        value: Number.parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-24 bg-black/30 border-red-900/40 text-white"
                />

                <span className="flex items-center text-white">
                  {newAutomation.condition.type === "temperature"
                    ? `°${userSettings.temperatureUnit}`
                    : newAutomation.condition.type === "humidity"
                      ? "%"
                      : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("automation.action")}</Label>
              <div className="flex gap-2">
                <Select
                  value={newAutomation.action.type}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      action: {
                        type: value,
                        value:
                          value === "fanPower" || value === "autoMode" || value === "energySaving"
                            ? true
                            : value === "fanSpeed"
                              ? 80
                              : 0,
                      },
                    })
                  }
                >
                  <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-900/40 text-white">
                    <SelectItem value="fanSpeed">{t("fan.speed")}</SelectItem>
                    <SelectItem value="fanPower">{t("fan.power")}</SelectItem>
                    <SelectItem value="autoMode">{t("fan.auto")}</SelectItem>
                    <SelectItem value="energySaving">{t("fan.energy")}</SelectItem>
                  </SelectContent>
                </Select>

                {newAutomation.action.type === "fanSpeed" ? (
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newAutomation.action.value as number}
                    onChange={(e) =>
                      setNewAutomation({
                        ...newAutomation,
                        action: {
                          ...newAutomation.action,
                          value: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-24 bg-black/30 border-red-900/40 text-white"
                  />
                ) : (
                  <Select
                    value={(newAutomation.action.value as boolean).toString()}
                    onValueChange={(value) =>
                      setNewAutomation({
                        ...newAutomation,
                        action: {
                          ...newAutomation.action,
                          value: value === "true",
                        },
                      })
                    }
                  >
                    <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-red-900/40 text-white">
                      <SelectItem value="true">On</SelectItem>
                      <SelectItem value="false">Off</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {newAutomation.action.type === "fanSpeed" && <span className="flex items-center text-white">%</span>}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="enabled"
                checked={newAutomation.enabled}
                onCheckedChange={(checked) => setNewAutomation({ ...newAutomation, enabled: checked })}
                className="data-[state=checked]:bg-red-500"
              />
              <Label htmlFor="enabled">{t("automation.enable")}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAutomation}
              disabled={!newAutomation.name}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
