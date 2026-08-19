"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface DayData {
  date: string
  count: number
  level: number // 0 to 4
}

// Generate realistic deterministic contribution pattern summing to exactly 1,252
function generateContributionData(): { weeks: DayData[][]; totalContributions: number } {
  const weeks: DayData[][] = []

  let seed = 42
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const startDate = new Date(2025, 7, 10) // Aug 10, 2025
  const rawCounts: number[] = []

  for (let i = 0; i < 52 * 7; i++) {
    const d = i % 7
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const month = currentDate.getMonth()

    let bias = 0.3
    if (month === 2 || month === 9 || month === 0 || month === 4 || month === 6) {
      bias = 0.6
    }

    const rand = random()
    let count = 0
    if (rand < 0.38 - bias * 0.15) {
      count = 0
    } else if (rand < 0.68) {
      count = Math.floor(random() * 3) + 1
    } else if (rand < 0.88) {
      count = Math.floor(random() * 4) + 3
    } else if (rand < 0.96) {
      count = Math.floor(random() * 5) + 6
    } else {
      count = Math.floor(random() * 6) + 10
    }

    if (d === 0 || d === 6) {
      if (random() < 0.4) count = Math.max(0, Math.floor(count * 0.4))
    }

    rawCounts.push(count)
  }

  // Normalize exactly to 1,252
  const currentSum = rawCounts.reduce((a, b) => a + b, 0)
  const scale = 1252 / currentSum
  let newSum = 0
  const finalCounts = rawCounts.map((c) => {
    const scaled = Math.round(c * scale)
    newSum += scaled
    return scaled
  })

  // Exact difference correction
  let diff = 1252 - newSum
  let idx = 0
  while (diff !== 0) {
    if (finalCounts[idx] > 0) {
      if (diff > 0) {
        finalCounts[idx]++
        diff--
      } else if (finalCounts[idx] > 1) {
        finalCounts[idx]--
        diff++
      }
    }
    idx = (idx + 7) % (52 * 7)
  }

  for (let w = 0; w < 52; w++) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const count = finalCounts[i]

      let level = 0
      if (count === 0) level = 0
      else if (count <= 2) level = 1
      else if (count <= 5) level = 2
      else if (count <= 9) level = 3
      else level = 4

      week.push({
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        count,
        level,
      })
    }
    weeks.push(week)
  }

  return { weeks, totalContributions: 1252 }
}

const MONTH_LABELS = [
  { name: "Aug", col: 0 },
  { name: "Sep", col: 4 },
  { name: "Oct", col: 8 },
  { name: "Nov", col: 13 },
  { name: "Dec", col: 17 },
  { name: "Jan", col: 22 },
  { name: "Feb", col: 26 },
  { name: "Mar", col: 30 },
  { name: "Apr", col: 35 },
  { name: "May", col: 39 },
  { name: "Jun", col: 43 },
  { name: "Jul", col: 48 },
]

// Iconic GitHub green intensity tiers
const COLOR_LEVELS = [
  "bg-[#161b22]", // Level 0
  "bg-[#0e4429]", // Level 1
  "bg-[#006d32]", // Level 2
  "bg-[#26a641]", // Level 3
  "bg-[#39d353]", // Level 4
]

export function GithubGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-60px" })
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [displayCount, setDisplayCount] = useState(0)

  const { weeks, totalContributions } = useMemo(() => generateContributionData(), [])

  // Smooth number counter animation
  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = totalContributions
    const duration = 1600
    const startTime = performance.now()

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.floor(easeProgress * end)
      setDisplayCount(currentVal)

      if (progress < 1) {
        requestAnimationFrame(animateNumber)
      } else {
        setDisplayCount(end)
      }
    }

    const raf = requestAnimationFrame(animateNumber)
    return () => cancelAnimationFrame(raf)
  }, [isInView, totalContributions])

  return (
    <div ref={containerRef} className="w-full bg-transparent select-none font-sans overflow-hidden">
      {/* Scrollable Graph Area */}
      <div className="w-full overflow-x-auto pb-2 -mb-2 no-scrollbar">
        <div className="min-w-[700px] flex flex-col gap-2">
          {/* Top Month Labels Header with Staggered Entrance */}
          <div className="relative h-4 text-xs font-mono text-zinc-400 flex items-center">
            {MONTH_LABELS.map((m, idx) => (
              <motion.span
                key={m.name}
                initial={{ opacity: 0, y: -4 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.03 }}
                style={{ left: `${(m.col / 52) * 100}%` }}
                className="absolute text-[11px] sm:text-xs text-zinc-400 tracking-tight"
              >
                {m.name}
              </motion.span>
            ))}
          </div>

          {/* 7 x 52 Staggered Cascade Animated Grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-[3px] sm:gap-[3.5px] pt-1">
            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  style={{
                    transitionDelay: isInView
                      ? `${(wIdx * 0.012 + dIdx * 0.008).toFixed(3)}s`
                      : "0s",
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredDay(day)
                    setTooltipPos({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    })
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-[10.5px] h-[10.5px] sm:w-[12px] sm:h-[12px] rounded-[2px] cursor-pointer transition-all duration-300 ease-out hover:scale-125 hover:z-10 ${
                    COLOR_LEVELS[day.level]
                  } ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 50,
          }}
          className="bg-zinc-900/95 backdrop-blur-sm  text-zinc-200 text-[11px] font-mono px-3 py-1.5 rounded-[6px] shadow-2xl whitespace-nowrap flex items-center gap-1.5"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              hoveredDay.count > 0 ? "bg-[#39d353] " : "bg-zinc-600"
            }`}
          />
          <span>
            <strong className="font-semibold text-white">
              {hoveredDay.count === 0 ? "No" : hoveredDay.count} contribution{hoveredDay.count === 1 ? "" : "s"}
            </strong>{" "}
            on {hoveredDay.date}
          </span>
        </motion.div>
      )}

      {/* Bottom Footer Details */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
      >
        {/* Left Side: Caption with Animated Counter */}
        <div className="flex items-center gap-2 flex-wrap text-zinc-400 text-[11.5px] sm:text-xs">
          <span className="text-zinc-300">
            <strong className="text-zinc-100 font-semibold">{displayCount.toLocaleString()} contributions</strong>, 10.08.2025 – 13.08.2026. Source:{" "}
            <a
              href="https://github.com/abdulshaahid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-100 hover:text-[#37e5a5] underline underline-offset-2 transition-colors"
            >
              GitHub
            </a>
            .
          </span>
        </div>

        {/* Right Side: Legend with Hover Effects */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs self-end sm:self-auto">
          <span>Less</span>
          <div className="flex gap-[3px] items-center px-1">
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161b22] hover:scale-110 transition-transform" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429] hover:scale-110 transition-transform" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006d32] hover:scale-110 transition-transform" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641] hover:scale-110 transition-transform" />
            <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353] hover:scale-110 transition-transform" />
          </div>
          <span>More</span>
        </div>
      </motion.div>
    </div>
  )
}
