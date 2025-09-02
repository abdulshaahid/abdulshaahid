"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
]

export function Navbar() {
  const [active, setActive] = useState("home")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <header className="sticky top-4 z-50 m-2">
      <nav className="mx-auto max-w-6xl rounded-2xl glass px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className="font-serif text-xl font-semibold">
            AbdulShahid
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden gap-6 md:flex">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  className={cn(
                    "text-sm text-zinc-300 hover:text-white transition-colors pb-1",
                    active === it.id && "text-white border-b-2 border-white",
                  )}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-300 hover:text-white transition-colors"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {open && (
          <div
            className="md:hidden mt-3 mx-2 sm:mx-4 rounded-2xl border border-white/10 
                       bg-black/80 p-5 space-y-3 backdrop-blur-xl shadow-lg 
                       animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors",
                  active === it.id && "text-white font-medium bg-white/10",
                )}
              >
                {it.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
