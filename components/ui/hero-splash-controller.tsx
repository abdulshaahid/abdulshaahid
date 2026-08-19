"use client"

import React, { useState, useCallback } from "react"
import { SplashScreen } from "@/components/ui/splash-screen"
import { Hero } from "@/components/sections/hero"

export function HeroSplashController() {
  const [isSiteReady, setIsSiteReady] = useState(false)

  const handleSplashComplete = useCallback(() => {
    setIsSiteReady(true)
  }, [])

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />
      <Hero isReady={isSiteReady} />
    </>
  )
}
