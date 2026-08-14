"use client"

import React from "react"
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative w-full border-t border-zinc-800/80 bg-[#070709]">
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1140px] xl:max-w-[1200px] mx-auto border-l border-r border-zinc-800/80 relative bg-[#070709]">
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Left Column: Brand, Bio & Status */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1fd38a] animate-pulse" />
                <span className="font-bricolage text-base sm:text-lg font-bold text-white tracking-tight">
                  Mohamed Abdul Shahid
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-zinc-400 max-w-sm leading-relaxed">
                Frontend Developer & UI/UX Designer crafting purposeful digital experiences and scalable web systems.
              </p>

              {/* Status indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1fd38a]" />
                <span>Available for full-time & freelance projects</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://github.com/abdulshaahid"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-[4px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Github size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/mohamedabdulshahid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-[4px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href="https://instagram.com/abdulshaahid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-[4px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="mailto:shahidpallath623@gmail.com"
                  aria-label="Email"
                  className="w-8 h-8 rounded-[4px] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Mail size={14} />
                </a>
              </div>
            </div>

            {/* Right Column: Navigation */}
            <div className="md:col-span-5 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bricolage text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                  Navigation
                </h4>
                <ul className="space-y-2 text-xs font-mono">
                  <li>
                    <a href="#top" className="text-zinc-400 hover:text-white transition-colors">
                      00 // Home
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-zinc-400 hover:text-white transition-colors">
                      01 // Philosophy
                    </a>
                  </li>
                  <li>
                    <a href="#portfolio" className="text-zinc-400 hover:text-white transition-colors">
                      02 // Work
                    </a>
                  </li>
                  <li>
                    <a href="#skills" className="text-zinc-400 hover:text-white transition-colors">
                      03 // Stack
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="text-zinc-400 hover:text-white transition-colors">
                      04 // Writing
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-zinc-400 hover:text-white transition-colors">
                      05 // Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bricolage text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                  Connect
                </h4>
                <ul className="space-y-2 text-xs font-mono">
                  <li>
                    <a
                      href="https://trawayl.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Trawayl</span>
                      <span className="text-[10px] text-zinc-600">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/abdulshaahid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <span className="text-[10px] text-zinc-600">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/mohamedabdulshahid/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>LinkedIn</span>
                      <span className="text-[10px] text-zinc-600">↗</span>
                    </a>
                  </li>
                </ul>

                <div className="mt-6">
                  <button
                    onClick={scrollToTop}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <ArrowUp size={13} />
                    <span>Back to top</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Specs */}
          <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            <p>© {new Date().getFullYear()} Mohamed Abdul Shahid. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Next.js + Tailwind CSS</span>
              <span className="text-zinc-700">•</span>
              <span className="text-emerald-400">60 FPS Native</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
