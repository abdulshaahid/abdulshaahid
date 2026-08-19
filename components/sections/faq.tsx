"use client"

import React, { useState } from "react"
import { ChevronDown, ArrowUpRight } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"

interface FAQItem {
  id: string
  num: string
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    id: "services",
    num: "01",
    question: "What services and frontend development do you specialize in?",
    answer:
      "I specialize in building high-performance web applications, scalable design systems, interactive marketing landing pages, and cross-platform mobile apps. My primary tech stack includes React, Next.js, TypeScript, Tailwind CSS, and Framer Motion / GSAP for ultra-smooth micro-interactions and animations.",
  },
  {
    id: "design-philosophy",
    num: "02",
    question: "Do you design the UI/UX yourself?",
    answer:
      "Yes, I design everything myself directly in code from concept to production. Rather than relying on static mockup tools, I conceptualize layout, typography, micro-interactions, and design systems natively with React and CSS — building polished, cohesive digital experiences from scratch.",
  },
  {
    id: "availability",
    num: "03",
    question: "Are you available for freelance projects or full-time roles?",
    answer:
      "Yes! I am available for select freelance contracts, MVP product builds, frontend architecture consulting, and full-time frontend engineering opportunities (remote or hybrid).",
  },
  {
    id: "timeline",
    num: "04",
    question: "What is your typical project turnaround timeline?",
    answer:
      "A high-converting landing page or design system setup typically takes 1–2 weeks. Full-scale SaaS web applications or MVP builds generally range from 3–6 weeks depending on feature scope, backend APIs, and revision cycles.",
  },
  {
    id: "performance",
    num: "05",
    question: "How do you ensure web performance and responsiveness?",
    answer:
      "I follow a mobile-first, performance-obsessed philosophy. Every project undergoes bundle size optimization, semantic SEO structuring, Core Web Vitals audits, and thorough testing across iOS, Android, macOS, and Windows devices.",
  },
  {
    id: "collaboration",
    num: "06",
    question: "How do we get started working together?",
    answer:
      "You can reach out directly via the contact form below, email me at mohamedabdulshahid07@gmail.com, or connect on LinkedIn and GitHub. We'll discuss your project requirements, scope, and timeline.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Section Header */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-dashed border-zinc-800/90 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
              Got questions? Here is everything about{" "}
              <GreenHighlight>how I work and build</GreenHighlight>.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 shrink-0">
            FAQ // WORKFLOW & PROCESS
          </span>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-dashed divide-zinc-800/90">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.id}
                className="group transition-colors hover:bg-white/[0.015]"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
                    <span className="font-mono text-xs sm:text-[13px] text-zinc-500 font-semibold shrink-0 pt-0.5 sm:pt-0">
                      {faq.num}
                    </span>
                    <h3 className="font-bricolage text-sm sm:text-base lg:text-[17px] font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="shrink-0 pt-0.5 sm:pt-0 ml-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? "bg-zinc-800  text-zinc-100 rotate-180"
                          : "bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </button>

                {/* Animated Dropdown Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-5 sm:pb-6"
                      : "grid-rows-[0fr] opacity-0 pb-0"
                  }`}
                >
                  <div className="overflow-hidden px-6 sm:px-10 lg:px-12 pl-[calc(1.5rem+1.5rem)] sm:pl-[calc(2.5rem+2.25rem)] lg:pl-[calc(3rem+2.5rem)]">
                    <p className="text-[13.5px] sm:text-[14.5px] text-zinc-400 font-light leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/90 text-xs font-mono text-zinc-400">
          <span>Have a question not answered here?</span>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-mono font-medium text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <span className="leading-none translate-y-[0.75px]">Ask me directly</span>
            <ArrowUpRight size={13} className="shrink-0 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
