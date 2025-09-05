import { EvervaultCard } from "../evervault-card"; // Adjust path as needed
import { Atom, Palette, Smartphone } from "lucide-react"; // ✅ Lucide icons

const services = [
  {
    title: "React Applications",
    desc: "Modern, scalable web apps.",
    icon: Atom,
  },
  {
    title: "Frontend UI",
    desc: "Clean, interactive interfaces.",
    icon: Palette,
  },
  {
    title: "Responsive Design",
    desc: "Optimized for all devices.",
    icon: Smartphone,
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl font-semibold text-pretty">
          Services
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 overflow-hidden"
              tabIndex={0}
            >
              <EvervaultCard
                text={<s.icon className="h-12 w-12 text-[#fffff0]" />} // ✅ Lucide icon here
                className="h-64 w-full flex items-center justify-center"
              />
              <div className="p-6 bg-black/20 backdrop-blur-sm">
                <h3 className="text-white text-pretty font-semibold text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-pretty">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
