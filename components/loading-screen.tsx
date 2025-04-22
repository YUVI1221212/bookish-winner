"use client"

import { Fan } from "lucide-react"
import { useLanguage } from "./language-provider"

export default function LoadingScreen() {
  const { t } = useLanguage()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-900">
      <div className="text-center">
        <Fan className="h-16 w-16 text-red-500 mx-auto mb-4 animate-spin" />
        <h1 className="text-4xl font-bold text-white mb-2">
          fan<span className="text-red-500">C</span>
        </h1>
        <p className="text-red-300/70">{t("app.loading")}</p>
      </div>
    </div>
  )
}
