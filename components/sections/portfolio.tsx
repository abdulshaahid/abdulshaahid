"use client"

import React from "react"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import { CrosshairMarker, GreenHighlight } from "@/components/ui/geometric"
import { GithubGraph } from "@/components/ui/github-graph"

interface ProjectItem {
  id: string
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
}

const projects: ProjectItem[] = [
  {
    id: "trawayl",
    title: "Trawayl",
    description:
      "Travel package marketplace with custom itinerary discovery and instant booking workflows.",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://trawayl.com",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "trawayl-agent",
    title: "Trawayl Agent Portal",
    description:
      "Operations dashboard for agencies to manage live inventory, bookings, and inquiries.",
    tags: ["React", "Tailwind CSS", "REST APIs", "Analytics"],
    liveUrl: "https://trawayl.com",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "portfolio-os",
    title: "Portfolio OS",
    description:
      "Minimal developer portfolio with a strict geometric grid and 60fps micro-interactions.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer"],
    liveUrl: "https://github.com/abdulshaahid",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "monochrome-lens",
    title: "Monochrome Lens UI",
    description:
      "Interactive image magnification component with cursor-tracking and hardware zoom.",
    tags: ["React", "UI/UX", "CSS Transforms", "Figma"],
    liveUrl: "https://github.com/abdulshaahid",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "evervault-card",
    title: "Evervault Shield Card",
    description:
      "Dynamic cryptographic character-scrambling card with cursor-proximity illumination.",
    tags: ["TypeScript", "Canvas API", "Tailwind CSS"],
    liveUrl: "https://github.com/abdulshaahid",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "sorting-visualizer",
    title: "Canvas & WebGL UI",
    description:
      "High-performance interactive graphical shaders with fluid noise and hardware compositing.",
    tags: ["WebGL", "OGL", "GLSL", "React"],
    liveUrl: "https://github.com/abdulshaahid",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "design-system",
    title: "Design System Kit",
    description:
      "Token-driven accessible UI primitives with strict typographic scale and keyboard flows.",
    tags: ["React", "Radix UI", "Tailwind CSS", "Figma"],
    liveUrl: "https://github.com/abdulshaahid",
    githubUrl: "https://github.com/abdulshaahid",
  },
  {
    id: "travel-api-service",
    title: "Package Filter Engine",
    description:
      "Client-side multi-parameter filter engine with stateful URL sync and instant debouncing.",
    tags: ["Next.js", "TypeScript", "Zod", "React Hook Form"],
    liveUrl: "https://trawayl.com",
    githubUrl: "https://github.com/abdulshaahid",
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Section Header Banner */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Think of{" "}
            <GreenHighlight>
              side-projects and open source as my personal lab
            </GreenHighlight>
          </p>
        </div>

        {/* 2-Column Grid of 8 Project Cells */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {projects.map((project, index) => {
            const isLeftCol = index % 2 === 0

            return (
              <article
                key={project.id}
                className={`relative flex flex-col justify-between p-6 sm:p-8 hover:bg-white/[0.015] transition-colors duration-150 border-b border-zinc-800/90 group ${
                  isLeftCol ? "md:border-r border-zinc-800/90" : ""
                }`}
              >
                <div>
                  {/* Title with Bricolage Grotesque */}
                  <h3 className="font-bricolage text-lg sm:text-xl lg:text-[22px] font-bold text-white group-hover:text-[#1fd38a] transition-colors tracking-tight">
                    {project.title}
                  </h3>

                  {/* Concise Description with Increased Font Size */}
                  <p className="mt-2.5 text-[13.5px] sm:text-[14.5px] text-zinc-400 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-900/90 border border-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-3 flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] text-xs font-mono font-medium text-zinc-200 bg-[#141418] hover:bg-zinc-800 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <Github size={13} />
                      <span>GitHub</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] text-xs font-mono font-medium text-zinc-200 bg-[#141418] hover:bg-zinc-800 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Visit</span>
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* GitHub Activity Heatmap Graph */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90">
          <GithubGraph />
        </div>

        {/* Closing Statement */}
        <div className="p-8 sm:p-10 text-center">
          <p className="font-bricolage text-sm sm:text-base text-zinc-200 max-w-xl mx-auto leading-relaxed">
            I also contribute to{" "}
            <GreenHighlight>
              open-source tools & utilities
            </GreenHighlight>{" "}
            regularly on GitHub.
          </p>

          <div className="mt-4">
            <a
              href="https://github.com/abdulshaahid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium text-black bg-zinc-200 hover:bg-white transition-all shadow-sm group"
            >
              <Github size={13} className="text-black" />
              <span>Explore on GitHub</span>
              <ArrowUpRight size={12} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
