"use client"

import { useState } from "react"
import { useAuth, type Device } from "./auth-provider"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash, Laptop, Fan, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

export default function DeviceManager() {
  const { userSettings, updateUserSettings } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [newDevice, setNewDevice] = useState<Device>({
    id: "",
    name: "",
    type: "ceiling",
    location: "",
    connected: false,
  })

  const handleAddDevice = () => {
    setEditingDevice(null)
    setNewDevice({
      id: uuidv4(),
      name: "",
      type: "ceiling",
      location: "",
      connected: false,
    })
    setDialogOpen(true)
  }

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device)
    setNewDevice({ ...device })
    setDialogOpen(true)
  }

  const handleDeleteDevice = (id: string) => {
    const updatedDevices = userSettings.devices.filter((d) => d.id !== id)
    updateUserSettings({ devices: updatedDevices })
    toast({
      title: t("devices.delete"),
      description: t("devices.delete") + " " + id,
    })
  }

  const handleSaveDevice = () => {
    let updatedDevices: Device[]

    if (editingDevice) {
      // Update existing device
      updatedDevices = userSettings.devices.map((d) => (d.id === editingDevice.id ? newDevice : d))
    } else {
      // Add new device
      updatedDevices = [...userSettings.devices, newDevice]
    }

    updateUserSettings({ devices: updatedDevices })
    setDialogOpen(false)

    toast({
      title: editingDevice ? t("devices.edit") : t("devices.add"),
      description: newDevice.name,
    })
  }

  const handleConnectDevice = (id: string, connected: boolean) => {
    const updatedDevices = userSettings.devices.map((d) =>
      d.id === id ? { ...d, connected, lastConnected: connected ? new Date() : d.lastConnected } : d,
    )

    updateUserSettings({ devices: updatedDevices })

    toast({
      title: connected ? "Device connected" : "Device disconnected",
      description: userSettings.devices.find((d) => d.id === id)?.name,
    })
  }

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case "ceiling":
        return <Fan className="h-4 w-4" />
      case "table":
        return <Fan className="h-4 w-4" />
      case "floor":
        return <Fan className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  return (
    <>
      <Card className="bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Laptop className="h-5 w-5 text-red-500" />
              {t("devices.title")}
            </CardTitle>
            <CardDescription className="text-red-300/70">{t("devices.description")}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddDevice}
            className="border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("devices.add")}
          </Button>
        </CardHeader>
        <CardContent>
          {userSettings.devices.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500/50 mx-auto mb-4" />
              <p className="text-red-300/70">{t("devices.noDevices")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDevice}
                className="mt-4 border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("devices.add")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userSettings.devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-red-900/20"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center">
                      {getDeviceTypeIcon(device.type)}
                      <h4 className="font-medium text-white ml-2">{device.name}</h4>
                      <Badge
                        variant={device.connected ? "success" : "outline"}
                        className={
                          device.connected
                            ? "ml-2 bg-green-900/60 text-green-300 border-green-700/40"
                            : "ml-2 bg-black/40 text-red-300 border-red-700/40"
                        }
                      >
                        {device.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-red-300/70">
                      <p>{device.location}</p>
                      {device.lastConnected && (
                        <p>
                          {t("devices.lastSeen")}: {device.lastConnected.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnectDevice(device.id, !device.connected)}
                      className="border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
                    >
                      {device.connected ? "Disconnect" : "Connect"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditDevice(device)}
                      className="h-8 w-8 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDevice(device.id)}
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
            <DialogTitle>{editingDevice ? t("devices.edit") : t("devices.add")}</DialogTitle>
            <DialogDescription className="text-red-300/70">{t("devices.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("devices.name")}</Label>
              <Input
                id="name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                className="bg-black/30 border-red-900/40 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t("devices.type")}</Label>
              <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                <SelectTrigger id="type" className="bg-black/30 border-red-900/40 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-900/40 text-white">
                  <SelectItem value="ceiling">Ceiling Fan</SelectItem>
                  <SelectItem value="table">Table Fan</SelectItem>
                  <SelectItem value="floor">Floor Fan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("devices.location")}</Label>
              <Input
                id="location"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                className="bg-black/30 border-red-900/40 text-white"
              />
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
              onClick={handleSaveDevice}
              disabled={!newDevice.name || !newDevice.location}
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
