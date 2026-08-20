"use client"

import { useCallback, useState, useEffect } from "react"
import { Home, Info, Wrench, CircleHelp, Images, Mail } from "lucide-react"
import { ExpandableTabs } from "@/components/ui/expandable-tabs"
import { useMediaQuery } from "usehooks-ts"

// Keep section ids in sync with page order
const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "portfolio", label: "Portfolio" },
  { id: "skills", label: "Skills" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
]

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const desktopTabs = [
    { type: "label" as const, text: "Shahid" },
    { title: "Home", icon: Home },
    { title: "About", icon: Info },
    { title: "Portfolio", icon: Images },
    { title: "Skills", icon: Wrench },
    { title: "FAQ", icon: CircleHelp },
    { title: "Contact", icon: Mail },
  ]

  const mobileTabs = [
    { title: "Home", icon: Home },
    { title: "About", icon: Info },
    { title: "Portfolio", icon: Images },
    { title: "Skills", icon: Wrench },
    { title: "FAQ", icon: CircleHelp },
    { title: "Contact", icon: Mail },
  ]

  const tabs = mounted && isDesktop ? desktopTabs : mobileTabs

  const scrollToIndex = useCallback(
    (index: number | null) => {
      if (index == null) return
      const logicalIndex = isDesktop ? index - 1 : index
      if (logicalIndex < 0) return
      const targetId = items[logicalIndex]?.id
      if (!targetId) return
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    [isDesktop],
  )

  return (
    <header className="fixed top-6 inset-x-0 z-50 pointer-events-none">
      <nav aria-label="Main Navigation" className="">
        <div className="flex justify-center pointer-events-auto">
          <ExpandableTabs
            tabs={tabs}
            activeColor="text-white"
            className="glass border-white/5 justify-center"
            onChange={(index) => {
              scrollToIndex(index)
            }}
          />
        </div>
      </nav>
    </header>
  )
}
