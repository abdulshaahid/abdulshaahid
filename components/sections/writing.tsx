"use client"

import React from "react"
import { ArrowUpRight } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"

interface ArticleItem {
  id: string
  title: string
  date: string
}

const articles: ArticleItem[] = [
  {
    id: "nextjs-choice",
    title: "Why I choose Next.js for all my modern frontend projects",
    date: "Nov 12, 2024",
  },
  {
    id: "tech-stack-2024",
    title: "The 2024 Modern Developer Tech Stack: Tools & Philosophy",
    date: "Sep 18, 2024",
  },
  {
    id: "component-libraries",
    title: "Designing Resilient and Scalable Component Libraries",
    date: "Jun 04, 2024",
  },
]

export function Writing() {
  return (
    <section id="services" className="relative scroll-mt-24 w-full">
      {/* Central Column */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1140px] xl:max-w-[1200px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90">
          <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            <GreenHighlight>Code, breakdowns</GreenHighlight>, and the occasional 3am adventure.
          </p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-800/90">
          {articles.map((article) => (
            <a
              key={article.id}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-10 lg:px-12 py-5 sm:py-6 hover:bg-white/[0.015] transition-colors duration-150"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-bricolage text-sm sm:text-base lg:text-[17px] font-semibold text-zinc-100 group-hover:text-[#1fd38a] transition-colors leading-snug">
                  {article.title}
                </h3>
              </div>

              <div className="mt-2.5 sm:mt-0 flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {article.date}
                </span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-[#1fd38a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* View all button */}
        <div className="p-5 sm:p-6 flex justify-center border-t border-zinc-800/90">
          <a
            href="https://github.com/abdulshaahid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-[4px] transition-all"
          >
            <span>View all posts</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
