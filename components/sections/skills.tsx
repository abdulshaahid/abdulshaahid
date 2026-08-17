"use client"

import React from "react"
import Image from "next/image"
import { GreenHighlight } from "@/components/ui/geometric"

interface SkillItem {
  name: string
  iconUrl: string
}

interface SkillCategory {
  num: string
  title: string
  skills: SkillItem[]
}

const skillsData: SkillCategory[] = [
  {
    num: "01",
    title: "Language",
    skills: [
      { name: "TypeScript", iconUrl: "/skills/typescript.svg" },
      { name: "JavaScript", iconUrl: "/skills/javascript.svg" },
      { name: "Python", iconUrl: "/skills/python.svg" },
      { name: "HTML5", iconUrl: "/skills/html5.svg" },
      { name: "CSS3", iconUrl: "/skills/css.svg" },
      { name: "C", iconUrl: "/skills/C.svg" },
      { name: "C++", iconUrl: "/skills/c-plusplus.svg" },
    ],
  },
  {
    num: "02",
    title: "Frontend",
    skills: [
      { name: "React", iconUrl: "/skills/react.svg" },
      { name: "Next.js", iconUrl: "/skills/nextjs.svg" },
      { name: "Astro", iconUrl: "/skills/astro.svg" },
      { name: "Tailwind CSS", iconUrl: "/skills/tailwind-css.svg" },
      { name: "shadcn/ui", iconUrl: "/skills/shadcn-ui.svg" },
      { name: "PWA", iconUrl: "/skills/pwa.svg" },
      { name: "React Native | Expo", iconUrl: "/skills/expo.svg" },
      { name: "Framer Motion", iconUrl: "/skills/framer.svg" },
      { name: "Three.js", iconUrl: "/skills/threedotjs.svg" },
      { name: "GSAP", iconUrl: "/skills/gsap.svg" },
      { name: "Bootstrap", iconUrl: "/skills/bootstrap.svg" },
    ],
  },
  {
    num: "03",
    title: "Workflow & AI",
    skills: [
      { name: "Antigravity", iconUrl: "/skills/google-antigravity.svg" },
      { name: "Claude", iconUrl: "/skills/claude.svg" },
      { name: "Cursor", iconUrl: "/skills/cursor.svg" },
      { name: "Gemini", iconUrl: "/skills/gemini.svg" },
      { name: "ChatGPT", iconUrl: "/skills/openai-chatgpt.svg" },
      { name: "Copilot", iconUrl: "/skills/github-copilot.svg" },
      { name: "MCP", iconUrl: "/skills/model-context-protocol.svg" },
      { name: "Git", iconUrl: "/skills/git.svg" },
      { name: "GitHub", iconUrl: "/skills/github.svg" },
    ],
  },
  {
    num: "04",
    title: "Tools & APIs",
    skills: [
      { name: "REST APIs", iconUrl: "/skills/gcp-api.svg" },
      { name: "Meta API", iconUrl: "/skills/meta.svg" },
      { name: "Meta Ads", iconUrl: "/skills/meta.svg" },
      { name: "Meta Business Suite", iconUrl: "/skills/meta.svg" },
      { name: "Postman", iconUrl: "/skills/postman.svg" },
      { name: "Vercel", iconUrl: "/skills/vercel.svg" },
      { name: "Vite", iconUrl: "/skills/vite.svg" },
      { name: "VS Code", iconUrl: "/skills/visual-studio-code.svg" },
      { name: "npm / pnpm", iconUrl: "/skills/npm.svg" },
    ],
  },
]

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header Banner */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Technologies powering{" "}
            <GreenHighlight>
              modern web applications & digital experiences
            </GreenHighlight>
          </p>
        </div>

        {/* Horizontal Categorized Rows */}
        <div className="divide-y divide-zinc-800/80">
          {skillsData.map((category) => (
            <div
              key={category.num}
              className="flex flex-col sm:flex-row items-start sm:items-center hover:bg-white/[0.015] transition-colors group/row"
            >
              {/* Left Column: Number + Category Title with dashed vertical divider */}
              <div className="w-full sm:w-[200px] md:w-[230px] lg:w-[260px] shrink-0 px-6 sm:px-8 py-4 sm:py-5 flex items-center gap-3.5 sm:border-r sm:border-dashed border-zinc-800/80 self-stretch">
                <span className="font-mono text-xs sm:text-[13px] text-zinc-500 font-semibold tracking-wider">
                  {category.num}
                </span>
                <h3 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-200 group-hover/row:text-white transition-colors">
                  {category.title}
                </h3>
              </div>

              {/* Right Column: Pill Badges */}
              <div className="flex-1 px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131316] hover:bg-[#18181d] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-150 cursor-default group"
                  >
                    <div className="w-4 h-4 relative shrink-0 flex items-center justify-center">
                      <Image
                        src={skill.iconUrl}
                        alt={skill.name}
                        width={16}
                        height={16}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-[13px] font-mono font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Specs  Bar */}
        <div className="px-6 sm:px-10 lg:px-12 py-4 border-t border-dashed border-zinc-800/90 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-zinc-400">
          <span>* Scalable modular architecture & 60fps interaction standards</span>
          <span className="text-zinc-500">ECOSYSTEM // 2025</span>
        </div>
      </div>
    </section>
  )
}
