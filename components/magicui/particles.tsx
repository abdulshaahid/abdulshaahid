"use client";

import { cn } from "@/lib/utils";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

function useGyroscope() {
  const [gyroData, setGyroData] = useState<GyroscopeData>({ x: 0, y: 0, z: 0 });
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined') {
        const supported = 'DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window;
        setIsSupported(supported);
      }
    };

    checkSupport();
  }, []);

  const requestPermission = async () => {
    if (typeof window === 'undefined') return false;

    try {
      // For iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } else {
        // For Android and older iOS devices
        setPermissionGranted(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting device orientation permission:', error);
    }
    return false;
  };

  useEffect(() => {
    if (!isSupported || !permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma, alpha } = event;
      setGyroData({
        x: gamma || 0,  // Left-right tilt (-90 to 90)
        y: beta || 0,   // Front-back tilt (-180 to 180)
        z: alpha || 0   // Compass direction (0 to 360)
      });
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        setGyroData(prev => ({
          x: (acceleration.x || 0) * 10, // Scale for better effect
          y: (acceleration.y || 0) * 10,
          z: prev.z
        }));
      }
    };

    // Try DeviceOrientationEvent first, fallback to DeviceMotionEvent
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isSupported, permissionGranted]);

  return { gyroData, isSupported, permissionGranted, requestPermission };
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  enableGyroscope?: boolean;
  gyroscopeSensitivity?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  enableGyroscope = true,
  gyroscopeSensitivity = 2,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = MousePosition();
  const { gyroData, isSupported, permissionGranted, requestPermission } = useGyroscope();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useRef(false);
  const [showPermissionButton, setShowPermissionButton] = useState(false);

  useEffect(() => {
    isMobile.current = isMobileDevice();
    
    // Show permission button for iOS devices or if gyroscope is supported but permission not granted
    if (isMobile.current && enableGyroscope && isSupported && !permissionGranted) {
      // Auto-request permission on mobile
      requestPermission().then((granted) => {
        if (!granted) {
          setShowPermissionButton(true);
        }
      });
    }
  }, [isSupported, permissionGranted, enableGyroscope]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();

    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      resizeTimeout.current = setTimeout(() => {
        initCanvas();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current);
      }
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [color]);

  useEffect(() => {
    if (!isMobile.current) {
      onMouseMove();
    }
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    if (isMobile.current && enableGyroscope && permissionGranted) {
      onGyroscopeMove();
    }
  }, [gyroData.x, gyroData.y, gyroData.z]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const handlePermissionRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionButton(false);
    }
  };

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const onGyroscopeMove = () => {
    if (canvasRef.current) {
      const { w, h } = canvasSize.current;
      // Convert gyroscope data to mouse-like coordinates
      // Scale and clamp the values to reasonable ranges
      const maxTilt = 45; // Max tilt angle to consider
      const x = Math.max(-w/2, Math.min(w/2, (gyroData.x / maxTilt) * (w/2) * gyroscopeSensitivity));
      const y = Math.max(-h/2, Math.min(h/2, (gyroData.y / maxTilt) * (h/2) * gyroscopeSensitivity));
      
      mouse.current.x = x;
      mouse.current.y = y;
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;

      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);

      // Clear existing particles and create new ones with exact quantity
      circles.current = [];
      for (let i = 0; i < quantity; i++) {
        const circle = circleParams();
        drawCircle(circle);
      }
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;

      // Enhanced speed for mobile devices
      const speed = isMobile.current ? 15 : 10; // Faster reaction on mobile
      circle.translateX +=
        ((mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease) * speed;
      circle.translateY +=
        ((mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease) * speed;

      drawCircle(circle, true);

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    rafID.current = window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn("pointer-events-none relative", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
      
      {/* Permission button for iOS devices */}
      {showPermissionButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-auto">
          <button
            onClick={handlePermissionRequest}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Enable Motion Controls
          </button>
        </div>
      )}
    </div>
  );
};