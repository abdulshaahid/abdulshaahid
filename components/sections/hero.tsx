"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import Grainient from "@/components/ui/grainient";

const AVAILABLE_SHAPES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60,
  61, 62, 63, 65, 67, 70, 71
];

const GRAIN_NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`;

// Ultra-smooth Apple-grade fluid exponential deceleration curve
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

// Hardware acceleration style snippet for locked 60/120fps compositor execution
const GPU_LAYER = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  WebkitTransform: "translateZ(0)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

function AnimatedShapeIcon({ className }: { className?: string }) {
  const [shapeIndex, setShapeIndex] = useState(0);

  // Preload initial shapes immediately, lazily load the rest in background
  useEffect(() => {
    [1, 2, 3, 4, 5].forEach((num) => {
      const img = new window.Image();
      img.src = `/shapes/Shape%20${num}.svg`;
    });

    const timer = setTimeout(() => {
      AVAILABLE_SHAPES.slice(5).forEach((num) => {
        const img = new window.Image();
        img.src = `/shapes/Shape%20${num}.svg`;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Delay continuous shape morphing until 1.4s after mount so entrance is 100% thread-free
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setShapeIndex((prev) => (prev + 1) % AVAILABLE_SHAPES.length);
      }, 280);
      return () => clearInterval(interval);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const shapeNumber = AVAILABLE_SHAPES[shapeIndex];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Instant Cut Shape Mask with Emerald Gradient and Grain Texture */}
      <div className="w-full h-full relative flex items-center justify-center">
        <div
          style={{
            maskImage: `url("/shapes/Shape%20${shapeNumber}.svg")`,
            WebkitMaskImage: `url("/shapes/Shape%20${shapeNumber}.svg")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            transform: "translateZ(0)",
          }}
          className="w-full h-full bg-gradient-to-br from-[#37e5a5] via-[#27bf88] to-[#1ea873] relative overflow-hidden"
        >
          {/* Tactile Grain Texture Layer */}
          <div
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none contrast-150 brightness-110"
            style={{ backgroundImage: GRAIN_NOISE_SVG }}
          />
        </div>
      </div>
    </div>
  );
}

