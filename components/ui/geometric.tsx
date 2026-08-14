import React from "react"
import { cn } from "@/lib/utils"

/**
 * Mathematically centered SVG crosshair marker.
 * Crisp, thin 1px stroke lines and compact size.
 */
export function CrosshairMarker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none flex items-center justify-center w-4 h-4 -translate-x-1/2 -translate-y-1/2 z-30",
        className
      )}
      aria-hidden="true"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[11px] h-[11px] text-zinc-500 stroke-current"
      >
        {/* Horizontal 1px line centered at y=5.5 */}
        <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
        {/* Vertical 1px line centered at x=5.5 */}
        <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
      </svg>
    </div>
  )
}

/**
 * Full-width slope-like diagonal hatching pattern divider.
 * Stretches across the full width of the screen with precision crosshairs on the 4 border corners.
 */
export function SlopeDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full h-5 sm:h-6 bg-diagonal-hatch border-y border-zinc-800/90 overflow-visible",
        className
      )}
    >
      {/* Central column intersection crosshairs perfectly aligned with X & Y border coordinates */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto relative h-full pointer-events-none">
        {/* Top-Left Corner */}
        <CrosshairMarker className="top-0 left-0" />
        {/* Bottom-Left Corner */}
        <CrosshairMarker className="top-full left-0" />
        {/* Top-Right Corner */}
        <CrosshairMarker className="top-0 left-full" />
        {/* Bottom-Right Corner */}
        <CrosshairMarker className="top-full left-full" />
      </div>
    </div>
  )
}

/**
 * Signature bright green marker highlight with multi-line box-decoration-break clone support.
 * Wraps seamlessly across lines with independent background pills and thin text.
 */
export function GreenHighlight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline bg-[#1fd38a] text-black font-normal px-1.5 py-0.5 rounded-[4px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] leading-relaxed mx-0.5",
        className
      )}
    >
      {children}
    </span>
  )
}

export function GreenBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#1fd38a]/15 text-[#1fd38a] border border-[#1fd38a]/30 font-normal tracking-tight",
        className
      )}
    >
      {children}
    </span>
  )
}
