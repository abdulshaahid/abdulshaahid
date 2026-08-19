"use client"

import React, { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import { CrosshairMarker, GreenHighlight } from "@/components/ui/geometric"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

interface ProjectItem {
  id: string
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  videoUrl?: string
  imageUrl?: string
  logoUrl?: string
}

function ProjectVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // 1. Viewport pre-loader: start loading when approaching within 600px
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 2. Playback controller: play when visible, pause when offscreen
  useEffect(() => {
    if (!shouldLoad) return
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    const playVideo = () => {
      if (video.paused) {
        const promise = video.play()
        if (promise !== undefined) {
          promise.catch(() => {})
        }
      }
    }

    playVideo()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") playVideo()
    }
    const handleFocus = () => playVideo()
    const handlePageShow = () => playVideo()

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("pageshow", handlePageShow)

    let observer: IntersectionObserver | null = null
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              playVideo()
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.1 }
      )
      observer.observe(video)
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("pageshow", handlePageShow)
      if (observer) observer.disconnect()
    }
  }, [shouldLoad, src])

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className="w-full h-full object-cover scale-[1.05] pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-zinc-950" />
      )}
    </div>
  )
}

const projects: ProjectItem[] = [
  {
    id: "trawayl",
    title: "Trawayl",
    description:
      "Travel package marketplace with custom itinerary discovery and instant booking workflows.",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://trawayl.com",
    imageUrl: "/projvid/trawayl.png",
    logoUrl: "/projlogo/trawayl.png",
  },
  {
    id: "trawerse",
    title: "Trawerse",
    description:
      "Digital studio website showcasing services, projects, and capabilities.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://trawerse.com/",
    videoUrl: "/projvid/trawerse.mp4",
    logoUrl: "/projlogo/trawerse.ico",
  },
  {
    id: "deyno-technologies",
    title: "Deyno Technologies",
    description:
      "Multi-product SaaS ecosystem showcasing ERP solutions across industries.",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
    videoUrl: "/projvid/deyno.mp4",
    logoUrl: "/projlogo/deyno.ico",
  },
  {
    id: "kerala-startup-carnival",
    title: "Kerala Startup Carnival",
    description:
      "Startup event website featuring speakers, schedule, experience, and registration.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://keralastartupcarnival.com/",
    videoUrl: "/projvid/ksc.mp4",
    logoUrl: "/projlogo/keralastartup.ico",
  },
  {
    id: "flotilla",
    title: "Flotilla",
    description:
      "Sustainability website focused on ESG solutions and business impact.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://www.flotillagroup.com/",
    videoUrl: "/projvid/flotilla.mp4",
    logoUrl: "/projlogo/flotilla.svg",
  },
  {
    id: "al-najwa",
    title: "Al Najwa",
    description:
      "Premium interior design website focused on projects and visual storytelling.",
    tags: ["React", "Tailwind CSS", "GSAP"],
    liveUrl: "https://www.alnajwagold.com/",
    videoUrl: "/projvid/alnajwa.mp4",
    logoUrl: "/projlogo/alnlogo.png",
  },
  {
    id: "daily-regrets",
    title: "Daily Regrets",
    description:
      "Minimal platform centered around regrets, reflections, and daily reminders.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://dailyregrets.com/",
    videoUrl: "/projvid/dailyregrets.mp4",
    logoUrl: "/projlogo/dailyregrets.ico",
  },
  {
    id: "cliper-click",
    title: "Cliper.click",
    description:
      "Cross-platform file and clipboard sharing platform for seamless device-to-device transfers.",
    tags: ["Django", "React", "Tailwind CSS", "PostgreSQL", "Docker"],
    liveUrl: "https://cliper.click/",
    imageUrl: "/projvid/cliper.png",
    logoUrl: "/projlogo/cliper.ico",
  },
  {
    id: "fortura-global-exim",
    title: "Fortura Global Exim",
    description:
      "Premium B2B landing page for a gym equipment importing and distribution company.",
    tags: ["Astro", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://forturaglobalexim.com/",
    videoUrl: "/projvid/fortura.mp4",
    logoUrl: "/projlogo/fortura.jpeg",
  },
  {
    id: "taj-al-safa",
    title: "Taj Al Safa",
    description:
      "Luxury real-estate website showcasing properties and developments.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://tajalsafa.com/",
    videoUrl: "/projvid/tajalsafa.mp4",
    logoUrl: "/projlogo/tajlogo.png",
  },
  {
    id: "receiptlog",
    title: "ReceiptLog",
    description:
      "AI-powered personal finance app for receipt scanning, expense tracking, and income management.",
    tags: ["React Native", "Expo", "TypeScript", "SQLite", "AI"],
    imageUrl: "/receiptlog-mockup.jpg",
    logoUrl: "/projlogo/receiptlog.svg",
  },
  {
    id: "tradeease",
    title: "TradeEase",
    description:
      "Modern stock and inventory management platform for tracking products, operations, and business analytics.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    imageUrl: "/tradeease-mockup.jpg",
    logoUrl: "/projlogo/tradeease.svg",
  },
]

const stackIcons: Record<string, string> = {
  React: "/skills/react.svg",
  "React Native": "/skills/react.svg",
  "Next.js": "/skills/nextjs.svg",
  "Tailwind CSS": "/skills/tailwind-css.svg",
  TypeScript: "/skills/typescript.svg",
  "Framer Motion": "/skills/framer.svg",
  GSAP: "/skills/gsap.svg",
  Astro: "/skills/astro.svg",
  Expo: "/skills/expo.svg",
  SQLite: "/skills/sqlite.svg",
  AI: "/skills/ai.svg",
  Django: "/skills/django.svg",
  PostgreSQL: "/skills/postgresql.svg",
  Docker: "/skills/docker.svg",
}

export function Portfolio() {
  return (
    <section id="portfolio" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Section Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90"
        >
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Think of{" "}
            <GreenHighlight delay={0.15}>
              side-projects and client work as my personal lab
            </GreenHighlight>
          </p>
        </motion.div>

        {/* Grid: 1 Column on Mobile, iPad, and iPad Pro (< xl), 2 Columns on Desktop (xl+) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 relative">
          {projects.map((project, index) => {
            const isLeftCol = index % 2 === 0

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_CONFIG}
                transition={{
                  duration: 0.5,
                  ease: SMOOTH_EASE,
                  delay: (index % 2) * 0.08,
                }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 sm:p-7 md:p-8 hover:bg-white/[0.015] transition-colors duration-150 border-b border-dashed border-zinc-800/90 group ${
                  isLeftCol ? "xl:border-r border-dashed border-zinc-800/90" : ""
                }`}
              >
                {/* Crosshair Markers: Render top-left (hidden on xl for right column to avoid duplicate center marker) and top-right */}
                <CrosshairMarker className={`top-0 left-0 ${!isLeftCol ? "xl:hidden" : ""}`} />
                <CrosshairMarker className="top-0 left-full" />

                {/* Left Side: 16:9 Video / Image Preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT_CONFIG}
                  transition={{ duration: 0.52, ease: SMOOTH_EASE }}
                  className="relative aspect-video w-full sm:w-[220px] md:w-[250px] lg:w-[280px] xl:w-[240px] shrink-0 overflow-hidden rounded-xl bg-zinc-950 shadow-lg shadow-black/60 group-hover:shadow-xl group-hover:shadow-black/80 transition-shadow"
                >
                  {project.videoUrl ? (
                    <ProjectVideo src={project.videoUrl} />
                  ) : project.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-500 font-mono text-xs">
                      Preview Coming Soon
                    </div>
                  )}
                </motion.div>

                {/* Right Side: Project Details & Action Buttons */}
                <div className="flex-1 flex flex-col justify-between self-stretch min-w-0">
                  <div>
                    {/* Title with Bricolage Grotesque */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {project.logoUrl && (
                          <div className="w-6 h-6 sm:w-[26px] sm:h-[26px] relative shrink-0 flex items-center justify-center">
                            <Image
                              src={project.logoUrl}
                              alt={`${project.title} logo`}
                              width={26}
                              height={26}
                              className="w-full h-full rounded-[6px] object-contain"
                            />
                          </div>
                        )}
                        <h3 className="font-bricolage text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#1fd38a] transition-colors tracking-tight">
                          {project.title}
                        </h3>
                      </div>
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

                    {/* Tech Pills with Stack Logos */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => {
                        const iconUrl = stackIcons[tag]
                        return (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 text-[11px] font-mono text-zinc-300 leading-none hover:border-zinc-700 transition-colors"
                          >
                            {iconUrl && (
                              <img
                                src={iconUrl}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="w-3 h-3 object-contain shrink-0"
                              />
                            )}
                            <span className="translate-y-[0.5px]">{tag}</span>
                          </span>
                        )
                      })}
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
              </motion.article>
            )
          })}

          {/* Bottom center intersection crosshair for desktop 2-column divider */}
          <CrosshairMarker className="hidden xl:flex top-full left-1/2" />
        </div>
      </div>
    </section>
  )
}
