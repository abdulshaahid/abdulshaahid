"use client"

import type React from "react"
import { useState, useCallback } from "react"

import dynamic from "next/dynamic"

import { SplashScreen } from "@/components/ui/splash-screen"
import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Portfolio } from "@/components/sections/portfolio"
import { SlopeDivider } from "@/components/ui/geometric"
import { WavePattern } from "@/components/ui/wave-pattern"
import { Footer } from "@/components/sections/footer"

const GithubActivity = dynamic(() => import("@/components/sections/github-activity").then((m) => m.GithubActivity))
const Skills = dynamic(() => import("@/components/sections/skills").then((m) => m.Skills))
const Writing = dynamic(() => import("@/components/sections/writing").then((m) => m.Writing))
const Guestbook = dynamic(() => import("@/components/sections/guestbook").then((m) => m.Guestbook))
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact))

// ===== Mouse Following Ambient Glow =====
const MouseBackground = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="relative w-full min-h-full bg-[#09090b] text-white selection:bg-[#1fd38a] selection:text-black overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Universal Interactive Banknote Wave Pattern Background */}
      <WavePattern
        strokeColor="220, 220, 220"
        waveAmplitude={9}
        waveLength={85}
        rowSpacing={16}
        lineWidth={1}
        interactive={true}
        opacity={0.06}
      />

      {/* Subtle Mouse Glow */}
      {isHovered && (
        <div
          className="pointer-events-none fixed rounded-full -z-10 opacity-70"
          style={{
            width: "400px",
            height: "400px",
            top: mousePosition.y - 200,
            left: mousePosition.x - 200,
            background: "radial-gradient(circle, rgba(31, 211, 138, 0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translateZ(0)",
            willChange: "top, left",
          }}
        />
      )}

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ===== Main Portfolio Page =====
export default function Page() {
  const [isSiteReady, setIsSiteReady] = useState(false)

  const handleSplashComplete = useCallback(() => {
    setIsSiteReady(true)
  }, [])

  return (
    <>
      {/* Splash Screen */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Page Layout */}
      <MouseBackground>
        <main id="top" className="relative min-h-screen pt-0">
          {/* Hero Section (Preserved) */}
          <Hero isReady={isSiteReady} />

          {/* Spacing below hero before geometric sections start */}
          <div className="pt-8 sm:pt-16">
            {/* 1. Philosophy / About Section (First section starting below Hero) */}
            <About />
          </div>

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 2. Projects / Work Section */}
          <Portfolio />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* GitHub Activity / Open Source Section */}
          <GithubActivity />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 3. Skills / Ecosystem Section */}
          <Skills />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 4. Writing / Blog Section */}
          <Writing />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 5. Guestbook / Social Proof Section */}
          <Guestbook />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 6. Final Contact CTA Module */}
          <Contact />

          {/* 7. Footer */}
          <Footer />
        </main>
      </MouseBackground>
    </>
  )
}
