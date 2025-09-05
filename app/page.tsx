"use client"
import React, { useState } from "react"

import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Services } from "@/components/sections/services"
import { Portfolio } from "@/components/sections/portfolio"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

// ===== Mouse Following Background =====
const MouseBackground = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="relative w-full min-h-full bg-[#000] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mouse Glow Effect */}
      {isHovered && (
        <div
          className="pointer-events-none fixed rounded-full"
          style={{
            width: "400px",
            height: "400px",
            top: mousePosition.y - 200,
            left: mousePosition.x - 200,
            background: "#37e5a530",
            filter: "blur(150px)",
            transform: "translate(-0%, -0%)",
            zIndex: 0, // stays behind content
            willChange: "transform, top, left",
          }}
        />
      )}

      {/* Page Content on top */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ===== Main Page =====
export default function Page() {
  return (
    <>
      {/* Fixed Navbar Outside */}
      
        <Navbar />
      

      {/* Rest of the Page with Mouse Background */}
      <MouseBackground>
        <main id="top" className="bg-dot-grid min-h-screen pt-4 ">
          {/* Sections */}
          <Hero />
          <About />
          <Skills />
          <Services />
          <Portfolio />
          <Contact />

          {/* Back to Top Button */}
          <a
            href="#top"
            aria-label="Back to top"
            className="fixed bottom-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-zinc-200"
          >
            ↑
          </a>

          <Footer />
        </main>
      </MouseBackground>
    </>
  )
}
