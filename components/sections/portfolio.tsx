"use client"

import React from "react"
import Image from "next/image"
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
  videoUrl?: string
  imageUrl?: string
}

const projects: ProjectItem[] = [
  {
    id: "trawayl",
    title: "Trawayl",
    description:
      "Travel package marketplace with custom itinerary discovery and instant booking workflows.",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://trawayl.com",
    imageUrl: "/agent-dashboard-mockup-grayscale.png",
  },
  {
    id: "trawerse",
    title: "Trawerse",
    description:
      "Digital studio website showcasing services, projects, and capabilities.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://trawerse.com/",
    videoUrl: "/projvid/trawerse.mp4",
  },
  {
    id: "flotilla",
    title: "Flotilla",
    description:
      "Sustainability website focused on ESG solutions and business impact.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://www.flotillagroup.com/",
    videoUrl: "/projvid/flotilla.mp4",
  },
  {
    id: "al-najwa",
    title: "Al Najwa",
    description:
      "Premium interior design website focused on projects and visual storytelling.",
    tags: ["React", "Tailwind CSS", "GSAP"],
    videoUrl: "/projvid/alnajwa.mp4",
  },
  {
    id: "taj-al-safa",
    title: "Taj Al Safa",
    description:
      "Luxury real-estate website showcasing properties and developments.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://tajalsafa.com/",
    videoUrl: "/projvid/tajalsafa.mp4",
  },
  {
    id: "kerala-startup-carnival",
    title: "Kerala Startup Carnival",
    description:
      "Startup event website featuring speakers, schedule, experience, and registration.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://keralastartupcarnival.com/",
    videoUrl: "/projvid/ksc.mp4",
  },
  {
    id: "daily-regrets",
    title: "Daily Regrets",
    description:
      "Minimal platform centered around regrets, reflections, and daily reminders.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://dailyregrets.com/",
    videoUrl: "/projvid/dailyregrets.mp4",
  },
  {
    id: "deyno-technologies",
    title: "Deyno Technologies",
    description:
      "Multi-product SaaS ecosystem showcasing ERP solutions across industries.",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
    videoUrl: "/projvid/deyno.mp4",
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Section Header Banner */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Think of{" "}
            <GreenHighlight>
              side-projects and client work as my personal lab
            </GreenHighlight>
          </p>
        </div>

        {/* 2-Column Grid on Desktop with Video on Left & Text on Right in Each Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {projects.map((project, index) => {
            const isLeftCol = index % 2 === 0

            return (
              <article
                key={project.id}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 sm:p-7 hover:bg-white/[0.015] transition-colors duration-150 border-b border-dashed border-zinc-800/90 group ${
                  isLeftCol ? "lg:border-r border-dashed border-zinc-800/90" : ""
                }`}
              >
                {/* Corner Crosshair Markers */}
                <CrosshairMarker className="top-0 left-0" />
                <CrosshairMarker className="top-0 left-full" />
                <CrosshairMarker className="top-full left-0" />
                <CrosshairMarker className="top-full left-full" />

                {/* Left Side: 16:9 Video / Image Preview */}
                <div className="relative aspect-video w-full sm:w-[200px] md:w-[220px] lg:w-[210px] xl:w-[240px] shrink-0 overflow-hidden rounded-xl bg-zinc-950 shadow-lg shadow-black/60 group-hover:shadow-xl group-hover:shadow-black/80 transition-shadow">
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover scale-[1.05] pointer-events-none"
                    />
                  ) : project.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-500 font-mono text-xs">
                      Preview Coming Soon
                    </div>
                  )}
                </div>

                {/* Right Side: Project Details & Action Buttons */}
                <div className="flex-1 flex flex-col justify-between self-stretch min-w-0">
                  <div>
                    {/* Title with Bricolage Grotesque */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bricolage text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#1fd38a] transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 group-hover:text-[#1fd38a] transition-colors sm:hidden"
                          aria-label={`Visit ${project.title}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>

                    {/* Concise Description */}
                    <p className="mt-1.5 text-[13px] sm:text-[13.5px] text-zinc-400 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-2.5 pt-[5px] pb-[4px] text-[11px] font-mono text-zinc-300 leading-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-1 flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium text-zinc-200 bg-[#141418] hover:bg-zinc-800 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        <Github size={12} className="shrink-0" />
                        <span className="translate-y-[1px] leading-none">GitHub</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium text-black bg-[#1fd38a] hover:bg-[#18c27e] transition-all shadow-sm"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="translate-y-[1px] leading-none">Visit</span>
                      </a>
                    )}
                  </div>
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

