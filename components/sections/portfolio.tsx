import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 id="portfolio-title" className="font-serif text-3xl font-semibold text-pretty">
          My Work
        </h2>

        <Card className="mt-6 glass overflow-hidden rounded-2xl group relative transition-all duration-300 motion-reduce:transform-none hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl">Trawayl</CardTitle>
            <CardDescription className="text-zinc-400 text-pretty">
              A modern travel package booking platform with user and agent experiences.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center group">
            {/* Text block */}
            <div className="order-2 md:order-1 space-y-3 text-zinc-400">
              <p className="leading-relaxed text-pretty">
                User App: Explore and book packages seamlessly. <br />
                Agent Dashboard: Manage packages, vehicles, and bookings in real time.
              </p>
              <ul className="list-disc pl-5 marker:text-zinc-500 space-y-1">
                <li>Tech Stack: React, Tailwind, JS, AWS hosting</li>
                <li>Role: UI/UX &amp; full frontend development</li>
                <li>Timeline: 2024–Present</li>
              </ul>
              <div>
                <a
                  href="https://trawayl.com"
                  className="inline-flex items-center gap-2 text-zinc-300 underline underline-offset-4 hover:no-underline transition-colors"
                >
                  View Demo
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* Images block */}
            <div className="order-1 md:order-2 flex flex-col md:flex-row gap-3">
              <figure className="relative overflow-hidden rounded-xl border border-white/10 flex-1 transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.01]">
                <img
                  src="/user-app-mockup-grayscale.png"
                  alt="User app mockup"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <figure className="relative overflow-hidden rounded-xl border border-white/10 flex-1 transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.01]">
                <img
                  src="/agent-dashboard-mockup-grayscale.png"
                  alt="Agent dashboard mockup"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </section>
  )
}
