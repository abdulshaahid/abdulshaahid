"use client"

import React, { useState } from "react"
import { Mail, Github, Linkedin, Instagram, Check, Copy, ArrowUpRight } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"

export function Contact() {
  const [copied, setCopied] = useState(false)
  const email = "shahidpallath623@gmail.com"

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header */}
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <h2 className="font-bricolage text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Got something <GreenHighlight>worth building?</GreenHighlight>
            </h2>

            <p className="mt-4 text-[13.5px] sm:text-[14.5px] text-zinc-400 font-light leading-relaxed">
              Open to new opportunities, freelance projects, and creative collaborations.
              Have an ambitious idea or need frontend engineering? Let's talk.
            </p>

            {/* Action Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href={`mailto:${email}?subject=Portfolio%20Inquiry`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium bg-zinc-200 text-black hover:bg-white transition-all shadow-sm group"
              >
                <Mail size={14} />
                <span>Say Hello</span>
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800  transition-all"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-[#1fd38a]" />
                    <span className="text-[#1fd38a]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-zinc-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/abdulshaahid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800  transition-all"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/mohamedabdulshahid/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800  transition-all"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://instagram.com/abdulshaahid/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800  transition-all"
              >
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
