"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Sun, Bell, Languages, Zap, Thermometer } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "./language-provider"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: {
    currency: string
    temperatureUnit: string
    theme: string
    notifications: boolean
    language: string
    autoConnect: boolean
  }
  onSettingsChange: (settings: SettingsModalProps["settings"]) => void
}

export default function SettingsModal({ open, onOpenChange, settings, onSettingsChange }: SettingsModalProps) {
  const { t, setLanguage } = useLanguage()

  const handleChange = (key: keyof typeof settings, value: any) => {
    if (key === "language") {
      setLanguage(value)
    }

    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  const resetSettings = () => {
    onSettingsChange({
      currency: "USD",
      temperatureUnit: "C",
      theme: "dark",
      notifications: true,
      language: "en",
      autoConnect: true,
    })
    setLanguage("en")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-red-900/40 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-red-500" />
            {t("settings.title")}
          </DialogTitle>
          <DialogDescription className="text-red-300/70">{t("settings.description")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/60">
            <TabsTrigger value="general" className="text-white data-[state=active]:bg-red-900/60">
              {t("settings.general")}
            </TabsTrigger>
            <TabsTrigger value="display" className="text-white data-[state=active]:bg-red-900/60">
              {t("settings.display")}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-red-900/60">
              {t("settings.advanced")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-500" />
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    {t("settings.notifications")}
                  </Label>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleChange("notifications", checked)}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-red-500" />
                  <Label htmlFor="language" className="text-sm font-medium">
                    {t("settings.language")}
                  </Label>
                </div>
                <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                  <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-900/40 text-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <Label htmlFor="currency" className="text-sm font-medium">
                    {t("settings.currency")}
                  </Label>
                </div>
                <Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                    <SelectValue placeholder="Select currency" />
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
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-red-500" />
                  <Label htmlFor="theme" className="text-sm font-medium">
                    {t("settings.theme")}
                  </Label>
                </div>
                <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
                  <SelectTrigger className="w-32 bg-black/30 border-red-900/40 text-white">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-900/40 text-white">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <Label htmlFor="temperatureUnit" className="text-sm font-medium">
                    {t("settings.temperatureUnit")}
                  </Label>
                </div>
                <Select
                  value={settings.temperatureUnit}
                  onValueChange={(value) => handleChange("temperatureUnit", value)}
                >
                  <SelectTrigger className="bg-black/30 border-red-900/40 text-white">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-900/40 text-white">
                    <SelectItem value="C">Celsius (°C)</SelectItem>
                    <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  <Label htmlFor="autoConnect" className="text-sm font-medium">
                    {t("settings.autoConnect")}
                  </Label>
                </div>
                <Switch
                  id="autoConnect"
                  checked={settings.autoConnect}
                  onCheckedChange={(checked) => handleChange("autoConnect", checked)}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300 active:bg-red-900/50 active:text-red-200"
                  onClick={resetSettings}
                >
                  {t("settings.reset")}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="bg-red-900/40 my-4" />

        <div className="flex justify-end">
          <Button
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white active:bg-red-800"
            onClick={() => onOpenChange(false)}
          >
            {t("settings.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
