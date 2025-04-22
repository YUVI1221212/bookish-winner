"use client"

import { useState } from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-provider"

export default function LanguageSwitcher() {
  const [showMenu, setShowMenu] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ]

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleMenu}>
        <Languages className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-black/90 border border-red-900/40 rounded-lg overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                  language === lang.code ? "bg-red-900/40" : ""
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
