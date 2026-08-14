"use client"

import React from "react"
import { CrosshairMarker, GreenHighlight } from "@/components/ui/geometric"
import { Briefcase, GraduationCap } from "lucide-react"

const principles = [
  {
    title: "If It's Repetitive, Automate It",
    description:
      "Manual work is a signal. Whether a CLI tool or a script — I'd rather build it once than repeat it twice.",
  },
  {
    title: "Clarity Beats Cleverness",
    description:
      "Readable code and predictable behavior matter most. Simple implementations always outlast clever hacks.",
  },
  {
    title: "Think in Systems, Not Screens",
    description:
      "Components should work together as a structured whole. State, tokens, and UI patterns scale without fragility.",
  },
  {
    title: "Simple on the Surface",
    description:
      "Good software feels effortless. Complexity can exist under the hood — it shouldn't leak into the interface.",
  },
]

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1140px] xl:max-w-[1200px] mx-auto border-t border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Top-Left and Top-Right start crosshairs */}
        <CrosshairMarker className="top-0 left-0" />
        <CrosshairMarker className="top-0 left-full" />

        {/* Intro Statement */}
        <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-14">
          <h2 className="font-bricolage text-base sm:text-xl lg:text-2xl font-normal text-zinc-100 leading-snug max-w-3xl text-pretty">
            I build with{" "}
            <GreenHighlight>
              clarity, structure, and a bias toward automation
            </GreenHighlight>{" "}
            — because software should feel simple, even when the logic behind it isn't.
          </h2>

          {/* 4 Philosophy Blocks (2x2 Grid) with Bricolage Grotesque */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {principles.map((item) => (
              <div key={item.title} className="space-y-2.5">
                <h3 className="font-bricolage text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[13.5px] sm:text-[14.5px] text-zinc-300/90 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Credentials Strip */}
          <div className="mt-12 pt-8 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[#1fd38a] shrink-0 mt-0.5">
                <Briefcase size={15} />
              </div>
              <div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Founder & Frontend Lead
                </div>
                <div className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 mt-0.5">
                  Trawayl • 2024 – Present
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[#1fd38a] shrink-0 mt-0.5">
                <GraduationCap size={15} />
              </div>
              <div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Education
                </div>
                <div className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 mt-0.5">
                  B.Tech in Computer Science — KTU (2024)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
