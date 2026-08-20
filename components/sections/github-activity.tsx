"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Github } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"
import { GithubGraph } from "@/components/ui/github-graph"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

export function GithubActivity() {
  return (
    <section id="github" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* GitHub Activity Heatmap Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90 relative"
        >
          <GithubGraph />
        </motion.div>

        {/* Closing Statement / Open-source Under Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.5, ease: SMOOTH_EASE, delay: 0.08 }}
          className="p-8 sm:p-10 text-center relative"
        >
          <h2 className="font-bricolage text-sm sm:text-base text-zinc-200 max-w-xl mx-auto leading-relaxed font-normal">
            I also contribute to{" "}
            <GreenHighlight delay={0.15}>
              open-source tools & utilities
            </GreenHighlight>{" "}
            regularly on GitHub.
          </h2>

          <div className="mt-4 flex justify-center">
            <a
              href="https://github.com/abdulshaahid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs font-mono font-medium text-black bg-zinc-200 hover:bg-white transition-all shadow-sm group"
            >
              <Github size={13} className="text-black shrink-0" />
              <span className="leading-none translate-y-[0.75px]">Explore on GitHub</span>
              <ArrowUpRight size={12} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

