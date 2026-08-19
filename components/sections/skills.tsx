"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { GreenHighlight } from "@/components/ui/geometric"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

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

function SkillBadge({ skill }: { skill: SkillItem }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131316] hover:bg-[#18181d] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-150 cursor-default shrink-0 group select-none">
      <div className="w-4 h-4 relative shrink-0 flex items-center justify-center">
        <img
          src={skill.iconUrl}
          alt={skill.name}
          width={16}
          height={16}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xs sm:text-[13px] font-mono font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90"
        >
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Technologies powering{" "}
            <GreenHighlight delay={0.15}>
              modern web applications & digital experiences
            </GreenHighlight>
          </p>
        </motion.div>

        {/* Horizontal Categorized Rows with subtle stagger */}
        <div className="divide-y divide-zinc-800/80">
          {skillsData.map((category, categoryIndex) => {
            const mid = Math.ceil(category.skills.length / 2)
            const row1Skills = category.skills.slice(0, mid)
            const row2Skills = category.skills.slice(mid)

            return (
              <motion.div
                key={category.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{
                  duration: 0.48,
                  ease: SMOOTH_EASE,
                  delay: 0.05 + categoryIndex * 0.06,
                }}
                className="flex flex-col sm:flex-row items-start sm:items-center hover:bg-white/[0.015] transition-colors group/row overflow-hidden"
              >
                {/* Left Column: Number + Category Title with dashed vertical divider */}
                <div className="w-full sm:w-[200px] md:w-[230px] lg:w-[260px] shrink-0 px-6 sm:px-8 py-3.5 sm:py-5 flex items-center gap-3.5 sm:border-r sm:border-dashed border-zinc-800/80 self-stretch bg-[#09090b] z-10">
                  <span className="font-mono text-xs sm:text-[13px] text-zinc-500 font-semibold tracking-wider">
                    {category.num}
                  </span>
                  <h3 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-200 group-hover/row:text-white transition-colors">
                    {category.title}
                  </h3>
                </div>

                {/* Desktop View: Single Continuous Rolling Marquee */}
                <div className="hidden sm:block flex-1 w-full overflow-hidden py-4 sm:py-5 relative min-w-0 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
                  <div
                    className={`flex items-center gap-2 sm:gap-2.5 ${
                      categoryIndex % 2 === 0
                        ? "animate-skills-left"
                        : "animate-skills-right"
                    }`}
                    style={{
                      animationDuration: `${55 + categoryIndex * 4}s`,
                    }}
                  >
                    {[...Array(2)].flatMap((_, setIndex) =>
                      category.skills.map((skill, skillIndex) => (
                        <SkillBadge
                          key={`desk-${category.num}-${setIndex}-${skill.name}-${skillIndex}`}
                          skill={skill}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Mobile View: 2 Rolling Rows in each section */}
                <div className="sm:hidden flex-1 w-full overflow-hidden py-3 space-y-2 relative min-w-0 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
                  {/* Mobile Row 1 */}
                  <div
                    className="flex items-center gap-2 animate-skills-left"
                    style={{
                      animationDuration: `${42 + categoryIndex * 3}s`,
                    }}
                  >
                    {[...Array(2)].flatMap((_, setIndex) =>
                      row1Skills.map((skill, skillIndex) => (
                        <SkillBadge
                          key={`mob1-${category.num}-${setIndex}-${skill.name}-${skillIndex}`}
                          skill={skill}
                        />
                      ))
                    )}
                  </div>

                  {/* Mobile Row 2 */}
                  <div
                    className="flex items-center gap-2 animate-skills-right"
                    style={{
                      animationDuration: `${46 + categoryIndex * 3}s`,
                    }}
                  >
                    {[...Array(2)].flatMap((_, setIndex) =>
                      row2Skills.map((skill, skillIndex) => (
                        <SkillBadge
                          key={`mob2-${category.num}-${setIndex}-${skill.name}-${skillIndex}`}
                          skill={skill}
                        />
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Specs Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.45, ease: SMOOTH_EASE, delay: 0.1 }}
          className="px-6 sm:px-10 lg:px-12 py-4 border-t border-dashed border-zinc-800/90 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-zinc-400"
        >
          <span>* Scalable modular architecture & ultra-smooth interaction standards</span>
          <span className="text-zinc-500">ECOSYSTEM // 2025</span>
        </motion.div>
      </div>
    </section>
  )
}

