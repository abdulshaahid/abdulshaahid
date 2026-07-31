"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
        y: (e.clientY - innerHeight / 2) / (innerHeight / 2),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative w-full min-h-[100svh] text-white flex flex-col justify-start overflow-hidden pt-28 sm:pt-32 md:pt-16 pb-12 px-4 sm:px-6 md:px-12 lg:px-16 select-none"
    >
      {/* ===== PURE CSS U-SHAPED AMBIENT LIGHT BACKDROP ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex justify-center items-start">
        {/* Giant U-Shape Ambient Glow Bowl */}
        <div
          className="w-[140vw] max-w-[1500px] h-[450px] sm:h-[650px] md:h-[800px] -mt-20 sm:-mt-32 rounded-b-[50%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#37e5a5]/30 via-[#37e5a5]/10 to-transparent blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 10}px)`,
          }}
        />

        {/* Left Ambient Wing Glow */}
        <div className="absolute top-0 left-[-15%] sm:left-[0%] w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-br from-[#37e5a5]/20 via-[#37e5a5]/8 to-transparent rounded-full blur-[90px] sm:blur-[150px]" />

        {/* Right Ambient Wing Glow */}
        <div className="absolute top-0 right-[-15%] sm:right-[0%] w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-bl from-[#37e5a5]/20 via-[#37e5a5]/8 to-transparent rounded-full blur-[90px] sm:blur-[150px]" />

        {/* Center Soft Head Spotlight */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#37e5a5]/15 rounded-full blur-[100px] sm:blur-[160px]" />

      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
        
        {/* 1. TOP SCRIPT TITLE: "Hey, there" */}
        <div className="relative w-full pointer-events-none pt-2 sm:pt-4 z-0 flex justify-center">
          {/* Desktop Version with Gap for Head */}
          <h1 className="hidden md:flex font-script italic text-[7.5rem] lg:text-[9.5rem] xl:text-[11.5rem] text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm items-center justify-center gap-24 lg:gap-32 mx-auto">
            <span className="text-[#27bf88]">Hey,</span>
            <span>there</span>
          </h1>
          {/* Mobile Version - Centered Fluid Text */}
          <h1 className="block md:hidden font-script italic text-6xl sm:text-7xl text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm text-center">
            <span className="text-[#27bf88]">Hey,</span> <span>there</span>
          </h1>
        </div>

        {/* 2. MIDDLE & WAIST SECTION: Desktop Grid vs Mobile Layout */}
        
        {/* DESKTOP LAYOUT (md:grid) */}
        <div className="hidden md:grid relative w-full grid-cols-12 items-end my-auto z-10 gap-0 -mt-20 lg:-mt-32">
          
          {/* Left Column: Pill + "I AM SHAHID" Headline */}
          <div className="col-span-3 flex flex-col justify-center items-start z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
           

            <div className="text-left select-none">
              <span className="block text-3xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                I AM
              </span>
              <span className="block text-5xl lg:text-[4.8rem] xl:text-[6.2rem] font-black uppercase tracking-tighter text-white leading-[0.85]">
                SHAHID
              </span>
            </div>
          </div>

          {/* Center Column: Main Cutout Portrait Photo */}
          <div className="col-span-6 flex justify-center items-end relative z-10">
            <div className="relative w-full max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] flex justify-center items-end group">
              <Image
                src="/me.png"
                alt="Mohamed Abdul Shahid"
                width={750}
                height={900}
                priority
                style={{
                  maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                }}
                className="w-full h-auto max-h-[76vh] lg:max-h-[84vh] object-contain filter grayscale contrast-110 transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Right Column: Bio Paragraph + "FRONTEND DEVELOPER" Headline */}
          <div className="col-span-3 flex flex-col justify-center items-end z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
            <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-[220px] lg:max-w-[260px] text-right">
              Specialized in Web Design, UX / UI, Webflow, and Front End Development.
            </p>

            <div className="text-right select-none">
              <span className="block text-2xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tighter text-zinc-300 leading-none">
                FRONTEND
              </span>
              <span className="block text-4xl lg:text-[4.2rem] xl:text-[5.5rem] font-black uppercase tracking-tighter text-zinc-300 leading-[0.85]">
                DEVELOPER
              </span>
            </div>
          </div>

        </div>

        {/* MOBILE LAYOUT (< md) */}
        <div className="flex md:hidden flex-col items-center w-full my-auto z-20 space-y-6 pt-0 pb-8 -mt-6 sm:-mt-8">
          
          {/* Center Portrait Image */}
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] flex justify-center items-end py-0 z-10 -mb-2 -translate-y-1 sm:-translate-y-1">
            <Image
              src="/me.png"
              alt="Mohamed Abdul Shahid"
              width={500}
              height={600}
              priority
              style={{
                maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
              }}
              className="w-full h-auto max-h-[45vh] sm:max-h-[55vh] object-contain filter grayscale contrast-110"
            />
          </div>

       

          {/* Mobile Headlines Stack */}
          <div className="w-full flex flex-col items-center justify-center space-y-6 pt-2 z-20">
            <div className="text-center select-none flex flex-col items-center">
              <span className="block text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white leading-none">
                I AM
              </span>
              <span className="block text-6xl sm:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                SHAHID
              </span>
            </div>

            <div className="text-center select-none flex flex-col items-center">
              <span className="block text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-300 leading-none">
                FRONTEND
              </span>
              <span className="block text-5xl sm:text-6xl font-black uppercase tracking-tighter text-zinc-300 leading-[0.85]">
                DEVELOPER
              </span>
            </div>
          </div>

          {/* Bio Text Paragraph */}
          <p className="text-sm text-zinc-400 font-normal text-center max-w-[300px] px-4 pt-2">
            Specialized in Web Design, UX / UI, Webflow, and Front End Development.
          </p>
        </div>

      </div>
    </section>
  );
}
