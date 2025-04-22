"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"

interface VoiceControlProps {
  onCommand: (command: string) => void
  connected: boolean
}

// Enhanced list of possible commands for better recognition
const possibleCommands = [
  "turn on the fan",
  "turn off the fan",
  "increase fan speed",
  "decrease fan speed",
  "set fan to maximum",
  "set fan to minimum",
  "enable auto mode",
  "disable auto mode",
  "turn on energy saving mode",
  "turn off energy saving mode",
  "enable night mode",
  "disable night mode",
  "enable schedule",
  "disable schedule",
  "set fan speed to 20 percent",
  "set fan speed to 50 percent",
  "set fan speed to 80 percent",
  "set fan speed to 100 percent",
  "fan on",
  "fan off",
  "speed up",
  "slow down",
  "maximum speed",
  "minimum speed",
  "auto on",
  "auto off",
  "energy saving on",
  "energy saving off",
  "night mode on",
  "night mode off",
  "schedule on",
  "schedule off",
]

export default function VoiceControl({ onCommand, connected }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recognitionActive, setRecognitionActive] = useState(false)
  const [processingCommand, setProcessingCommand] = useState(false)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)
  const recognitionTimeout = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguage()

  // Improved voice recognition simulation with better command matching
  const startListening = () => {
    if (!connected) return

    setIsListening(true)
    setTranscript("")
    setConfidence(0)
    setProcessingCommand(false)

    // Simulate microphone audio levels with more realistic patterns
    audioLevelInterval.current = setInterval(() => {
      // Create a more natural audio level pattern
      const baseLevel = Math.random() * 40 + 20
      const fluctuation = Math.sin(Date.now() / 200) * 20
      setAudioLevel(Math.max(0, Math.min(100, baseLevel + fluctuation)))
    }, 50)

    // After a short delay, show "Listening..." and start recognition
    setTimeout(() => {
      setRecognitionActive(true)

      // Simulate word-by-word recognition with improved accuracy
      const simulateWordByWord = () => {
        // Select a random command with higher probability for common commands
        let randomCommand
        const randomValue = Math.random()

        if (randomValue < 0.6) {
          // 60% chance to pick one of the most common commands
          const commonCommands = [
            "turn on the fan",
            "turn off the fan",
            "increase fan speed",
            "decrease fan speed",
            "set fan to maximum",
            "set fan to minimum",
          ]
          randomCommand = commonCommands[Math.floor(Math.random() * commonCommands.length)]
        } else {
          // 40% chance to pick any command
          randomCommand = possibleCommands[Math.floor(Math.random() * possibleCommands.length)]
        }

        const words = randomCommand.split(" ")

        let currentTranscript = ""
        let wordIndex = 0

        // Simulate word-by-word recognition with variable timing for realism
        const wordInterval = setInterval(
          () => {
            if (wordIndex < words.length) {
              currentTranscript += (wordIndex > 0 ? " " : "") + words[wordIndex]
              setTranscript(currentTranscript)
              wordIndex++

              // Gradually increase confidence as more words are recognized
              // More realistic confidence pattern with some fluctuations
              const baseConfidence = (wordIndex / words.length) * 100
              const fluctuation = Math.random() * 10 - 5 // +/- 5%
              setConfidence(Math.min(100, Math.max(0, baseConfidence + fluctuation)))
            } else {
              clearInterval(wordInterval)

              // Final recognized command with processing animation
              setProcessingCommand(true)

              setTimeout(() => {
                // Find the closest matching command from the possible commands
                const finalCommand = findBestMatch(currentTranscript, possibleCommands)
                setTranscript(finalCommand)
                setConfidence(95 + Math.random() * 5) // High confidence for final result
                setProcessingCommand(false)

                // Process the command
                setTimeout(() => {
                  onCommand(finalCommand)
                  stopListening()
                }, 500)
              }, 800)
            }
          },
          // Variable timing between words for more natural speech pattern
          200 + Math.random() * 300,
        )

        // Clean up if listening is stopped early
        recognitionTimeout.current = setTimeout(() => {
          clearInterval(wordInterval)
        }, 10000) as unknown as NodeJS.Timeout
      }

      simulateWordByWord()
    }, 600)
  }

  const stopListening = () => {
    setIsListening(false)
    setRecognitionActive(false)
    setProcessingCommand(false)

    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      audioLevelInterval.current = null
    }

    if (recognitionTimeout.current) {
      clearTimeout(recognitionTimeout.current)
      recognitionTimeout.current = null
    }

    setAudioLevel(0)
  }

  // Improved algorithm for finding the best matching command
  const findBestMatch = (input: string, commands: string[]): string => {
    const inputLower = input.toLowerCase()
    const inputWords = inputLower.split(" ")

    // First try exact matches
    for (const command of commands) {
      if (command.toLowerCase() === inputLower) {
        return command
      }
    }

    // Then try partial matches with improved scoring
    let bestMatch = commands[0]
    let bestScore = 0

    for (const command of commands) {
      const commandLower = command.toLowerCase()
      const commandWords = commandLower.split(" ")
      let score = 0

      // Check for word matches
      for (const word of commandWords) {
        if (inputWords.includes(word)) {
          score += 1
        }
      }

      // Check for key action words with higher weight
      const actionWords = ["turn", "on", "off", "increase", "decrease", "set", "enable", "disable"]
      for (const word of actionWords) {
        if (commandLower.includes(word) && inputLower.includes(word)) {
          score += 0.5
        }
      }

      // Check for sequential word matches (phrases)
      for (let i = 0; i < commandWords.length - 1; i++) {
        const phrase = `${commandWords[i]} ${commandWords[i + 1]}`
        if (inputLower.includes(phrase)) {
          score += 1
        }
      }

      // Bonus for length similarity
      const lengthDiff = Math.abs(commandWords.length - inputWords.length)
      if (lengthDiff === 0) score += 0.5
      else if (lengthDiff === 1) score += 0.3

      if (score > bestScore) {
        bestScore = score
        bestMatch = command
      }
    }

    return bestMatch
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
      if (recognitionTimeout.current) {
        clearTimeout(recognitionTimeout.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="bg-black/30 p-4 rounded-lg min-h-[120px] flex flex-col items-center justify-center relative overflow-hidden">
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 mx-0.5 bg-red-500/80 rounded-t-full"
                    animate={{
                      height: `${Math.max(5, Math.min(80, audioLevel * Math.random() * 1.5))}px`,
                    }}
                    transition={{ duration: 0.05 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="z-10 flex flex-col items-center">
          {isListening ? (
            <>
              <div className="relative mb-2">
                <Mic className="h-10 w-10 text-red-500 animate-pulse" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -inset-1 rounded-full border-2 border-red-500 opacity-20"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -inset-3 rounded-full border border-red-500 opacity-10"
                />
              </div>
              <p className="text-white text-center">
                {recognitionActive ? t("voice.listening") : t("voice.initializing")}
              </p>
              {transcript && (
                <div className="mt-2 text-center">
                  <p className="text-red-300">{`"${transcript}"`}</p>
                  {confidence > 0 && (
                    <div className="mt-1 w-full max-w-[200px]">
                      <Progress value={confidence} className="h-1 bg-black/50" />
                      <p className="text-xs text-red-300/70 mt-1">
                        {t("voice.confidence")}: {Math.round(confidence)}%
                      </p>
                    </div>
                  )}
                  {processingCommand && (
                    <motion.p
                      className="text-xs text-red-300/70 mt-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Processing command...
                    </motion.p>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <MicOff className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-red-300/70 text-center">{t("voice.prompt")}</p>
              {transcript && (
                <p className="text-white text-center mt-2">
                  {t("voice.last")}: "{transcript}"
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          size="lg"
          className={`w-full border-red-900/40 ${
            isListening
              ? "bg-red-900/30 text-red-300 active:bg-red-900/50 active:text-red-200"
              : "text-white hover:bg-red-900/30 hover:text-red-300 active:bg-red-900/50 active:text-red-200"
          }`}
          onClick={isListening ? stopListening : startListening}
          disabled={!connected}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              {t("voice.stop")}
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              {t("voice.start")}
            </>
          )}
        </Button>

        <div className="text-xs text-red-300/70">
          <p className="font-medium mb-1">{t("voice.examples")}:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-1">
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Turn on/off the fan</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Increase/decrease speed</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Set to maximum/minimum</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Enable/disable auto mode</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Turn on energy saving</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>Enable/disable schedule</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
