import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Images, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#09090b] border border-zinc-800/90 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-[#1fd38a]">
          <span>ERROR // 404</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-bricolage text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            The page you requested could not be found or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 font-mono text-xs">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-zinc-100 text-black font-medium hover:bg-white transition-colors"
          >
            <Home size={14} />
            <span>Return to Home</span>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/#portfolio"
              className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Images size={13} />
              <span>Projects</span>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Mail size={13} />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
