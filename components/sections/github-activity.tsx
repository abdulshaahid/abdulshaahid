"use client"

import React from "react"
import { ArrowUpRight, Github } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"
import { GithubGraph } from "@/components/ui/github-graph"

export function GithubActivity() {
  return (
    <section id="github" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* GitHub Activity Heatmap Graph */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90 relative">
          <GithubGraph />
        </div>

        {/* Closing Statement / Open-source Under Box */}
        <div className="p-8 sm:p-10 text-center relative">
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
