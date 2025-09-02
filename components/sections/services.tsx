import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  { title: "React Applications", desc: "Modern, scalable web apps." },
  { title: "Frontend UI", desc: "Clean, interactive interfaces." },
  { title: "Responsive Design", desc: "Optimized for all devices." },
]

export function Services() {
  return (
    <section id="services" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl font-semibold text-pretty">Services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <Card
              key={s.title}
              className="rounded-2xl glass border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              tabIndex={0}
            >
              <CardHeader>
                <CardTitle className="text-white text-pretty">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400 leading-relaxed text-pretty">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
