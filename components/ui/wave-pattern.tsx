"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface WavePatternProps {
  className?: string;
  strokeColor?: string;
  waveAmplitude?: number;
  waveLength?: number;
  rowSpacing?: number;
  lineWidth?: number;
  interactive?: boolean;
  speed?: number;
  fadeEdges?: boolean;
  opacity?: number;
}

const WavePattern: React.FC<WavePatternProps> = ({
  className,
  strokeColor = "220, 220, 220",
  waveAmplitude = 8,
  waveLength = 90,
  rowSpacing = 16,
  lineWidth = 1,
  interactive = true,
  speed = 0.015,
  fadeEdges = false,
  opacity = 0.07,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);
  const isTouchDevice = useRef(false);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.isConnected) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    } catch (_) {}
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.isConnected) return;
      const touch = e.touches[0];
      if (touch) {
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    } catch (_) {}
  }, []);

  const handlePointerLeave = useCallback(() => {
    mousePos.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = 1;
    let cssWidth = 0;
    let cssHeight = 0;

    const setCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = canvas.clientWidth || window.innerWidth;
      cssHeight = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };

    window.addEventListener("resize", throttledResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        setCanvasSize();
      });
      resizeObserver.observe(canvas);
    }

    if (interactive) {
      isTouchDevice.current =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      if (isTouchDevice.current) {
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handlePointerLeave, { passive: true });
        window.addEventListener("touchcancel", handlePointerLeave, { passive: true });
      }
    }

    let phase = 0;
    const xStep = 10; // Optimized step size for ultra-smooth 60-120fps on all devices

    const animate = () => {
      const width = cssWidth || canvas.clientWidth || window.innerWidth;
      const height = cssHeight || canvas.clientHeight || window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      phase += speed;

      const isMobile = width < 640;
      const currentSpacing = isMobile ? rowSpacing * 0.6 : rowSpacing;
      const currentAmplitude = isMobile ? waveAmplitude * 0.55 : waveAmplitude;

      const rows = Math.ceil(height / currentSpacing) + 2;

      ctx.lineWidth = lineWidth;

      const mouseX = mousePos.current.x;
      const mouseY = mousePos.current.y;
      const maxDistance = isMobile ? 140 : 200;
      const maxDistanceSq = maxDistance * maxDistance;

      for (let row = -1; row < rows; row++) {
        const baseY = row * currentSpacing;

        let lineAlpha = opacity;
        if (fadeEdges) {
          const verticalProgress = baseY / height;
          if (verticalProgress < 0.15) {
            lineAlpha *= verticalProgress / 0.15;
          } else if (verticalProgress > 0.85) {
            lineAlpha *= (1 - verticalProgress) / 0.15;
          }
        }

        ctx.strokeStyle = `rgba(${strokeColor}, ${lineAlpha.toFixed(3)})`;
        ctx.beginPath();

        let firstPoint = true;

        for (let x = -20; x <= width + 20; x += xStep) {
          // Banknote sine wave calculation
          let y = baseY + Math.sin((x / waveLength) * (Math.PI * 2) + phase + row * 0.15) * currentAmplitude;

          // Interactive mouse wave distortion
          if (interactive && mouseX > -500) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistanceSq) {
              const dist = Math.sqrt(distSq);
              const force = Math.cos((dist / maxDistance) * (Math.PI / 2));
              // Push waves away smoothly around cursor
              const pushY = (dy / (dist || 1)) * force * 24;
              y += pushY;
            }
          }

          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", throttledResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        if (isTouchDevice.current) {
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("touchend", handlePointerLeave);
          window.removeEventListener("touchcancel", handlePointerLeave);
        }
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    strokeColor,
    waveAmplitude,
    waveLength,
    rowSpacing,
    lineWidth,
    interactive,
    speed,
    fadeEdges,
    handlePointerMove,
    handleTouchMove,
    handlePointerLeave,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 w-full h-full pointer-events-none z-0", className)}
      style={{
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
      }}
    />
  );
};

export const WavePatternMemoized = memo(WavePattern);
export { WavePatternMemoized as WavePattern };
