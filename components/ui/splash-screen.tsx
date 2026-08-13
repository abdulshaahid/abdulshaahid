"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
// Hard safety net: if something stalls (slow network, a hung "load" event),
// never let the splash block the app past this.
const MAX_WAIT_MS = 4000;
const EXIT_DELAY_MS = 280;

interface SplashScreenProps {
  onComplete: () => void;
}

// Preloads and decodes an image off the paint path. Always resolves —
// a failed/missing asset should never be able to hang the splash.
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = src;
    if (img.decode) {
      img.decode().then(() => resolve()).catch(() => resolve());
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Progress lives entirely outside React state. It's mutated on a ref and
  // painted straight to the DOM via requestAnimationFrame, so loading
  // never triggers a re-render of this component — only the final
  // isVisible flip does.
  const barRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0.1);
  const displayedProgress = useRef(0.1);
  const rafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Eases the visible bar toward whatever the real target is. Runs on the
  // compositor via `transform: scaleX(...)`, never `width`, so it can't
  // trigger layout/reflow — just paint, at a steady 60fps+ regardless of
  // how chunky or irregular the underlying loading events are.
  const tick = useCallback(() => {
    const current = displayedProgress.current;
    const target = targetProgress.current;
    const next = reducedMotion.current ? target : current + (target - current) * 0.18;
    displayedProgress.current = Math.abs(target - next) < 0.001 ? target : next;

    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${displayedProgress.current})`;
    }

    rafId.current = displayedProgress.current < 1 ? requestAnimationFrame(tick) : null;
  }, []);

  const bumpProgress = useCallback(
    (value: number) => {
      targetProgress.current = Math.max(targetProgress.current, value);
      if (rafId.current === null) rafId.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  useEffect(() => {
    let isMounted = true;
    let settled = false;

    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

    function finishSplash() {
      if (!isMounted || settled) return;
      settled = true;
      bumpProgress(1);

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (!isMounted) return;
          setIsVisible(false);
          onCompleteRef.current?.();
        }, EXIT_DELAY_MS);
      });
    }

    async function loadAllAssets() {
      const safety = setTimeout(finishSplash, MAX_WAIT_MS);

      try {
        const fontsReady =
          typeof document !== "undefined" && document.fonts
            ? document.fonts.ready
            : Promise.resolve();

        const windowLoaded = new Promise<void>((resolve) => {
          if (document.readyState === "complete") {
            resolve();
          } else {
            window.addEventListener("load", () => resolve(), { once: true });
          }
        });

        const shapeSrcs = [1, 2, 3, 4, 5].map((n) => `/shapes/Shape%20${n}.svg`);

        // Everything fires in parallel instead of a sequential waterfall —
        // total wait becomes the SLOWEST asset, not the sum of all of them.
        // Each task nudges the shared progress target as it resolves; the
        // rAF loop above smooths the visible bar between those nudges.
        await Promise.all([
          fontsReady.then(() => bumpProgress(0.3)),
          preloadImage("/head.webp").then(() => bumpProgress(0.55)),
          preloadImage("/me.png").then(() => bumpProgress(0.8)),
          Promise.all(shapeSrcs.map(preloadImage)).then(() => bumpProgress(0.92)),
          windowLoaded.then(() => bumpProgress(0.95)),
        ]);

        clearTimeout(safety);
        finishSplash();
      } catch {
        clearTimeout(safety);
        finishSplash();
      }
    }

    loadAllAssets();

    return () => {
      isMounted = false;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [bumpProgress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.55, ease: SMOOTH_EASE },
          }}
          style={{ willChange: "opacity, transform" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black select-none pointer-events-auto"
        >
          {/* Main Visual: Center Head Cutout (Present Immediately from Frame 0) */}
          <div className="relative flex items-center justify-center">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="relative w-28 h-32 sm:w-32 sm:h-36 md:w-36 md:h-40 drop-shadow-2xl">
                <Image
                  src="/head.webp"
                  alt="Mohamed Abdul Shahid"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Minimal Solid White Progress Bar Underneath */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
            <div className="w-36 sm:w-44 h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
              <div
                ref={barRef}
                className="h-full w-full bg-white rounded-full origin-left"
                style={{ transform: "scaleX(0.1)", willChange: "transform" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}