"use client";

import Image from "next/image";
import { useEffect, useState, useId, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import Grainient from "@/components/ui/grainient";
import { ParticleImage } from "@/components/ui/particle-image";
import { HeroCtaButton } from "@/components/ui/hero-cta-button";

const CURATED_SHAPE_PATHS = [
  // Shape 1: Clover Star
  "M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z",
  // Shape 2: Hyperbolic 4-Point Starburst
  "M 128 192 C 92.654 192 64 220.654 64 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 128 C 256 198.692 198.692 256 128 256 L 128 192 C 163.346 192 192 163.346 192 128 Z M 128 64 C 92.654 64 64 92.654 64 128 L 0 128 C 0 57.308 57.308 0 128 0 Z M 256 0 C 256 70.692 198.692 128 128 128 L 128 64 C 163.346 64 192 35.346 192 0 Z",
  // Shape 3: Diagonal Floral Petals
  "M 128 128 C 198.692 128 256 185.308 256 256 L 192 256 C 192 220.654 163.346 192 128 192 C 92.654 192 64 220.654 64 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 L 64 0 C 64 35.346 92.654 64 128 64 C 163.346 64 192 35.346 192 0 Z",
  // Shape 4: Curved Arcs
  "M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z",
  // Shape 5: Intersecting Quad Lenses
  "M 64 128 C 64 163.346 92.654 192 128 192 L 128 256 C 57.308 256 0 198.692 0 128 Z M 192 128 C 192 163.346 220.654 192 256 192 L 256 256 C 185.308 256 128 198.692 128 128 Z M 64 0 C 64 35.346 92.654 64 128 64 L 128 128 C 57.308 128 0 70.692 0 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z",
  // Shape 7: 8-Point Geometric Crystal
  "M 112 32 L 54.627 32 L 128 105.373 L 201.373 32 L 144 32 L 144 0 L 256 0 L 256 112 L 224 112 L 224 54.627 L 150.627 128 L 224 201.373 L 224 144 L 256 144 L 256 256 L 144 256 L 144 224 L 201.373 224 L 128 150.627 L 54.627 224 L 112 224 L 112 256 L 0 256 L 0 144 L 32 144 L 32 201.373 L 105.373 128 L 32 54.627 L 32 112 L 0 112 L 0 0 L 112 0 Z",
  // Shape 8: Curved Ribbon Ring
  "M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z",
  // Shape 9: Blossom Quad
  "M 192 192 L 256 192 L 256 256 L 192 256 C 156.654 256 128 227.346 128 192 C 128 227.346 99.346 256 64 256 L 0 256 L 0 192 L 64 192 L 64 128 L 192 128 Z M 192 64 L 256 64 L 256 128 L 192 128 C 156.654 128 128 99.346 128 64 C 128 99.346 99.346 128 64 128 L 0 128 L 0 64 L 64 64 L 64 0 L 192 0 Z",
  // Shape 10: Rounded Geometric Maze
  "M 64 192 L 128 192 L 128 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 128 L 64 128 Z M 192 192 L 256 192 L 256 256 L 192 256 C 156.654 256 128 227.346 128 192 L 128 128 L 192 128 Z M 64 64 L 128 64 L 128 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 128 L 192 128 L 192 64 L 128 64 L 128 128 L 64 128 C 28.654 128 0 99.346 0 64 L 0 0 L 64 0 Z",
  // Shape 16: Diamond Blade Aperture
  "M 128 192 L 0 256 L 0 192 L 128 128 Z M 256 192 L 128 256 L 128 192 L 256 128 Z M 128 64 L 128 128 L 0 64 L 0 0 Z M 256 64 L 256 128 L 128 64 L 128 0 Z",
  // Shape 20: Modern Corner Glyph
  "M 128 28 C 128 83.228 83.228 128 28 128 L 128 128 Z M 256 156 C 256 211.228 211.228 256 156 256 L 128 256 L 128 156 C 128 211.228 83.228 256 28 256 L 0 256 L 0 0 L 256 0 L 256 28 C 256 83.228 211.228 128 156 128 L 256 128 Z",
  // Shape 30: Swirl Vortex
  "M 191.173 128.005 C 156.208 128.448 128 156.93 128 192 C 128 227.346 156.654 256 192 256 L 256 256 L 256 216 L 192 216 C 178.745 216 168 205.255 168 192 C 168 178.745 178.745 168 192 168 L 256 168 L 256 88 L 192 88 C 178.745 88 168 77.255 168 64 C 168 50.745 178.745 40 192 40 L 256 40 L 256 0 L 192 0 C 156.654 0 128 28.654 128 64 C 128 99.346 156.654 128 192 128 Z M 0 40 L 64 40 C 77.255 40 88 50.745 88 64 C 88 77.255 77.255 88 64 88 L 0 88 L 0 168 L 64 168 C 77.255 168 88 178.745 88 192 C 88 205.255 77.255 216 64 216 L 0 216 L 0 256 L 64 256 C 99.346 256 128 227.346 128 192 C 128 156.93 99.792 128.448 64.827 128.005 L 64 128 C 99.346 128 128 99.346 128 64 C 128 28.654 99.346 0 64 0 L 0 0 Z"
];

// Fluid deceleration curve for compositor-level transitions
const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

// Hardware acceleration style snippet for locked 60/120fps compositor execution
const GPU_LAYER = {
  willChange: "transform, opacity",
  transform: "translate3d(0, 0, 0)",
  WebkitTransform: "translate3d(0, 0, 0)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

function AnimatedShapeIcon({ className }: { className?: string }) {
  const [shapeIndex, setShapeIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const rawId = useId();
  const gradientId = `shape-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Start periodic morphing and rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % CURATED_SHAPE_PATHS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const pathD = CURATED_SHAPE_PATHS[shapeIndex];

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShapeIndex((prev) => (prev + 1) % CURATED_SHAPE_PATHS.length)}
      title="Click to cycle shape"
    >
      {/* Continuously Rotating Vector Gyroscope via GPU-composited CSS animation */}
      <div
        className="w-full h-full relative flex items-center justify-center"
        style={{
          ...GPU_LAYER,
          animation: isHovered
            ? "spin 6s linear infinite"
            : "spin 12s linear infinite",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={shapeIndex}
            initial={{ opacity: 0, scale: 0.75, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.12, rotate: 20 }}
            transition={{
              duration: 0.28,
              ease: SMOOTH_EASE,
            }}
            className="w-full h-full absolute inset-0 flex items-center justify-center"
            style={GPU_LAYER}
          >
            <svg
              viewBox="0 0 256 256"
              className="w-full h-full overflow-visible transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient
                  id={`${gradientId}-${shapeIndex}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#37e5a5" />
                  <stop offset="45%" stopColor="#27bf88" />
                  <stop offset="100%" stopColor="#148356" />
                </linearGradient>
              </defs>
              <path
                d={pathD}
                fill={`url(#${gradientId}-${shapeIndex})`}
                className="transition-all duration-300"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Hero({ isReady = true }: { isReady?: boolean }) {
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ambientGlowRef.current) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
        ambientGlowRef.current.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const activeMobile = mounted && isMobile;

  return (
    <div className="w-full px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4">
      <section
        id="home"
        aria-label="Hero"
        className="relative w-full min-h-[100dvh] md:portrait:min-h-0 lg:portrait:min-h-0 lg:landscape:min-h-[calc(100vh-1rem)] text-white flex flex-col justify-start overflow-hidden pt-28 sm:pt-32 md:pt-16 pb-12 md:portrait:pb-20 lg:portrait:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 select-none rounded-[24px] sm:rounded-[32px] md:rounded-[36px] lg:rounded-[40px] shadow-2xl bg-black z-10"
      >
        {/* ===== GRAINIENT WEBGL ANIMATED BACKGROUND (HARDWARE OPTIMIZED) ===== */}
        <div className="absolute inset-0 h-full w-full pointer-events-none -z-10 opacity-40">
          <Grainient
            color1="#175b43"
            color2="#0b3023"
            color3="#020e08"
            timeSpeed={activeMobile ? 0.9 : 1.1}
            colorBalance={0.35}
            warpStrength={activeMobile ? 2.2 : 2.6}
            warpFrequency={activeMobile ? 4.5 : 5.2}
            warpSpeed={activeMobile ? 1.6 : 1.8}
            warpAmplitude={30.0}
            blendAngle={60.0}
            blendSoftness={0.45}
            rotationAmount={activeMobile ? 280.0 : 320.0}
            noiseScale={2.6}
            grainAmount={activeMobile ? 0.05 : 0.1}
            grainScale={1.5}
            grainAnimated={!activeMobile}
            contrast={1.1}
            gamma={1.1}
            saturation={0.75}
            centerX={0.0}
            centerY={0.1}
            zoom={1.0}
          />
        </div>

        {/* ===== HARDWARE-NATIVE AMBIENT LIGHT (NO HEAVY GAUSSIAN BLURS) ===== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5 flex justify-center items-center">
          {/* Central Ambient Glow Bowl */}
          <div
            ref={ambientGlowRef}
            className="w-[160vw] sm:w-[120vw] max-w-[1400px] h-[700px] sm:h-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(55,229,165,0.14)_0%,_rgba(55,229,165,0.04)_45%,_transparent_72%)] transition-transform duration-500 ease-out"
            style={{
              transform: "translate3d(0, 0, 0)",
              willChange: "transform",
            }}
          />

          {/* Left Ambient Glow */}
          <div className="absolute top-1/4 left-[-15%] sm:left-[0%] w-[320px] sm:w-[500px] h-[450px] sm:h-[600px] bg-[radial-gradient(circle,_rgba(55,229,165,0.08)_0%,_rgba(55,229,165,0.02)_45%,_transparent_70%)] pointer-events-none" />

          {/* Right Ambient Glow */}
          <div className="absolute bottom-10 right-[-15%] sm:right-[0%] w-[320px] sm:w-[500px] h-[450px] sm:h-[600px] bg-[radial-gradient(circle,_rgba(55,229,165,0.08)_0%,_rgba(55,229,165,0.02)_45%,_transparent_70%)] pointer-events-none" />
        </div>

        {/* Accessible Main Heading for Search Engines & Screen Readers */}
        <h1 className="sr-only">
          Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer
        </h1>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
          
          {/* 1. TOP SCRIPT TITLE: "Hey, there" */}
          <div className="relative w-full pointer-events-none pt-2 sm:pt-4 z-0 flex justify-center">
            {/* Desktop Script Title (PC / Laptops in Landscape >= lg) */}
            <div aria-hidden="true" className="hidden lg:landscape:flex font-script italic text-[7.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10.5rem] text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm items-center justify-center gap-24 lg:gap-32 mx-auto">
              <span className="inline-flex overflow-hidden pb-4 -mb-4 pt-1">
                <span
                  style={GPU_LAYER}
                  className={`text-[#27bf88] inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Hey,
                </span>
              </span>
              <span className="inline-flex overflow-hidden pb-4 -mb-4 pt-1">
                <span
                  style={GPU_LAYER}
                  className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  there
                </span>
              </span>
            </div>

            {/* iPad / Tablet Script Title (iPad Mini, iPad Air, iPad Pro) */}
            <div aria-hidden="true" className="hidden md:flex lg:landscape:hidden font-script italic text-7xl md:text-8xl lg:text-9xl text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm items-center justify-center gap-12 mx-auto translate-y-6 md:translate-y-8 lg:portrait:translate-y-10">
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <span
                  style={GPU_LAYER}
                  className={`text-[#27bf88] inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Hey,
                </span>
              </span>
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <span
                  style={GPU_LAYER}
                  className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  there
                </span>
              </span>
            </div>

            {/* Mobile Script Title (< md - Phones) */}
            <div aria-hidden="true" className="block md:hidden font-script italic text-7xl sm:text-8xl text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm text-center">
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <span
                  style={GPU_LAYER}
                  className={`text-[#27bf88] inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  Hey,
                </span>
              </span>{" "}
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <span
                  style={GPU_LAYER}
                  className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 ${
                    isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                  }`}
                >
                  there
                </span>
              </span>
            </div>
          </div>

          {/* 2. MIDDLE SECTION: Desktop Grid vs iPad Tablet vs Mobile Layout */}
          
          {/* DESKTOP LAYOUT (PC & Laptops in Landscape) */}
          <div className="hidden lg:landscape:grid relative w-full grid-cols-12 items-end my-auto z-10 gap-0 -mt-20 lg:-mt-32">
            
            {/* Left Column: "I'm Shahid" */}
            <div className="col-span-3 flex flex-col justify-center items-start z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
              <div className="text-left select-none">
                <div className="overflow-hidden pb-1">
                  <span
                    style={GPU_LAYER}
                    className={`block text-xl lg:text-2xl xl:text-3xl font-jakarta font-light tracking-[0.25em] bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-none uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    I'm
                  </span>
                </div>
                <div className="overflow-hidden pb-2 -mb-2">
                  <span
                    style={GPU_LAYER}
                    className={`block text-7xl lg:text-[5.5rem] xl:text-[7.5rem] font-jakarta font-medium tracking-tight bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-[1.1] uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    Shahid
                  </span>
                </div>
              </div>
            </div>

            {/* Center Column: Cutout Portrait Photo */}
            <div
              style={GPU_LAYER}
              className={`col-span-6 flex justify-center items-end relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isReady ? "translate-y-0 opacity-100" : "translate-y-[140px] opacity-0"
              }`}
            >
              <div className="relative w-full max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] flex justify-center items-end group">
                <ParticleImage
                  src="/me.webp"
                  alt="Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer"
                  className="w-full h-auto max-h-[76vh] lg:max-h-[84vh]"
                  isReady={isReady}
                />
              </div>
            </div>

            {/* Right Column: Bio Paragraph + Animated Shape + Frontend Developer */}
            <div className="col-span-3 flex flex-col justify-center items-end z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
              <div
                style={GPU_LAYER}
                className={`flex items-center justify-end gap-2.5 sm:gap-3 flex-wrap transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                  isReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <HeroCtaButton text="Let's Talk" href="#contact" variant="white" />
                <HeroCtaButton text="Resume" href="/resume.pdf" download="Mohamed-Abdul-Shahid-CV.pdf" variant="black" icon="download" />
              </div>

              <div className="flex items-center justify-end gap-3 lg:gap-4 select-none">
                <div
                  style={GPU_LAYER}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                    isReady ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-3 opacity-0"
                  }`}
                >
                  <AnimatedShapeIcon className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 shrink-0" />
                </div>

                <div className="w-[185px] sm:w-[245px] lg:w-[290px] xl:w-[365px] flex flex-col justify-center gap-0.5">
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl sm:text-3xl lg:text-[2.5rem] xl:text-[3.2rem] font-jakarta font-medium bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                        isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>F</span><span>R</span><span>O</span><span>N</span><span>T</span><span>E</span><span>N</span><span>D</span>
                    </div>
                  </div>
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl sm:text-3xl lg:text-[2.5rem] xl:text-[3.2rem] font-jakarta font-thin bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                        isReady ? "translate-y-0 opacity-50" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>D</span><span>E</span><span>V</span><span>E</span><span>L</span><span>O</span><span>P</span><span>E</span><span>R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* DEDICATED IPAD & TABLET LAYOUT (iPad Mini, iPad Air, iPad Pro) */}
          <div className="hidden md:flex lg:landscape:hidden flex-col items-center w-full my-auto z-20 pt-0 pb-6 -mt-6">
            
            {/* Center Portrait Image */}
            <div
              style={GPU_LAYER}
              className={`relative w-full max-w-[420px] md:max-w-[460px] flex justify-center items-end py-0 z-10 -mb-2 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isReady ? "translate-y-0 opacity-100" : "translate-y-[100px] opacity-0"
              }`}
            >
              <ParticleImage
                src="/me.webp"
                alt="Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer"
                className="w-full h-auto max-h-[46vh] md:max-h-[50vh]"
                isReady={isReady}
              />
            </div>

            {/* iPad Headlines Stack */}
            <div className="w-full flex flex-col items-center justify-center space-y-4 md:space-y-5 z-20 -mt-20 md:-mt-24 relative pointer-events-none">
              <div className="text-center select-none flex flex-col items-center">
                <div className="overflow-hidden pb-1">
                  <span
                    style={GPU_LAYER}
                    className={`block text-xl md:text-2xl font-jakarta font-light tracking-[0.25em] bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-none uppercase drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    I'm
                  </span>
                </div>
                <div className="overflow-hidden pb-1">
                  <span
                    style={GPU_LAYER}
                    className={`block text-7xl md:text-8xl font-jakarta font-medium tracking-tight bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-[1.1] uppercase drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    Shahid
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 select-none">
                <div
                  style={GPU_LAYER}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                    isReady ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-3 opacity-0"
                  }`}
                >
                  <AnimatedShapeIcon className="w-12 h-12 md:w-14 md:h-14 shrink-0" />
                </div>
                <div className="w-[230px] md:w-[270px] flex flex-col justify-center gap-0.5">
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl md:text-3xl font-jakarta font-medium bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                        isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>F</span><span>R</span><span>O</span><span>N</span><span>T</span><span>E</span><span>N</span><span>D</span>
                    </div>
                  </div>
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl md:text-3xl font-jakarta font-thin bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                        isReady ? "translate-y-0 opacity-35" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>D</span><span>E</span><span>V</span><span>E</span><span>L</span><span>O</span><span>P</span><span>E</span><span>R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* iPad Bio CTA Button */}
            <div
              style={GPU_LAYER}
              className={`mt-6 relative z-20 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <HeroCtaButton text="Let's Talk" href="#contact" variant="white" />
              <HeroCtaButton text="Resume" href="/resume.pdf" download="Mohamed-Abdul-Shahid-CV.pdf" variant="black" icon="download" />
            </div>
          </div>

          {/* MOBILE LAYOUT (< md - Phones) */}
          <div className="flex md:hidden flex-col items-center w-full my-auto z-20 pt-0 pb-8 -mt-6 sm:-mt-8">
            
            {/* Center Portrait Image */}
            <div
              style={GPU_LAYER}
              className={`relative w-full max-w-[370px] sm:max-w-[450px] flex justify-center items-end py-0 z-10 -mb-2 -translate-y-1 sm:-translate-y-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isReady ? "translate-y-0 opacity-100" : "translate-y-[100px] opacity-0"
              }`}
            >
              <ParticleImage
                src="/me.webp"
                alt="Mohamed Abdul Shahid — Frontend Developer & UI/UX Designer"
                className="w-full h-auto max-h-[52vh] sm:max-h-[62vh]"
                isReady={isReady}
              />
            </div>

            {/* Mobile Headlines Stack */}
            <div className="w-full flex flex-col items-center justify-center space-y-4 z-20 -mt-20 sm:-mt-28 relative pointer-events-none">
              <div className="text-center select-none flex flex-col items-center">
                <div className="overflow-hidden pb-1">
                  <span
                    style={GPU_LAYER}
                    className={`block text-xl sm:text-2xl font-jakarta font-light tracking-[0.25em] bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-none uppercase drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    I'm
                  </span>
                </div>
                <div className="overflow-hidden pb-1">
                  <span
                    style={GPU_LAYER}
                    className={`block text-7xl sm:text-7xl font-jakarta font-medium tracking-tight bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-[1.1] uppercase drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                      isReady ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
                    }`}
                  >
                    Shahid
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3 select-none">
                <div
                  style={GPU_LAYER}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                    isReady ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-3 opacity-0"
                  }`}
                >
                  <AnimatedShapeIcon className="w-10 h-10 sm:w-14 sm:h-14 shrink-0" />
                </div>
                <div className="w-[195px] sm:w-[250px] flex flex-col justify-center gap-0.5">
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl sm:text-3xl font-jakarta font-medium bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${
                        isReady ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>F</span><span>R</span><span>O</span><span>N</span><span>T</span><span>E</span><span>N</span><span>D</span>
                    </div>
                  </div>
                  <div className="overflow-hidden py-0.5">
                    <div
                      style={GPU_LAYER}
                      className={`flex justify-between w-full text-2xl sm:text-3xl font-jakarta font-thin bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                        isReady ? "translate-y-0 opacity-35" : "translate-y-[115%] opacity-0"
                      }`}
                    >
                      <span>D</span><span>E</span><span>V</span><span>E</span><span>L</span><span>O</span><span>P</span><span>E</span><span>R</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio CTA Button */}
            <div
              style={GPU_LAYER}
              className={`mt-10 sm:mt-12 relative z-20 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <HeroCtaButton text="Let's Talk" href="#contact" variant="white" />
              <HeroCtaButton text="Resume" href="/resume.pdf" download="Mohamed-Abdul-Shahid-CV.pdf" variant="black" icon="download" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
