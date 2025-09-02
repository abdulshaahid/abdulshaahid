import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="home" aria-label="Hero" className="pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="reveal">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Welcome
            </span>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight md:text-6xl">
              Mohamed Abdul Shahid
            </h1>
            <p className="mt-3 text-lg text-zinc-400">React Frontend Developer & UI/UX Designer</p>
            <p className="mt-4 max-w-xl text-pretty text-zinc-400">
              Crafting sleek, scalable, and user-focused web experiences.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200">
                <a href="#portfolio">View My Work</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <a href="#contact">Contact Me</a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full glow-ring reveal md:h-72 md:w-72">
            <Image
              src="/profile-portrait-monochrome.png"
              alt="Profile portrait"
              fill
              sizes="(min-width:768px) 18rem, 14rem"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
