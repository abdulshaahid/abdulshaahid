"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { GreenHighlight } from "@/components/ui/geometric"
import { VIEWPORT_CONFIG, SMOOTH_EASE } from "@/lib/motion"

interface Testimonial {
  company: string
  role: string
  text: string
  avatar: string
  link?: string
}

const testimonialsRow1: Testimonial[] = [
  {
    company: "Trawayl",
    role: "Co-Founder & Product Design",
    text: "Abdul turned our complex travel booking flows and custom itinerary builder into a blistering fast, intuitive experience on Trawayl.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Midhlaj&backgroundColor=18181b",
    link: "https://trawayl.com",
  },
  {
    company: "Deyno Technologies",
    role: "Tech Lead & ERP Architecture",
    text: "Exceptional eye for design systems and frontend architecture. Built our multi-product ERP interface with speed and clean reusable tokens.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Afsal&backgroundColor=18181b",
  },
  {
    company: "Kerala Startup Carnival",
    role: "Event Leadership & Operations",
    text: "The event site handled massive registration traffic without a hitch. The smooth animations and responsive layout made a huge impression on attendees.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Rahul&backgroundColor=18181b",
    link: "https://keralastartupcarnival.com/",
  },
  {
    company: "Cliper.click",
    role: "Full-Stack Collaboration",
    text: "Collaborating on cross-platform file transfers was seamless. He writes clean, predictable React code with zero UI debt.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Rinshad&backgroundColor=18181b",
    link: "https://cliper.click/",
  },
  {
    company: "Trawerse Studio",
    role: "Lead Architect & Studio",
    text: "Brings designs to life with ultra-smooth GSAP and Framer Motion micro-interactions. One of the sharpest frontend engineers I've worked with.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Nikhil&backgroundColor=18181b",
    link: "https://trawerse.com/",
  },
]

const testimonialsRow2: Testimonial[] = [
  {
    company: "Al Najwa",
    role: "Luxury Interior Portfolio",
    text: "Our luxury portfolio site needed immersive visual storytelling and ultra-smooth scrolling. Abdul delivered beyond our expectations.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Faris&backgroundColor=18181b",
    link: "https://www.alnajwagold.com/",
  },
  {
    company: "Flotilla Group",
    role: "Head of ESG & Sustainability",
    text: "Transformed our sustainability data and ESG reports into an engaging, accessible digital platform with immaculate attention to detail.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Thomas&backgroundColor=18181b",
    link: "https://www.flotillagroup.com/",
  },
  {
    company: "Fortura Global Exim",
    role: "Founder & Distribution",
    text: "Our B2B equipment catalog and global distribution landing page were delivered ahead of schedule with great SEO and lighting-fast page loads.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Arjun&backgroundColor=18181b",
    link: "https://forturaglobalexim.com/",
  },
  {
    company: "ReceiptLog AI",
    role: "Product Lead & Mobile UX",
    text: "Built the mobile UI and receipt scanning workflows with React Native & Expo. Fluid gestures and stellar responsiveness across all devices.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sarah&backgroundColor=18181b",
  },
  {
    company: "TradeEase",
    role: "Operations & Inventory Lead",
    text: "The inventory management dashboard made tracking products and daily analytics effortless for our warehouse team.",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=Bilal&backgroundColor=18181b",
  },
]

function TestimonialCard({ item }: { item: Testimonial }) {
  const CardWrapper = item.link ? "a" : "div"
  const wrapperProps = item.link
    ? {
        href: item.link,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className="w-[280px] sm:w-[340px] md:w-[370px] h-[145px] sm:h-[155px] p-5 sm:p-6 rounded-2xl bg-[#09090b] hover:bg-white/[0.02] border-[1.5px] border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between shrink-0 group select-none cursor-default"
    >
      <div className="flex-1 flex items-start">
        <p className="text-[13.5px] sm:text-[14.5px] text-zinc-200 font-normal leading-relaxed line-clamp-3">
          {item.text}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border border-zinc-700/70 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
          <img
            src={item.avatar}
            alt={`${item.company} testimonial avatar`}
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bricolage text-[13.5px] sm:text-[14px] font-semibold text-zinc-100 group-hover:text-white leading-tight truncate">
              {item.company}
            </h4>
            {item.link && (
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-[#1fd38a] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </div>
          <p className="text-[11px] sm:text-[12px] font-mono text-zinc-400 leading-tight mt-0.5 truncate">
            {item.role}
          </p>
        </div>
      </div>
    </CardWrapper>
  )
}

export function Guestbook() {
  return (
    <section id="guestbook" className="relative scroll-mt-24 w-full">
      {/* Central Content Container */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4.5rem)] md:w-[calc(100%-5rem)] lg:max-w-[1220px] xl:max-w-[1300px] mx-auto border-l border-r border-zinc-800/90 relative bg-[#09090b] overflow-hidden">
        {/* Intro Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 border-b border-zinc-800/90"
        >
          <h2 className="font-bricolage text-base sm:text-xl lg:text-2xl text-zinc-100 leading-snug max-w-2xl text-pretty font-medium">
            Words from friends and <GreenHighlight delay={0.15}>collaborators</GreenHighlight> who know me best.
          </h2>
        </motion.div>

        {/* Horizontal Rolling Testimonial Marquees */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_CONFIG}
          transition={{ duration: 0.52, ease: SMOOTH_EASE, delay: 0.08 }}
          className="py-3.5 sm:py-4 space-y-2 sm:space-y-2.5 relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
        >
          {/* Row 1 - Rolling Left */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 animate-skills-left hover:[animation-play-state:paused]"
            style={{ animationDuration: "42s" }}
          >
            {[...testimonialsRow1, ...testimonialsRow1].map((item, idx) => (
              <TestimonialCard key={`row1-${idx}-${item.company}`} item={item} />
            ))}
          </div>

          {/* Row 2 - Rolling Right */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 animate-skills-right hover:[animation-play-state:paused]"
            style={{ animationDuration: "46s" }}
          >
            {[...testimonialsRow2, ...testimonialsRow2].map((item, idx) => (
              <TestimonialCard key={`row2-${idx}-${item.company}`} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}



