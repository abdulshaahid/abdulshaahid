import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lens } from "@/components/ui/lens"; // Add this import

export function About() {
  return (
    <section id="about" className="scroll-mt-24">
  <div className="mx-auto max-w-6xl px-4 py-16">
    <div className="grid gap-16 md:grid-cols-2 items-center">
      
      {/* Left Column */}
      <div className="reveal">
        <h2 className="font-serif text-3xl font-semibold">About</h2>
        <p className="mt-4 text-zinc-400 text-pretty">
          I'm Mohamed Abdul Shahid, a React frontend developer and UI/UX designer passionate about building modern
          digital experiences. Currently, I'm working on my startup project Trawayl, focusing on design, usability,
          and performance.
        </p>

        {/* Cards Section */}
        <div className="mt-8 grid gap-4">
          <Card className="glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/5 motion-reduce:transform-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Education</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              B.Tech in Computer Science, 2024 — KTU
            </CardContent>
          </Card>

          <Card className="glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/5 motion-reduce:transform-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              Founder & Frontend Developer — Trawayl (2024–Present)
            </CardContent>
          </Card>
        </div>
      </div>

{/* Right Column */}
<div className="reveal flex justify-center md:justify-end">
  <div className="glass rounded-3xl p-3 transition-transform duration-300 motion-reduce:transform-none hover:scale-[1.01] max-w-md w-full">
    <Lens
      zoomFactor={2}
      lensSize={150}
      duration={0.2}
      ariaLabel="Zoom into abstract illustration"
    >
      <img
        src="/abstract-monochrome-illustration.png"
        alt="Abstract monochrome illustration"
        className="mx-auto rounded-2xl w-full"
        loading="lazy"
        decoding="async"
      />
    </Lens>
  </div>
</div>

      
    </div>
  </div>
</section>

  );
}
