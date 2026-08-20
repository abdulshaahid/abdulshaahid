"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MessageCircle,
  Github,
  Linkedin,
  Instagram,
  Check,
  Copy,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.201.3-.777.98-1.078 1.33-.301.35-.602.4-.903.25-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.35.452-.526.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.526-.075-.15-.678-1.636-.929-2.242-.244-.59-.492-.51-.678-.52-.176-.009-.377-.009-.578-.009-.201 0-.527.075-.803.375-.276.3-1.054 1.03-1.054 2.513s1.079 2.914 1.23 3.115c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.377.198 1.896.12.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.35z" />
      <path d="M12.004 0C5.372 0 0 5.373 0 12c0 2.116.553 4.103 1.524 5.829L.055 23.513l5.856-1.536C7.607 23.01 9.728 24 12.004 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.818c-1.898 0-3.664-.531-5.18-1.455l-.371-.224-3.481.913.929-3.393-.245-.39A9.768 9.768 0 0 1 2.182 12c0-5.416 4.402-9.818 9.822-9.818 5.419 0 9.818 4.402 9.818 9.818 0 5.416-4.399 9.818-9.818 9.818z" />
    </svg>
  )
}

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [showPhoneOptions, setShowPhoneOptions] = useState(false)
  const phoneBoxRef = useRef<HTMLDivElement>(null)

  const email = "abdulshaahid1@gmail.com"
  const phone = "+91 62826 69441"
  const phoneRaw = "+916282669441"

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        phoneBoxRef.current &&
        !phoneBoxRef.current.contains(event.target as Node)
      ) {
        setShowPhoneOptions(false)
      }
    }
    if (showPhoneOptions) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPhoneOptions])

  return (
    <section id="contact" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b]">
        {/* Intro Header */}
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_CONFIG}
              transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            >
              <h2 className="font-bricolage text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Got something <GreenHighlight delay={0.15}>worth building?</GreenHighlight>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_CONFIG}
              transition={{ duration: 0.48, ease: SMOOTH_EASE, delay: 0.06 }}
              className="mt-4 text-[13.5px] sm:text-[14.5px] text-zinc-400 font-light leading-relaxed"
            >
              Open to new opportunities, freelance projects, and creative collaborations.
              Have an ambitious idea or need frontend engineering? Let's talk.
            </motion.p>

            {/* Action Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_CONFIG}
              transition={{ duration: 0.5, ease: SMOOTH_EASE, delay: 0.12 }}
              className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3"
            >
              {/* Say Hello with attached Copy Email */}
              <div className="inline-flex items-center rounded-full bg-zinc-200 text-black hover:bg-white transition-all shadow-sm group h-9">
                <a
                  href={`mailto:${email}?subject=Portfolio%20Inquiry`}
                  className="inline-flex items-center gap-2 pl-4 pr-2.5 h-full text-xs font-mono font-medium hover:opacity-85 transition-opacity"
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="leading-none translate-y-[0.75px]">Say Hello</span>
                  <ArrowUpRight
                    size={13}
                    className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <span className="w-px h-3.5 bg-zinc-400/80 shrink-0" />
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title={copiedEmail ? "Copied to clipboard!" : "Copy email address"}
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 h-full text-xs font-mono font-medium hover:bg-black/10 rounded-r-full transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={13} className="text-emerald-700 stroke-[2.5] shrink-0" />
                      <span className="text-emerald-800 font-semibold text-[11px] leading-none translate-y-[0.75px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="text-zinc-700 shrink-0" />
                      <span className="text-[11px] text-zinc-800 leading-none translate-y-[0.75px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone Number with Call / WhatsApp Option Box */}
              <div className="relative" ref={phoneBoxRef}>
                <button
                  type="button"
                  onClick={() => setShowPhoneOptions((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs font-mono font-medium transition-all group border cursor-pointer ${
                    showPhoneOptions
                      ? "bg-zinc-800 text-white border-zinc-600 ring-2 ring-zinc-700/50"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800 hover:border-zinc-700"
                  }`}
                  aria-expanded={showPhoneOptions}
                >
                  <Phone size={13} className="text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0" />
                  <span className="leading-none translate-y-[0.75px]">{phone}</span>
                  <ChevronDown
                    size={13}
                    className={`text-zinc-500 transition-transform duration-200 shrink-0 ${
                      showPhoneOptions ? "rotate-180 text-white" : "group-hover:text-white"
                    }`}
                  />
                </button>

                {/* Option Box Modal / Dropdown - Borderless Design */}
                {showPhoneOptions && (
                  <div className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 z-50 w-60 rounded-2xl bg-[#141418] shadow-2xl p-2 space-y-0.5 backdrop-blur-md">
                    <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                      <span>Connect via phone</span>
                      <span className="text-zinc-600 text-[10px]">DIRECT</span>
                    </div>

                    {/* Direct Voice Call */}
                    <a
                      href={`tel:${phoneRaw}`}
                      onClick={() => setShowPhoneOptions(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-800/70 flex items-center justify-center text-zinc-400 group-hover/item:text-zinc-200 shrink-0">
                        <Phone size={14} />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-zinc-100 group-hover/item:text-white leading-tight">Direct Call</p>
                          <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">Start phone call</p>
                        </div>
                        <ArrowUpRight size={13} className="text-zinc-500 group-hover/item:text-zinc-300 shrink-0 ml-1" />
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${phoneRaw.replace("+", "")}?text=Hi%20Shahid%2C%20I%20saw%20your%20portfolio`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowPhoneOptions(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-800/70 flex items-center justify-center text-zinc-400 group-hover/item:text-zinc-200 shrink-0">
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-zinc-100 group-hover/item:text-white leading-tight">WhatsApp</p>
                          <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">Chat on WhatsApp</p>
                        </div>
                        <ArrowUpRight size={13} className="text-zinc-500 group-hover/item:text-zinc-300 shrink-0 ml-1" />
                      </div>
                    </a>

                    {/* Copy Phone */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyPhone()
                        setTimeout(() => setShowPhoneOptions(false), 900)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left group/item cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-800/70 flex items-center justify-center text-zinc-400 group-hover/item:text-zinc-200 shrink-0">
                        {copiedPhone ? (
                          <Check size={14} className="text-zinc-200" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-100 group-hover/item:text-white leading-tight">
                          {copiedPhone ? "Copied to clipboard!" : "Copy phone number"}
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/abdulshaahid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all"
              >
                <Github size={14} className="shrink-0" />
                <span className="leading-none translate-y-[0.75px]">GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mohamedabdulshahid/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all"
              >
                <Linkedin size={14} className="shrink-0" />
                <span className="leading-none translate-y-[0.75px]">LinkedIn</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/abdulshaahid/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all"
              >
                <Instagram size={14} className="shrink-0" />
                <span className="leading-none translate-y-[0.75px]">Instagram</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
