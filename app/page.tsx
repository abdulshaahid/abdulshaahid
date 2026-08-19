import { HeroSplashController } from "@/components/ui/hero-splash-controller"
import { Navbar } from "@/components/sections/navbar"
import { MouseBackground } from "@/components/ui/mouse-background"
import { About } from "@/components/sections/about"
import { Portfolio } from "@/components/sections/portfolio"
import { GithubActivity } from "@/components/sections/github-activity"
import { Skills } from "@/components/sections/skills"
import { Writing } from "@/components/sections/writing"
import { Guestbook } from "@/components/sections/guestbook"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { SlopeDivider } from "@/components/ui/geometric"

export default function Page() {
  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Page Layout with Interactive Wave & Mouse Glow */}
      <MouseBackground>
        <main id="top" className="relative min-h-screen pt-0">
          {/* Splash Screen & Hero */}
          <HeroSplashController />

          {/* Spacing below hero before geometric sections start */}
          <div className="pt-8 sm:pt-16">
            {/* 1. Philosophy / About Section (Server Component) */}
            <About />
          </div>

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 2. Projects / Work Section */}
          <Portfolio />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* GitHub Activity / Open Source Section */}
          <GithubActivity />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 3. Skills / Ecosystem Section (Server Component) */}
          <Skills />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 4. Writing / Blog Section (Server Component) */}
          <Writing />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 5. Guestbook / Social Proof Section (Server Component) */}
          <Guestbook />

          {/* Full-width Slope Divider */}
          <SlopeDivider />

          {/* 6. Final Contact CTA Module */}
          <Contact />

          {/* 7. Footer (Server Component) */}
          <Footer />
        </main>
      </MouseBackground>
    </>
  )
}
