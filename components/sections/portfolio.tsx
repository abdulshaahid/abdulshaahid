"use client";
import React, { useRef } from "react";

// 3D Card Components
const CardContainer = ({ children, className = "" }) => {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transition = "none";
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transition = "transform 0.5s ease-out";
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full transition-all duration-200 ease-linear"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
};

const CardItem = ({
  as: Component = "div",
  children,
  className = "",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const style = {
    transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
  };

  return (
    <Component className={className} style={style} {...rest}>
      {children}
    </Component>
  );
};

export function Portfolio() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <CardItem translateZ="20">
          <h2
            id="portfolio-title"
            className="font-serif text-3xl font-semibold text-pretty mb-8"
          >
            My Work
          </h2>
        </CardItem>

        <CardContainer>
          <CardItem
            translateZ="0"
            className="glass relative group/card overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-white/5 w-full max-w-5xl mx-auto"
          >
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-8">
                <CardItem translateZ="50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    {/* Title + Logo */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-2xl sm:text-3xl font-bold">
                          Trawayl
                        </h3>
                        <img
                          src="/logo.png" // replace with your logo path
                          alt="Trawayl Logo"
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <p className="text-zinc-400 text-base mt-1">
                        Modern travel package booking platform
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                        Live
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        2025
                      </span>
                    </div>
                  </div>
                </CardItem>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Content - Project Details */}
                <div className="lg:col-span-1 space-y-6">
                  <CardItem translateZ="40" translateX="-15">
                    <div className="space-y-4 pl-3">
                      <div>
                        <h4 className="text-white font-semibold mb-3">
                          Overview
                        </h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          Comprehensive travel ecosystem featuring seamless
                          package booking for users and powerful management
                          dashboard for travel agents.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">
                          Key Features
                        </h4>
                        <ul className="text-zinc-400 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>
                              User-friendly package exploration & booking
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Real-time agent dashboard & management</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["React", "Tailwind CSS", "JavaScript", "AWS"].map(
                            (tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 bg-white/10 text-white rounded-lg text-xs font-medium"
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">Role</h4>
                        <p className="text-zinc-400 text-sm">
                          Co - Founder • UI/UX Design • Frontend Development •
                          User Experience
                        </p>
                      </div>
                    </div>
                  </CardItem>

                  {/* CTA Link */}
                  <CardItem translateZ="30" translateX="-10">
                    <a
                      href="https://trawayl.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-3xl transition-all duration-300 group font-medium border border-white/10"
                    >
                      Visit Website
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </CardItem>
                </div>

                {/* Right Content - Screenshots */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                    {/* Desktop Version */}
                    <CardItem
                      translateZ="85"
                      rotateY="8"
                      rotateX="3"
                      className="group/img"
                    >
                      <div className="relative">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-600 transition-transform duration-300 group-hover/img:scale-105 mx-auto max-w-[200px]">
                          {/* Mobile Header */}

                          {/* Mobile Screenshot */}
                          <img
                            src="/trawayl-desktop.png"
                            alt="Trawayl mobile version"
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />

                          {/* Mobile Bottom Bar */}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-xs px-2 py-1 rounded-full">
                          Dashboard
                        </div>
                      </div>
                    </CardItem>

                    {/* Mobile Version */}
                    <CardItem
                      translateZ="85"
                      rotateY="8"
                      rotateX="3"
                      className="group/img"
                    >
                      <div className="relative">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-600 transition-transform duration-300 group-hover/img:scale-105 mx-auto max-w-[200px]">
                          {/* Mobile Header */}

                          {/* Mobile Screenshot */}
                          <img
                            src="/trawayl-mobile.png"
                            alt="Trawayl mobile version"
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />

                          {/* Mobile Bottom Bar */}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-xs px-2 py-1 rounded-full">
                          Marketplace
                        </div>
                      </div>
                    </CardItem>
                  </div>
                </div>
              </div>
            </div>
          </CardItem>
        </CardContainer>
      </div>
    </section>
  );
}
