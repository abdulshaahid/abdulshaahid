"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setMousePosition({
        x: (x - centerX) / centerX,
        y: (y - centerY) / centerY,
      });

      const rotateX = (y - centerY) / 20;
      const rotateY = (x - centerX) / 20;

      if (titleRef.current) {
        titleRef.current.style.transform = `perspective(1000px) rotateX(${
          -rotateX * 0.1
        }deg) rotateY(${rotateY * 0.1}deg)`;
      }

      if (imageRef.current) {
        imageRef.current.style.transform = `perspective(1000px) rotateX(${
          5 - rotateX * 0.3
        }deg) rotateY(${-5 + rotateY * 0.3}deg) translateZ(30px) scale(1.02)`;
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Hero"
      className="relative min-h-screen flex items-center pt-8 sm:pt-4 lg:pt-0 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 10}px, ${
              mousePosition.y * 10
            }px)`,
          }}
        />

        {/* Enhanced floating particles with varied sizes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-float-1">
          <div className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-75"></div>
        </div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-float-2">
          <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-float-3">
          <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm animate-pulse"></div>
        </div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-float-4"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-white/15 rounded-full animate-float-5">
          <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-50"></div>
        </div>

        {/* Additional floating elements */}
        <div className="absolute top-1/3 right-1/3 w-3 h-3 border border-white/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 border border-white/5 rounded-full animate-spin-reverse"></div>

        {/* Enhanced gradient orbs with more depth */}
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse-slow">
          <div className="absolute inset-4 bg-white/3 rounded-full blur-2xl animate-pulse-slower"></div>
        </div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-white/3 rounded-full blur-3xl animate-pulse-slower">
          <div className="absolute inset-8 bg-white/2 rounded-full blur-xl animate-pulse-slow"></div>
        </div>

        {/* Subtle light rays */}
        <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-white/20 to-transparent transform -translate-x-1/2 animate-fade-in-out"></div>
        <div className="absolute bottom-0 right-1/3 w-px h-24 bg-gradient-to-t from-white/15 to-transparent animate-fade-in-out-delayed"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2">
          {/* Content Section */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6 sm:space-y-8">
            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="inline-flex items-center justify-center">
                <span className="relative inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm text-zinc-300 backdrop-blur-xl hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:scale-110 group cursor-default">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></span>
                    👋 Welcome to my portfolio
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                </span>
              </div>
            </div>

            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h1
                ref={titleRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight sm:leading-tight text-white transition-all duration-300 cursor-default"
              >
                <div className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-br from-white via-white to-zinc-300 bg-clip-text text-transparent animate-shimmer bg-size-200">
                    Abdul Shahid
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent blur-2xl opacity-50"></div>
                </div>
                <br />
              </h1>
            </div>

            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="relative">
                <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 font-medium">
                  <span className="relative inline-block hover:text-white transition-colors duration-500 ">
                    React Frontend Developer
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-500"></span>
                  </span>
                  <span className="mx-3 text-white/30">•</span>
                  <span className="relative inline-block hover:text-white transition-colors duration-500 ">
                    UI/UX Designer
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-500 delay-100"></span>
                  </span>
                </p>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform scale-x-0 hover:scale-x-100 transition-transform duration-700"></div>
              </div>
            </div>

            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "0.7s" }}
            >
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed hover:text-zinc-300 transition-colors duration-500">
                Crafting{" "}
                <span className="relative text-white font-semibold group cursor-default">
                  sleek
                  <span className="absolute -inset-1 bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </span>
                ,{" "}
                <span className="relative text-white font-semibold group cursor-default">
                  scalable
                  <span className="absolute -inset-1 bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </span>
                , and{" "}
                <span className="relative text-white font-semibold group cursor-default">
                  user-focused
                  <span className="absolute -inset-1 bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </span>{" "}
                web experiences with modern technologies and creative design
                solutions.
              </p>
            </div>

            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-2xl bg-[#fffff0]/90 text-black hover:bg-zinc-200 px-8 py-4 text-base font-semibold transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-white/25 group relative overflow-hidden"
                >
                  <a href="#portfolio">
                    <span className="relative z-10 flex items-center gap-2">
                      View My Work
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
                  </a>
                </Button>

                <Button
                  asChild
        
                  className="w-full sm:w-auto rounded-2xl  text-white hover:text-white/80 bg-[#222222] hover:bg-[#272727] px-8 py-4 text-base font-semibold transform hover:scale-105 hover:-translate-y-1 transition-all duration-300  group relative overflow-hidden backdrop-blur-sm"
                >
                  <a href="#contact">
                    <span className="relative z-10 flex items-center gap-2">
                      Contact Me
                      <svg
                        className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
                  </a>
                </Button>
              </div>
            </div>

            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: "1.1s" }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-6 text-zinc-500 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Available for projects</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Based in India</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="order-1 lg:order-2 opacity-0 animate-slide-up"
            style={{ animationDelay: "1.1s" }}
          >
            <div className="relative mx-auto w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-88 lg:h-88">
              {/* Enhanced outer rotating rings with varied speeds */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow hover:border-white/40 transition-colors duration-500">
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute inset-4 rounded-full border border-white/10 animate-spin-reverse hover:border-white/30 transition-colors duration-500">
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute inset-8 rounded-full border border-white/5 animate-spin-slow-reverse hover:border-white/20 transition-colors duration-500">
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              {/* Enhanced glowing orbs with pulsing effects */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full blur-md animate-pulse-soft">
                <div className="absolute inset-2 bg-white/50 rounded-full animate-ping"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-white/20 rounded-full blur-sm animate-pulse-offset">
                <div className="absolute inset-1 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-white/25 rounded-full blur-sm animate-pulse-slow"></div>

              {/* Main image container with enhanced effects */}
              <div
                ref={imageRef}
                className="relative h-full w-full rounded-full overflow-hidden shadow-2xl hover:shadow-white/30 transition-all duration-700 group cursor-pointer transform-gpu"
              >
                {/* Enhanced border with animated gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-white/20 p-0.5 group-hover:from-white/30 group-hover:to-white/30 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-black"></div>
                </div>

                {/* Image */}
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src="/profile-portrait-monochrome.png"
                    alt="Mohamed Abdul Shahid - Profile"
                    fill
                    sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 22rem"
                    className="object-cover transition-all duration-1000 group-hover:scale-110 filter group-hover:brightness-110 group-hover:contrast-110"
                    priority
                  />

                  {/* Enhanced overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shine"></div>
                </div>

                {/* Enhanced depth shadow */}
                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 -z-10 transform translate-y-6 translate-x-6 scale-95"></div>
              </div>

              {/* Enhanced floating particles with trails */}
              <div className="absolute top-12 -left-8 w-2 h-2 bg-white/40 rounded-full animate-float-particle-1">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm scale-150 animate-pulse"></div>
              </div>
              <div className="absolute bottom-16 -right-12 w-1.5 h-1.5 bg-white/30 rounded-full animate-float-particle-2">
                <div className="absolute inset-0 bg-white/15 rounded-full blur-sm scale-200 animate-pulse"></div>
              </div>
              <div className="absolute top-1/3 -left-12 w-1 h-1 bg-white/50 rounded-full animate-float-particle-3">
                <div className="absolute inset-0 bg-white/25 rounded-full blur-sm scale-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer-delayed {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fade-in-out-delayed {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(90deg);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-35px) rotate(-90deg);
          }
        }

        @keyframes float-5 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(270deg);
          }
        }

        @keyframes float-particle-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(10px, -20px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes float-particle-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-15px, -25px) scale(1.5);
            opacity: 0.7;
          }
        }

        @keyframes float-particle-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(20px, -15px) scale(1.3);
            opacity: 0.9;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(180deg);
          }
          to {
            transform: rotate(-180deg);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-offset {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-shimmer-delayed {
          animation: shimmer-delayed 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out infinite;
        }
        .animate-fade-in-out-delayed {
          animation: fade-in-out-delayed 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }
        .animate-float-4 {
          animation: float-4 9s ease-in-out infinite;
        }
        .animate-float-5 {
          animation: float-5 5s ease-in-out infinite;
        }

        .animate-float-particle-1 {
          animation: float-particle-1 4s ease-in-out infinite;
        }
        .animate-float-particle-2 {
          animation: float-particle-2 5s ease-in-out infinite;
        }
        .animate-float-particle-3 {
          animation: float-particle-3 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
        .animate-pulse-offset {
          animation: pulse-offset 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        .bg-size-200 {
          background-size: 200% 200%;
        }
        .transform-gpu {
          transform: translateZ(0);
        }

        @media (max-width: 1024px) {
          .animate-spin-slow,
          .animate-spin-reverse,
          .animate-spin-slow-reverse {
            animation-duration: 30s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
