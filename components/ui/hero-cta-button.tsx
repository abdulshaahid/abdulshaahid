"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"

interface HeroCtaButtonProps {
  text?: string
  href?: string
  download?: boolean | string
  target?: string
  variant?: "white" | "black"
  icon?: "arrow" | "download"
  className?: string
  onClick?: () => void
}

export function HeroCtaButton({
  text = "Discuss",
  href = "#contact",
  download,
  target,
  variant = "white",
  icon = "arrow",
  className = "",
  onClick,
}: HeroCtaButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isBlack = variant === "black"

  return (
    <motion.a
      href={href}
      download={download}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered
          ? "#27bf88"
          : isBlack
          ? "#222222"
          : "#dedede",
        
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative inline-flex items-center h-[42px] sm:h-11 md:h-12 rounded-full  cursor-pointer select-none overflow-hidden shadow-lg shadow-black/30 hover:shadow-[0_0_24px_rgba(39,191,136,0.35)] transition-shadow duration-300 shrink-0 ${className}`}
      style={{
        flexDirection: isHovered ? "row-reverse" : "row",
        paddingLeft: isHovered ? "6px" : "18px",
        paddingRight: isHovered ? "18px" : "6px",
        gap: "10px",
      }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        animate={{
          color: isHovered ? "#000000" : isBlack ? "#ffffff" : "#000000",
        }}
        className="text-xs sm:text-sm font-sans font-semibold tracking-normal whitespace-nowrap"
      >
        {text}
      </motion.span>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        animate={{
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0)" : "#27bf88",
          borderColor: isHovered ? "#000000" : "transparent",
        }}
        className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-2 shrink-0 text-black"
      >
        {icon === "download" ? (
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
        )}
      </motion.div>
    </motion.a>
  )
}
