import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Layout, MonitorSmartphone, PanelsTopLeft, Ruler, Sparkles } from "lucide-react"

const skills = [
  {
    icon: Code,
    label: "React.js",
    description: "Building dynamic UIs",
    iconColor: "text-blue-400",
    size: "large",
  },
  {
    icon: Sparkles,
    label: "JavaScript (ES6+)",
    description: "Modern JS features",
    iconColor: "text-yellow-400",
    size: "medium",
  },
  {
    icon: Layout,
    label: "HTML5 & CSS3",
    description: "Semantic markup",
    iconColor: "text-green-400",
    size: "medium",
  },
  {
    icon: PanelsTopLeft,
    label: "Tailwind CSS",
    description: "Utility-first styling",
    iconColor: "text-purple-400",
    size: "large",
  },
  {
    icon: Ruler,
    label: "UI/UX Design",
    description: "User-centered design",
    iconColor: "text-rose-400",
    size: "medium",
  },
  {
    icon: MonitorSmartphone,
    label: "Responsive Design",
    description: "Multi-device layouts",
    iconColor: "text-indigo-400",
    size: "medium",
  },
]

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-4 text-balance">
            Skills & Expertise
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto text-pretty">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 mx-auto max-w-6xl">
          {/* React.js - Hero card (prominent on larger screens, full-width on small) */}
          <Card className="sm:col-span-2 lg:col-span-5 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-[1.02] motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-8 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-6">
                <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <Code
                    size={36}
                    className="text-blue-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Featured
                </Badge>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-white group-hover:text-white/90 transition-colors">
                  React.js
                </h3>
                {/* improve text wrapping */}
                <p className="text-lg text-zinc-300/80 leading-relaxed text-pretty">
                  Building modern, interactive user interfaces with component-based architecture
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500" />
            </CardContent>
          </Card>

          {/* JavaScript */}
          <Card className="sm:col-span-1 lg:col-span-4 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-105 motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <Sparkles
                    size={28}
                    className="text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Core
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                  JavaScript (ES6+)
                </h3>
                {/* improve text wrapping */}
                <p className="text-sm text-zinc-300/80 leading-relaxed text-pretty">
                  Modern JavaScript features and async programming
                </p>
              </div>
            </CardContent>
          </Card>

          {/* HTML5 & CSS3 */}
          <Card className="sm:col-span-1 lg:col-span-3 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-105 motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <Layout
                    size={26}
                    className="text-green-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Core
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                  HTML5 & CSS3
                </h3>
                {/* improve text wrapping */}
                <p className="text-sm text-zinc-300/80 leading-relaxed text-pretty">Semantic markup & styling</p>
              </div>
            </CardContent>
          </Card>

          {/* Tailwind CSS - Wide on desktop, full on small */}
          <Card className="sm:col-span-2 lg:col-span-7 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-[1.02] motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <PanelsTopLeft
                    size={30}
                    className="text-purple-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Essential
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl lg:text-2xl font-semibold text-white group-hover:text-white/90 transition-colors">
                  Tailwind CSS
                </h3>
                {/* improve text wrapping */}
                <p className="text-base text-zinc-300/80 leading-relaxed text-pretty">
                  Utility-first CSS framework for rapid UI development
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors duration-500" />
            </CardContent>
          </Card>

          {/* UI/UX Design */}
          <Card className="sm:col-span-1 lg:col-span-3 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-105 motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <Ruler
                    size={26}
                    className="text-rose-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Design
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                  UI/UX Design
                </h3>
                {/* improve text wrapping */}
                <p className="text-sm text-zinc-300/80 leading-relaxed text-pretty">User-centered design principles</p>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Design */}
          <Card className="sm:col-span-1 lg:col-span-2 glass hover-lift rounded-2xl group relative overflow-hidden border-white/10 motion-safe:hover:scale-105 motion-reduce:transform-none transition-all duration-300 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent opacity-30" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                  <MonitorSmartphone
                    size={26}
                    className="text-indigo-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <Badge className="bg-white/10 text-zinc-300 border-white/20 hover:bg-white/20 transition-colors">
                  Mobile
                </Badge>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                  Responsive Design
                </h3>
                {/* improve text wrapping */}
                <p className="text-sm text-zinc-300/80 leading-relaxed text-pretty">Cross-device compatibility</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional info section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-zinc-300 text-sm">Always learning and exploring new technologies</span>
          </div>
        </div>
      </div>
    </section>
  )
}
