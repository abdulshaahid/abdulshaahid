"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  dotSize?: number;
  dotSpacing?: number;
  interactive?: boolean;
  color?: string;
}

interface Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
}

const DotPattern: React.FC<DotPatternProps> = ({
  className,
  dotSize = 1.5,
  dotSpacing = 30,
  interactive = true,
  color = "180, 180, 180",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const isTouchDevice = useRef(false);
  const fadeOpacity = useRef(0);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    if (touch) {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    if (touch) {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => {
      mousePos.current = { x: -1000, y: -1000 };
    }, 300);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth || window.innerWidth;
      const cssHeight = canvas.clientHeight || window.innerHeight;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };

    window.addEventListener("resize", throttledResize, { passive: true });

    if (interactive) {
      isTouchDevice.current =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      window.addEventListener("pointermove", handlePointerMove);

      if (isTouchDevice.current) {
        window.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });
        window.addEventListener("touchmove", handleTouchMove, {
          passive: true,
        });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });
        window.addEventListener("touchcancel", handleTouchEnd, {
          passive: true,
        });
      }
    }

    let canceled = false;

    const start = () => {
      if (canceled) return;

      if (!ctx || !canvas) {
        console.warn("Canvas context not available, skipping dot pattern");
        return;
      }

      const isMobileViewInit = window.innerWidth < 640;
      const responsiveSpacing = isMobileViewInit
        ? dotSpacing * 0.8
        : dotSpacing;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cols = Math.ceil(width / responsiveSpacing);
      const rows = Math.ceil(height / responsiveSpacing);

      const maxDots = isMobileViewInit ? 800 : 2000;

      dotsRef.current = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * responsiveSpacing + responsiveSpacing / 2;
          const y = row * responsiveSpacing + responsiveSpacing / 2;
          dotsRef.current.push({
            x,
            y,
            originalX: x,
            originalY: y,
            vx: 0,
            vy: 0,
          });
        }
      }

      let lastFrameTime = 0;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      const startTime = Date.now();
      const fadeInDuration = 800;

      const animate = (currentTime: number = 0) => {
        const elapsed = currentTime - lastFrameTime;

        if (elapsed < frameInterval) {
          animationFrameId.current = requestAnimationFrame(animate);
          return;
        }

        lastFrameTime = currentTime - (elapsed % frameInterval);

        const timeSinceStart = Date.now() - startTime;
        fadeOpacity.current = Math.min(timeSinceStart / fadeInDuration, 1);

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        ctx.clearRect(0, 0, width, height);

        const isMobileView = window.innerWidth < 640;
        const baseOpacity = isMobileView ? 0.17 : 0.225;

        dotsRef.current.forEach((dot) => {
          const opacity = baseOpacity * fadeOpacity.current;

          if (interactive) {
            const dx = mousePos.current.x - dot.x;
            const dy = mousePos.current.y - dot.y;
            const distanceSq = dx * dx + dy * dy;
            const maxDistance = isTouchDevice.current ? 200 : 150;
            const maxDistanceSq = maxDistance * maxDistance;

            if (distanceSq < maxDistanceSq) {
              const distance = Math.sqrt(distanceSq);
              const forceMultiplier = isTouchDevice.current ? 0.8 : 0.5;
              const force = (1 - distance / maxDistance) * forceMultiplier;
              const angle = Math.atan2(dy, dx);
              dot.vx -= Math.cos(angle) * force;
              dot.vy -= Math.sin(angle) * force;
            }

            dot.x += dot.vx;
            dot.y += dot.vy;

            const returnForce = 0.05;
            dot.vx += (dot.originalX - dot.x) * returnForce;
            dot.vy += (dot.originalY - dot.y) * returnForce;

            dot.vx *= 0.95;
            dot.vy *= 0.95;
          }

          ctx.fillStyle = `rgba(${color}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        });

        animationFrameId.current = requestAnimationFrame(animate);
      };

      animate();
    };

    start();

    return () => {
      window.removeEventListener("resize", throttledResize);
      canceled = true;
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove);
        if (isTouchDevice.current) {
          window.removeEventListener("touchstart", handleTouchStart);
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("touchend", handleTouchEnd);
          window.removeEventListener("touchcancel", handleTouchEnd);
        }
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    dotSize,
    dotSpacing,
    interactive,
    handlePointerMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    color,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 z-0 pointer-events-none", className)}
      style={{
        touchAction: "pan-y pan-x",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 1,
        transition: "opacity 0.3s ease-out",
      }}
    />
  );
};

export const DotPatternMemoized = memo(DotPattern);
export { DotPatternMemoized as DotPattern };
