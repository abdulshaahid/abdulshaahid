"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { CrosshairMarker, GreenHighlight } from "@/components/ui/geometric"
import { Lightbulb, BookOpen, ChevronsUpDown, Globe } from "lucide-react"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

const principles = [
  {
    title: "Design Directly in Code",
    description:
      "I bridge design and engineering by conceptualizing UI directly in React and CSS — crafting micro-interactions, responsive typography, and design systems natively.",
  },
  {
    title: "Think in Systems, Not Screens",
    description:
      "Components should work together as a structured whole. Scalable design tokens, predictable state management, and reusable UI patterns eliminate technical debt.",
  },
  {
    title: "If It's Repetitive, Automate It",
    description:
      "Manual work is a signal to optimize. Whether building CLI utilities, automated workflows, or leveraging modern AI tooling — I'd rather build it once than repeat it twice.",
  },
  {
    title: "Simple on the Surface",
    description:
      "Good software feels effortless. Complexity stays under the hood with 60fps compositor animations, accessible semantics, and sub-second load times.",
  },
]

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-t border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Top-Left and Top-Right start crosshairs */}
        <CrosshairMarker className="top-0 left-0" />
        <CrosshairMarker className="top-0 left-full" />

        {/* Intro Statement */}
        <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_CONFIG}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          >
            <h2 className="font-bricolage text-base sm:text-xl lg:text-2xl font-normal text-zinc-100 leading-snug max-w-2xl text-pretty">
              I design and build interfaces with{" "}
              <GreenHighlight delay={0.15}>
                clean code, fluid motion, and scalable systems
              </GreenHighlight>{" "}
              — making interfaces feel effortless.
            </h2>
          </motion.div>

          {/* 4 Philosophy Blocks (2x2 Grid) with subtle stagger */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            {principles.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.45, ease: SMOOTH_EASE, delay: 0.06 + idx * 0.05 }}
                className="space-y-2.5"
              >
                <h3 className="font-bricolage text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[13.5px] sm:text-[14.5px] text-zinc-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Experience & Education Section */}
          <div className="mt-14 pt-10 border-t border-zinc-800/90 space-y-12">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_CONFIG}
              transition={{ duration: 0.45, ease: SMOOTH_EASE }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-bricolage text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-100">
                  Experience & Education
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">TIMELINE // CAREER</span>
            </motion.div>

            {/* Timeline Cards Container */}
            <div className="space-y-12">
              {/* 1. Experience: Trawayl */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.48, ease: SMOOTH_EASE, delay: 0.04 }}
                className="space-y-4"
              >
                {/* Company Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <Image
                      src="/trawayl.png"
                      alt="Trawayl logo"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bricolage text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                      Trawayl
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="leading-none">Kerala, India (Remote)</span>
                    </div>
                  </div>
                </div>

                {/* Nested Roles with Tree Connector */}
                <div className="relative pt-1">
                  <div className="space-y-7">
                    {/* Role 1: Design Engineer & Frontend Lead */}
                    <div className="relative flex items-start gap-3.5 group">
                      {/* Fluid vertical line linking Role 1 dynamically down into Role 2 on ALL screen sizes */}
                      <div className="absolute left-[11px] top-6 -bottom-7 w-px bg-zinc-800 pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-md bg-[#121216] border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 shrink-0 transition-colors">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 shrink-0"
                        >
                          <polyline points="7 8 3 12 7 16" />
                          <line x1="14" y1="4" x2="10" y2="20" />
                          <polyline points="17 8 21 12 17 16" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 min-h-6">
                          <h5 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-none my-auto">
                            Design Engineer & Frontend Lead
                          </h5>
                          <ChevronsUpDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-light mt-1.5 flex-wrap leading-none">
                          <span className="leading-none">Full-time</span>
                          <span className="text-zinc-600 font-normal leading-none">|</span>
                          <span className="leading-none">03.2024 — ∞</span>
                          <span className="text-zinc-600 font-normal leading-none">|</span>
                          <span className="leading-none">1y 6m</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {[
                            "Next.js",
                            "React",
                            "TypeScript",
                            "Tailwind CSS",
                            "Interface Design",
                            "UI/UX Design",
                            "UX Writing",
                            "Design System",
                            "Brand Design",
                            "Performance",
                          ].map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center justify-center rounded-full bg-[#161616] hover:bg-zinc-800/90 border border-white/[0.06] hover:border-white/15 px-2.5 pt-[4.5px] pb-[3.5px] text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-default leading-none"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Role 2: Founder with Curved Track Line */}
                    <div className="relative flex items-start gap-3.5 group">
                      {/* Fluid curved track line bending 90 degrees horizontally into the last row of tags */}
                      <div className="absolute left-[11px] top-6 bottom-[14px] w-[18px] border-l border-b border-zinc-800 rounded-bl-[8px] pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-md bg-[#121216] border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 shrink-0 transition-colors">
                        <Lightbulb size={12} className="shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 min-h-6">
                          <h5 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-none my-auto">
                            Founder
                          </h5>
                          <ChevronsUpDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-light mt-1.5 flex-wrap leading-none">
                          <span className="leading-none">Part-time</span>
                          <span className="text-zinc-600 font-normal leading-none">|</span>
                          <span className="leading-none">03.2024 — ∞</span>
                          <span className="text-zinc-600 font-normal leading-none">|</span>
                          <span className="leading-none">1y 6m</span>
                        </div>
                        <div className="mt-3.5 pl-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {[
                            "Product Strategy",
                            "UX Architecture",
                            "Business Ownership",
                            "Frontend Architecture",
                          ].map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center justify-center rounded-full bg-[#161616] hover:bg-zinc-800/90 border border-white/[0.06] hover:border-white/15 px-2.5 pt-[4.5px] pb-[3.5px] text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-default leading-none"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2. Experience: Freelance */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.48, ease: SMOOTH_EASE, delay: 0.08 }}
                className="space-y-4 pt-2"
              >
                {/* Company / Client Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <Globe size={20} className="text-[#38bdf8] shrink-0 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bricolage text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                      Freelance
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="leading-none">Remote</span>
                    </div>
                  </div>
                </div>

                {/* Nested Role with Tree Connector */}
                <div className="relative pt-1">
                  <div className="relative flex items-start gap-3.5 group">
                    {/* Fluid curved track line bending 90 degrees horizontally into the last row of tags */}
                    <div className="absolute left-[11px] top-6 bottom-[14px] w-[18px] border-l border-b border-zinc-800 rounded-bl-[8px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-md bg-[#121216] border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 shrink-0 transition-colors">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 shrink-0"
                      >
                        <polyline points="7 8 3 12 7 16" />
                        <line x1="14" y1="4" x2="10" y2="20" />
                        <polyline points="17 8 21 12 17 16" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 min-h-6">
                        <h5 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-none my-auto">
                          Frontend Engineer
                        </h5>
                        <ChevronsUpDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-light mt-1.5 flex-wrap leading-none">
                        <span className="leading-none">Freelance</span>
                        <span className="text-zinc-600 font-normal leading-none">|</span>
                        <span className="leading-none">2025 — Present</span>
                      </div>
                      <div className="mt-3.5 pl-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {[
                          "Next.js",
                          "React",
                          "TypeScript",
                          "Tailwind CSS",
                          "Landing Pages",
                          "UI/UX Design",
                          "Responsive Design",
                          "SEO",
                          "Performance",
                          "Accessibility",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center justify-center rounded-full bg-[#161616] hover:bg-zinc-800/90 border border-white/[0.06] hover:border-white/15 px-2.5 pt-[4.5px] pb-[3.5px] text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-default leading-none"
                          >
                            <span className="leading-none">{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3. Experience: Luminar Technolab */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.48, ease: SMOOTH_EASE, delay: 0.12 }}
                className="space-y-4 pt-2"
              >
                {/* Company Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <Image
                      src="/luminar.png"
                      alt="Luminar Technolab logo"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bricolage text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                      Luminar Technolab
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="leading-none">Kochi, India</span>
                    </div>
                  </div>
                </div>

                {/* Nested Role with Tree Connector */}
                <div className="relative pt-1">
                  <div className="relative flex items-start gap-3.5 group">
                    {/* Fluid curved track line bending 90 degrees horizontally into the last row of tags */}
                    <div className="absolute left-[11px] top-6 bottom-[14px] w-[18px] border-l border-b border-zinc-800 rounded-bl-[8px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-md bg-[#121216] border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 shrink-0 transition-colors">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 shrink-0"
                      >
                        <polyline points="7 8 3 12 7 16" />
                        <line x1="14" y1="4" x2="10" y2="20" />
                        <polyline points="17 8 21 12 17 16" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 min-h-6">
                        <h5 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-none my-auto">
                          MERN Stack Developer Intern
                        </h5>
                        <ChevronsUpDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-light mt-1.5 flex-wrap leading-none">
                        <span className="leading-none">Internship</span>
                        <span className="text-zinc-600 font-normal leading-none">|</span>
                        <span className="leading-none">06.2024 — 01.2025</span>
                        <span className="text-zinc-600 font-normal leading-none">|</span>
                        <span className="leading-none">8 mos</span>
                      </div>
                      <div className="mt-3.5 pl-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {[
                          "MongoDB",
                          "Express.js",
                          "React",
                          "Node.js",
                          "Tailwind CSS",
                          "REST API",
                          "Git",
                          "HTML5",
                          "CSS3",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center justify-center rounded-full bg-[#161616] hover:bg-zinc-800/90 border border-white/[0.06] hover:border-white/15 px-2.5 pt-[4.5px] pb-[3.5px] text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-default leading-none"
                          >
                            <span className="leading-none">{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4. Education: MEA Engineering College */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{ duration: 0.48, ease: SMOOTH_EASE, delay: 0.16 }}
                className="space-y-4 pt-2"
              >
                {/* Institution Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <Image
                      src="/mea.ico"
                      alt="MEA Engineering College crest"
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bricolage text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                      MEA Engineering College
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="leading-none">Kerala, India</span>
                    </div>
                  </div>
                </div>

                {/* Nested Degree with Curved Tree Node */}
                <div className="relative pt-1">
                  <div className="relative flex items-start gap-3.5 group">
                    {/* Fluid curved track line bending 90 degrees horizontally into the last row of tags */}
                    <div className="absolute left-[11px] top-6 bottom-[14px] w-[18px] border-l border-b border-zinc-800 rounded-bl-[8px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-md bg-[#121216] border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700 shrink-0 transition-colors">
                      <BookOpen size={12} className="shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 min-h-6">
                        <h5 className="font-bricolage text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors leading-none my-auto">
                          B.Tech in Computer Science & Engineering
                        </h5>
                        <ChevronsUpDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-light mt-1.5 flex-wrap leading-none">
                        <span className="leading-none">Undergraduate</span>
                        <span className="text-zinc-600 font-normal leading-none">|</span>
                        <span className="leading-none">2020 — 2024</span>
                        <span className="text-zinc-600 font-normal leading-none">|</span>
                        <span className="leading-none">4 yrs</span>
                      </div>
                      <div className="mt-3.5 pl-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {[
                          "Computer Science",
                          "Data Structures",
                          "Algorithms",
                          "Web Technologies",
                          "Database Management",
                          "Software Engineering",
                        ].map((course) => (
                          <span
                            key={course}
                            className="inline-flex items-center justify-center rounded-full bg-[#161616] hover:bg-zinc-800/90 border border-white/[0.06] hover:border-white/15 px-2.5 pt-[4.5px] pb-[3.5px] text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-default leading-none"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

