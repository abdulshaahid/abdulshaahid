"use client"

import { useCallback } from "react"
import { Home, Info, Wrench, Briefcase, Images, Mail } from "lucide-react"
import { ExpandableTabs } from "@/components/ui/expandable-tabs"
import { useMediaQuery } from "usehooks-ts"

// Keep section ids the same
const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
]

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const desktopTabs = [
    { type: "label" as const, text: "Abdulshahid" },
    { title: "Home", icon: Home },
    { title: "About", icon: Info },
    { title: "Skills", icon: Wrench },
    { title: "Services", icon: Briefcase },
    { title: "Portfolio", icon: Images },
    { title: "Contact", icon: Mail },
  ]

  const mobileTabs = [
    { title: "Home", icon: Home },
    { title: "About", icon: Info },
    { title: "Skills", icon: Wrench },
    { title: "Services", icon: Briefcase },
    { title: "Portfolio", icon: Images },
    { title: "Contact", icon: Mail },
  ]

  const tabs = isDesktop ? desktopTabs : mobileTabs

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
<header className="sticky top-2 md:top-4 z-50 ">
      <nav className="">
        <div className="flex justify-center ">
          <ExpandableTabs
            tabs={tabs}
            activeColor="text-white"
            className="glass border-white/10 justify-center "
            onChange={(index) => {
              scrollToIndex(index)
            }}
          />
        </div>
      </nav>
    </header>
  )
}
