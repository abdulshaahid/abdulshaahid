import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Services } from "@/components/sections/services"
import { Portfolio } from "@/components/sections/portfolio"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

export default function Page() {
  return (
    <main id="top" className="bg-dot-grid">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Services />
      <Portfolio />
      <Contact />
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-zinc-200"
      >
        ↑
      </a>
      <Footer />
    </main>
  )
}
