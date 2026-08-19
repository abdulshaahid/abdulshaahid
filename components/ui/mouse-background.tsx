"use client"

import React, { useRef } from "react"
import { WavePattern } from "@/components/ui/wave-pattern"

export function MouseBackground({ children }: { children: React.ReactNode }) {
  const glowRef = useRef<HTMLDivElement>(null)
  const isHovered = useRef(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (glowRef.current) {
      glowRef.current.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`
      if (!isHovered.current) {
        isHovered.current = true
        glowRef.current.style.opacity = "0.7"
      }
    }
  }

  const handleMouseLeave = () => {
    if (glowRef.current) {
      isHovered.current = false
      glowRef.current.style.opacity = "0"
    }
  }

  return (
    <div
      className="relative w-full min-h-full bg-[#09090b] text-white selection:bg-[#1fd38a] selection:text-black overflow-x-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        isHovered.current = true
        if (glowRef.current) glowRef.current.style.opacity = "0.7"
      }}
      onMouseLeave={handleMouseLeave}
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

      {/* Hardware-Accelerated Mouse Glow (Zero React re-render thrashing) */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed rounded-full -z-10 opacity-0 transition-opacity duration-300"
        style={{
          width: "400px",
          height: "400px",
          top: 0,
          left: 0,
          background: "radial-gradient(circle, rgba(31, 211, 138, 0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translate3d(-500px, -500px, 0)",
          willChange: "transform",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