export function Hero({ isReady = true }: { isReady?: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Passive mouse move listener with RAF throttling for 0 overhead
    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        setMousePosition({
          x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
          y: (e.clientY - innerHeight / 2) / (innerHeight / 2),
        });
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const activeMobile = mounted && isMobile;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4"
    >
      <section
        id="home"
        aria-label="Hero"
        className="relative w-full min-h-[calc(100svh-1rem)] text-white flex flex-col justify-start overflow-hidden pt-28 sm:pt-32 md:pt-16 pb-12 px-4 sm:px-6 md:px-12 lg:px-16 select-none rounded-[24px] sm:rounded-[32px] md:rounded-[36px] lg:rounded-[40px] shadow-2xl bg-black z-10"
      >
        {/* ===== GRAINIENT WEBGL ANIMATED BACKGROUND (HARDWARE OPTIMIZED) ===== */}
        <div className="absolute inset-0 h-full w-full pointer-events-none -z-10 opacity-40">
          <Grainient
            color1="#175b43"
            color2="#0b3023"
            color3="#020e08"
            timeSpeed={activeMobile ? 1.4 : 1.2}
            colorBalance={0.35}
            warpStrength={activeMobile ? 3.1 : 2.8}
            warpFrequency={activeMobile ? 5.8 : 5.5}
            warpSpeed={activeMobile ? 2.2 : 2.0}
            warpAmplitude={35.0}
            blendAngle={60.0}
            blendSoftness={0.45}
            rotationAmount={activeMobile ? 380.0 : 350.0}
            noiseScale={activeMobile ? 3.1 : 3.0}
            grainAmount={0.12}
            grainScale={1.5}
            grainAnimated={true}
            contrast={1.1}
            gamma={1.1}
            saturation={0.75}
            centerX={0.0}
            centerY={0.1}
            zoom={1.0}
          />
        </div>

        {/* ===== PURE CSS BALANCED AMBIENT LIGHT BACKDROP OVERLAY ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none overflow-hidden -z-5 flex justify-center items-center"
        >
          {/* Central Full-Span Ambient Glow Bowl with 3D GPU Transform */}
          <div
            className="w-[180vw] sm:w-[130vw] max-w-[1500px] h-[800px] sm:h-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#37e5a5]/14 sm:from-[#37e5a5]/18 via-[#37e5a5]/4 to-transparent blur-3xl transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${mousePosition.x * 15}px, ${mousePosition.y * 10}px, 0)`,
              willChange: "transform",
            }}
          />

          {/* Left Ambient Glow */}
          <div className="absolute top-1/4 left-[-20%] sm:left-[0%] w-[350px] sm:w-[600px] h-[500px] sm:h-[700px] bg-gradient-to-br from-[#37e5a5]/10 via-[#37e5a5]/3 to-transparent rounded-full blur-[120px]" />

          {/* Right Ambient Glow */}
          <div className="absolute bottom-10 right-[-20%] sm:right-[0%] w-[350px] sm:w-[600px] h-[500px] sm:h-[700px] bg-gradient-to-bl from-[#37e5a5]/10 via-[#37e5a5]/3 to-transparent rounded-full blur-[120px]" />
        </motion.div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
          
          {/* 1. TOP SCRIPT TITLE: "Hey, there" with Fade-in & Masked Split Reveal */}
          <div className="relative w-full pointer-events-none pt-2 sm:pt-4 z-0 flex justify-center">
            {/* Desktop Version */}
            <h1 className="hidden md:flex font-script italic text-[7.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10.5rem] text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm items-center justify-center gap-24 lg:gap-32 mx-auto">
              <span className="inline-flex overflow-hidden pb-4 -mb-4 pt-1">
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                  transition={{
                    y: { duration: 1.05, ease: SMOOTH_EASE, delay: 0.05 },
                    opacity: { duration: 0.75, ease: "easeOut", delay: 0.05 },
                  }}
                  style={GPU_LAYER}
                  className="text-[#27bf88] inline-block"
                >
                  Hey,
                </motion.span>
              </span>
              <span className="inline-flex overflow-hidden pb-4 -mb-4 pt-1">
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                  transition={{
                    y: { duration: 1.05, ease: SMOOTH_EASE, delay: 0.12 },
                    opacity: { duration: 0.75, ease: "easeOut", delay: 0.12 },
                  }}
                  style={GPU_LAYER}
                  className="inline-block"
                >
                  there
                </motion.span>
              </span>
            </h1>

            {/* Mobile Version */}
            <h1 className="block md:hidden font-script italic text-7xl sm:text-8xl text-zinc-100/90 leading-none font-thin tracking-wide drop-shadow-sm text-center">
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                  transition={{
                    y: { duration: 0.95, ease: SMOOTH_EASE, delay: 0.05 },
                    opacity: { duration: 0.7, ease: "easeOut", delay: 0.05 },
                  }}
                  style={GPU_LAYER}
                  className="text-[#27bf88] inline-block"
                >
                  Hey,
                </motion.span>
              </span>{" "}
              <span className="inline-flex overflow-hidden pb-2 -mb-2">
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                  transition={{
                    y: { duration: 0.95, ease: SMOOTH_EASE, delay: 0.12 },
                    opacity: { duration: 0.7, ease: "easeOut", delay: 0.12 },
                  }}
                  style={GPU_LAYER}
                  className="inline-block"
                >
                  there
                </motion.span>
              </span>
            </h1>
          </div>

          {/* 2. MIDDLE & WAIST SECTION: Desktop Grid vs Mobile Layout */}
          
          {/* DESKTOP LAYOUT (md:grid) */}
          <div className="hidden md:grid relative w-full grid-cols-12 items-end my-auto z-10 gap-0 -mt-20 lg:-mt-32">
            
            {/* Left Column: Fade-In & Masked Reveal for "I'm Shahid" */}
            <div className="col-span-3 flex flex-col justify-center items-start z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
              <div className="text-left select-none">
                <div className="overflow-hidden pb-1">
                  <motion.span
                    initial={{ y: "120%", opacity: 0 }}
                    animate={isReady ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
                    transition={{
                      y: { duration: 1.0, ease: SMOOTH_EASE, delay: 0.15 },
                      opacity: { duration: 0.7, ease: "easeOut", delay: 0.15 },
                    }}
                    style={GPU_LAYER}
                    className="block text-xl lg:text-2xl xl:text-3xl font-jakarta font-light tracking-[0.25em] bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-none uppercase"
                  >
                    I'm
                  </motion.span>
                </div>
                <div className="overflow-hidden pb-2 -mb-2">
                  <motion.span
                    initial={{ y: "120%", opacity: 0 }}
                    animate={isReady ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
                    transition={{
                      y: { duration: 1.1, ease: SMOOTH_EASE, delay: 0.22 },
                      opacity: { duration: 0.7, ease: "easeOut", delay: 0.22 },
                    }}
                    style={GPU_LAYER}
                    className="block text-7xl lg:text-[5.5rem] xl:text-[7.5rem] font-jakarta font-medium tracking-tight bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-[1.1] uppercase"
                  >
                    Shahid
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Center Column: Cutout Portrait Photo - QUICK FADE-IN & DEEP BOTTOM SLIDE */}
            <motion.div
              initial={{ y: 220, opacity: 0 }}
              animate={isReady ? { y: 0, opacity: 1 } : { y: 220, opacity: 0 }}
              transition={{
                y: { duration: 1.35, ease: SMOOTH_EASE, delay: 0.04 },
                opacity: { duration: 0.25, ease: "easeOut", delay: 0.04 },
              }}
              style={GPU_LAYER}
              className="col-span-6 flex justify-center items-end relative z-10"
            >
              <div className="relative w-full max-w-[480px] lg:max-w-[580px] xl:max-w-[660px] flex justify-center items-end group">
                <Image
                  src="/me.webp"
                  alt="Mohamed Abdul Shahid"
                  width={750}
                  height={900}
                  priority
                  style={{
                    maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                    transform: "translateZ(0)",
                  }}
                  className="w-full h-auto max-h-[76vh] lg:max-h-[84vh] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </motion.div>

            {/* Right Column: Bio Paragraph + Animated Shape + Frontend Developer */}
            <div className="col-span-3 flex flex-col justify-center items-end z-20 space-y-8 pb-12 lg:pb-16 -translate-y-4 lg:-translate-y-8">
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.95, ease: SMOOTH_EASE, delay: 0.22 }}
                style={GPU_LAYER}
                className="text-xs sm:text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-[220px] lg:max-w-[260px] text-right"
              >
                Specialized in Web Design, UX / UI, Webflow, and Front End Development.
              </motion.p>

              <div className="flex items-center justify-end gap-3 lg:gap-4 select-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={isReady ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 15 }}
                  transition={{ duration: 0.9, ease: SMOOTH_EASE, delay: 0.26 }}
                  style={GPU_LAYER}
                >
                  <AnimatedShapeIcon className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 shrink-0" />
                </motion.div>

                <div className="w-[185px] sm:w-[245px] lg:w-[290px] xl:w-[365px] flex flex-col justify-center gap-0.5">
                  <div className="overflow-hidden py-0.5">
                    <motion.div
                      initial={{ y: "115%", opacity: 0 }}
                      animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                      transition={{
                        y: { duration: 1.0, ease: SMOOTH_EASE, delay: 0.25 },
                        opacity: { duration: 0.7, ease: "easeOut", delay: 0.25 },
                      }}
                      style={GPU_LAYER}
                      className="flex justify-between w-full text-2xl sm:text-3xl lg:text-[2.5rem] xl:text-[3.2rem] font-jakarta font-medium bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none"
                    >
                      <span>F</span><span>R</span><span>O</span><span>N</span><span>T</span><span>E</span><span>N</span><span>D</span>
                    </motion.div>
                  </div>
                  <div className="overflow-hidden py-0.5">
                    <motion.div
                      initial={{ y: "115%", opacity: 0 }}
                      animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                      transition={{
                        y: { duration: 1.0, ease: SMOOTH_EASE, delay: 0.3 },
                        opacity: { duration: 0.7, ease: "easeOut", delay: 0.3 },
                      }}
                      style={GPU_LAYER}
                      className="flex justify-between w-full text-2xl sm:text-3xl lg:text-[2.5rem] xl:text-[3.2rem] font-jakarta font-thin bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none opacity-50"
                    >
                      <span>D</span><span>E</span><span>V</span><span>E</span><span>L</span><span>O</span><span>P</span><span>E</span><span>R</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* MOBILE LAYOUT (< md) */}
          <div className="flex md:hidden flex-col items-center w-full my-auto z-20 pt-0 pb-8 -mt-6 sm:-mt-8">
            
            {/* Center Portrait Image - QUICK FADE-IN & DEEP BOTTOM SLIDE */}
            <motion.div
              initial={{ y: 160, opacity: 0 }}
              animate={isReady ? { y: 0, opacity: 1 } : { y: 160, opacity: 0 }}
              transition={{
                y: { duration: 1.25, ease: SMOOTH_EASE, delay: 0.04 },
                opacity: { duration: 0.25, ease: "easeOut", delay: 0.04 },
              }}
              style={GPU_LAYER}
              className="relative w-full max-w-[370px] sm:max-w-[450px] flex justify-center items-end py-0 z-10 -mb-2 -translate-y-1 sm:-translate-y-1"
            >
              <Image
                src="/me.webp"
                alt="Mohamed Abdul Shahid"
                width={500}
                height={600}
                priority
                style={{
                  maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                  transform: "translateZ(0)",
                }}
                className="w-full h-auto max-h-[52vh] sm:max-h-[62vh] object-contain"
              />
            </motion.div>

            {/* Mobile Headlines Stack */}
            <div className="w-full flex flex-col items-center justify-center space-y-4 z-20 -mt-20 sm:-mt-28 relative pointer-events-none">
              <div className="text-center select-none flex flex-col items-center">
                <div className="overflow-hidden pb-1">
                  <motion.span
                    initial={{ y: "120%", opacity: 0 }}
                    animate={isReady ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
                    transition={{
                      y: { duration: 0.95, ease: SMOOTH_EASE, delay: 0.15 },
                      opacity: { duration: 0.7, ease: "easeOut", delay: 0.15 },
                    }}
                    style={GPU_LAYER}
                    className="block text-xl sm:text-2xl font-jakarta font-light tracking-[0.25em] bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-none uppercase drop-shadow-md"
                  >
                    I'm
                  </motion.span>
                </div>
                <div className="overflow-hidden pb-1">
                  <motion.span
                    initial={{ y: "120%", opacity: 0 }}
                    animate={isReady ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
                    transition={{
                      y: { duration: 1.05, ease: SMOOTH_EASE, delay: 0.22 },
                      opacity: { duration: 0.7, ease: "easeOut", delay: 0.22 },
                    }}
                    style={GPU_LAYER}
                    className="block text-7xl sm:text-7xl font-jakarta font-medium tracking-tight bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent leading-[1.1] uppercase drop-shadow-md"
                  >
                    Shahid
                  </motion.span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3 select-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={isReady ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 15 }}
                  transition={{ duration: 0.85, ease: SMOOTH_EASE, delay: 0.26 }}
                  style={GPU_LAYER}
                >
                  <AnimatedShapeIcon className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md shrink-0" />
                </motion.div>
                <div className="w-[195px] sm:w-[250px] flex flex-col justify-center gap-0.5">
                  <div className="overflow-hidden py-0.5">
                    <motion.div
                      initial={{ y: "115%", opacity: 0 }}
                      animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                      transition={{
                        y: { duration: 0.95, ease: SMOOTH_EASE, delay: 0.25 },
                        opacity: { duration: 0.7, ease: "easeOut", delay: 0.25 },
                      }}
                      style={GPU_LAYER}
                      className="flex justify-between w-full text-2xl sm:text-3xl font-jakarta font-medium bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md"
                    >
                      <span>F</span><span>R</span><span>O</span><span>N</span><span>T</span><span>E</span><span>N</span><span>D</span>
                    </motion.div>
                  </div>
                  <div className="overflow-hidden py-0.5">
                    <motion.div
                      initial={{ y: "115%", opacity: 0 }}
                      animate={isReady ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                      transition={{
                        y: { duration: 0.95, ease: SMOOTH_EASE, delay: 0.3 },
                        opacity: { duration: 0.7, ease: "easeOut", delay: 0.3 },
                      }}
                      style={GPU_LAYER}
                      className="flex justify-between w-full text-2xl sm:text-3xl font-jakarta font-thin bg-gradient-to-r from-[#37e5a5] to-[#27bf88] bg-clip-text text-transparent uppercase leading-none drop-shadow-md opacity-50"
                    >
                      <span>D</span><span>E</span><span>V</span><span>E</span><span>L</span><span>O</span><span>P</span><span>E</span><span>R</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Text Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.9, ease: SMOOTH_EASE, delay: 0.34 }}
              style={GPU_LAYER}
              className="text-sm text-zinc-400 font-normal text-center max-w-[300px] px-4 mt-6 sm:mt-8 relative z-20"
            >
              Specialized in Web Design, UX / UI, Webflow, and Front End Development.
            </motion.p>
          </div>

        </div>
      </section>
    </motion.div>
  );
}
