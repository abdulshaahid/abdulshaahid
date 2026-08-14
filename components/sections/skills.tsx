"use client"

import React from "react"
import { GreenHighlight } from "@/components/ui/geometric"

interface TechCategory {
  title: string
  items: {
    name: string
    role: string
    core?: boolean
  }[]
}

const stackGroups: TechCategory[] = [
  {
    title: "Frontend Core",
    items: [
      { name: "React.js", role: "Component architecture & hooks", core: true },
      { name: "Next.js", role: "App Router, SSR, Turbopack", core: true },
      { name: "TypeScript", role: "Type safety & scalable interfaces", core: true },
      { name: "Tailwind CSS", role: "Utility tokens & design systems", core: true },
      { name: "JavaScript (ES6+)", role: "Modern async features" },
      { name: "HTML5 & CSS3", role: "Semantic layout specs" },
    ],
  },
  {
    title: "Design & UX",
    items: [
      { name: "UI/UX Design", role: "User journeys & wireframes", core: true },
      { name: "Figma", role: "Prototyping & component kits", core: true },
      { name: "Framer Motion", role: "GPU micro-animations" },
      { name: "Design Tokens", role: "Harmonious scales & palettes" },
      { name: "Radix UI", role: "Accessible headless primitives" },
      { name: "Responsive Design", role: "Multi-device layouts" },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { name: "Git & GitHub", role: "Version control & workflows", core: true },
      { name: "Vercel", role: "Edge deployment & CI/CD" },
      { name: "REST APIs", role: "Data fetching & integration" },
      { name: "Node.js", role: "Tooling & serverless backends" },
      { name: "Web Performance", role: "Lighthouse & 60fps execution" },
      { name: "AWS Cloud", role: "Storage & cloud infrastructure" },
    ],
  },
]

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Technologies powering{" "}
            <GreenHighlight>
              modern web applications & digital experiences
            </GreenHighlight>
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/90">
          {stackGroups.map((group) => (
            <div
              key={group.title}
              className="relative p-6 sm:p-8 hover:bg-white/[0.015] transition-colors"
            >
              <div className="flex items-center gap-2 pb-3.5 mb-5 border-b border-zinc-800/60">
                <span className="w-2 h-2 rounded-full bg-[#1fd38a]" />
                <h3 className="font-bricolage text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100">
                  {group.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.name} className="group/item">
                    <div className="flex items-center justify-between text-[13.5px] sm:text-[14.5px]">
                      <span className="font-medium text-zinc-200 group-hover/item:text-[#1fd38a] transition-colors">
                        {item.name}
                      </span>
                      {item.core && (
                        <span className="text-[10px] font-mono font-semibold text-black bg-[#1fd38a]  px-1.5 py-0.5 rounded-full">
                          CORE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5 leading-snug">
                      {item.role}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom specs bar */}
        <div className="px-6 sm:px-10 lg:px-12 py-4 border-t border-zinc-800/90 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-zinc-400">
          <span>* Scalable modular architecture & 60fps interaction standards</span>
          <span className="text-zinc-500">ECOSYSTEM // 2025</span>
        </div>
      </div>
    </section>
  )
}
