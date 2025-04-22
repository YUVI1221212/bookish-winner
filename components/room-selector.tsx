"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fan, Bed, Utensils, Tv, Bath } from "lucide-react"
import { motion } from "framer-motion"

interface Room {
  id: string
  name: string
  icon: React.ElementType
  fanName: string
}

interface RoomSelectorProps {
  onRoomChange: (roomId: string) => void
}

export default function RoomSelector({ onRoomChange }: RoomSelectorProps) {
  const [activeRoom, setActiveRoom] = useState("living-room")

  const rooms: Room[] = [
    { id: "living-room", name: "Living Room", icon: Tv, fanName: "Ceiling Fan" },
    { id: "bedroom", name: "Bedroom", icon: Bed, fanName: "Table Fan" },
    { id: "kitchen", name: "Kitchen", icon: Utensils, fanName: "Wall Fan" },
    { id: "bathroom", name: "Bathroom", icon: Bath, fanName: "Exhaust Fan" },
  ]

  const handleRoomChange = (roomId: string) => {
    setActiveRoom(roomId)
    onRoomChange(roomId)
  }

  const activeRoomData = rooms.find((room) => room.id === activeRoom) || rooms[0]

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeRoom} onValueChange={handleRoomChange} className="w-full">
        <TabsList className="grid grid-cols-4 bg-black/60">
          {rooms.map((room) => (
            <TabsTrigger
              key={room.id}
              value={room.id}
              className="flex items-center gap-2 text-white data-[state=active]:bg-red-900/60"
            >
              <room.icon className="h-4 w-4" />
              <span className="hidden md:inline">{room.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <motion.div
        key={activeRoom}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <Fan className="h-5 w-5 text-red-500" />
        <div>
          <h3 className="font-medium text-white">{activeRoomData.fanName}</h3>
          <p className="text-sm text-red-300/70">{activeRoomData.name}</p>
        </div>
      </motion.div>
    </div>
  )
}
