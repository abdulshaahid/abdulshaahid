"use client"

import React from "react"
import { ArrowUpRight } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"

interface Collaborator {
  name: string
  handle: string
  avatar: string
  text: string
}

const collaborators: Collaborator[] = [
  {
    name: "Afsal K",
    handle: "@afsalk",
    avatar: "A",
    text: "Sharp eye for visual polish. Translates design to clean, performant frontend code with speed.",
  },
  {
    name: "Midhlaj P",
    handle: "@midhlaj",
    avatar: "M",
    text: "Exceptional frontend execution on Trawayl. Clean component hierarchy and great responsiveness.",
  },
  {
    name: "Rinshad V",
    handle: "@rinshad",
    avatar: "R",
    text: "Always thinking in reusable systems and micro-interactions. A pleasure to collaborate with.",
  },
]

export function Guestbook() {
  return (
    <section id="guestbook" className="relative scroll-mt-24 w-full">
      {/* Central Column */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1140px] xl:max-w-[1200px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Header */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Words from friends and <GreenHighlight>collaborators</GreenHighlight> who know me best.
          </p>
        </div>

        {/* 3 Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/90">
          {collaborators.map((c) => (
            <div
              key={c.name}
              className="relative p-6 sm:p-7 hover:bg-white/[0.015] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-mono font-semibold text-zinc-100 shrink-0">
                    {c.avatar}
                  </div>
                  <div>
                    <h4 className="font-bricolage text-sm font-semibold text-zinc-100 leading-tight">
                      {c.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {c.handle}
                    </span>
                  </div>
                </div>

                <p className="text-[13px] sm:text-[14px] text-zinc-300/90 leading-relaxed italic">
                  "{c.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="p-5 sm:p-6 flex justify-center border-t border-zinc-800/90">
          <a
            href="https://www.linkedin.com/in/mohamedabdulshahid/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-[4px] transition-all"
          >
            <span>Sign the guestbook</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
