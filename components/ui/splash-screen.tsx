"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGlobalImage } from "@/components/ui/particle-image";

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
// Hard safety net: if something stalls (e.g. extreme slow network / offline),
// never let the splash block the app past this.
const MAX_WAIT_MS = 6000;
const EXIT_DELAY_MS = 140;

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Progress lives entirely outside React state. It's mutated on a ref and
  // painted straight to the DOM via requestAnimationFrame, so loading
  // never triggers a re-render of this component — only the final
  // isVisible flip does.
  const barRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0.15);
  const displayedProgress = useRef(0.15);
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

    rafId.current = displayedProgress.current < 0.999 ? requestAnimationFrame(tick) : null;
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
        bumpProgress(0.2);

        // Preload /head.webp (splash screen visual)
        const headPromise = getGlobalImage("/head.webp")
          .then(() => {
            if (isMounted) bumpProgress(0.45);
          })
          .catch(() => {});

        // Preload fonts so hero text displays without layout shift
        const fontsPromise = (
          typeof document !== "undefined" && document.fonts
            ? document.fonts.ready
            : Promise.resolve()
        )
          .then(() => {
            if (isMounted) bumpProgress(0.7);
          })
          .catch(() => {});

        // Preload /me.webp (hero portrait photo)
        const mePromise = getGlobalImage("/me.webp")
          .then(() => {
            if (isMounted) bumpProgress(0.95);
          })
          .catch(() => {});

        // Wait for all critical assets to resolve and decode
        await Promise.allSettled([headPromise, fontsPromise, mePromise]);

        // Let next animation frames settle so particle grid and canvas can initialize
        if (typeof window !== "undefined") {
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          );
        }

        if (!isMounted) return;
        bumpProgress(1);
        clearTimeout(safety);
        setTimeout(finishSplash, 100);
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
            scale: 1.01,
            transition: { duration: 0.35, ease: SMOOTH_EASE },
          }}
          style={{ willChange: "opacity, transform" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black select-none pointer-events-auto"
        >
          {/* Main Visual: Center Head Cutout (Present Immediately from Frame 0) */}
          <div className="relative flex items-center justify-center">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="relative w-28 h-32 sm:w-32 sm:h-36 md:w-36 md:h-40 drop-shadow-2xl flex items-center justify-center">
                <img
                  src="/head.webp"
                  alt="Mohamed Abdul Shahid"
                  fetchPriority="high"
                  decoding="sync"
                  width="144"
                  height="160"
                  className="w-full h-full object-contain pointer-events-none"
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