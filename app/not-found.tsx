import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CrosshairMarker, GreenHighlight } from "@/components/ui/geometric";
import { MouseBackground } from "@/components/ui/mouse-background";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <MouseBackground>
      <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center px-4 sm:px-6 select-none relative z-10">
        <div className="w-full max-w-lg border border-dashed border-zinc-800/90 bg-transparent relative p-8 sm:p-12 text-center">
          {/* Precision Geometric Corner Crosshairs */}
          <CrosshairMarker className="top-0 left-0" />
          <CrosshairMarker className="top-0 left-full" />
          <CrosshairMarker className="top-full left-0" />
          <CrosshairMarker className="top-full left-full" />

          <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase block mb-3">
            404 // NOT FOUND
          </span>

          <h1 className="font-script italic text-6xl sm:text-7xl text-zinc-100/90 font-thin leading-none mb-4">
            Lost in space?
          </h1>

          <p className="font-bricolage text-sm sm:text-base text-zinc-400 font-light max-w-sm mx-auto leading-relaxed mb-8">
            This page does not exist or has been moved. Let's get you{" "}
            <GreenHighlight delay={0.1}>back on track</GreenHighlight>.
          </p>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs font-mono font-medium text-black bg-zinc-200 hover:bg-white transition-all shadow-sm group"
            >
              <ArrowLeft
                size={13}
                className="text-black group-hover:-translate-x-0.5 transition-transform shrink-0"
              />
              <span className="leading-none translate-y-[0.75px]">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </MouseBackground>
  );
}
