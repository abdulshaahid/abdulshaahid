"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"

interface ParticleImageProps {
  src: string
  alt?: string
  className?: string
  priority?: boolean
}

interface Particle {
  ox: number
  oy: number
  cx: number
  cy: number
  vx: number
  vy: number
  color: string
  size: number
}

const globalImgCache = new Map<string, HTMLImageElement>()
const globalImgPromises = new Map<string, Promise<HTMLImageElement>>()

function getGlobalImage(src: string): Promise<HTMLImageElement> {
  const cached = globalImgCache.get(src)
  if (cached && cached.complete) {
    return Promise.resolve(cached)
  }
  const pending = globalImgPromises.get(src)
  if (pending) return pending

  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => {
      globalImgCache.set(src, img)
      resolve(img)
    }
    img.onerror = reject
  })
  globalImgPromises.set(src, p)
  return p
}

export function ParticleImage({
  src,
  alt = "Portrait",
  className = "",
}: ParticleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgCacheRef = useRef<HTMLImageElement | null>(null)
  const lastWidthRef = useRef<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const stateRef = useRef<{
    animId: number | null
    isAnimating: boolean
    baseCanvas: HTMLCanvasElement | null
    particles: Particle[]
    activeIndices: number[]
    particleGrid: Uint8Array | null
    spatialGrid: {
      cellSize: number
      cols: number
      rows: number
      buckets: number[][]
    } | null
    mouse: {
      x: number
      y: number
      prevX: number
      prevY: number
      vx: number
      vy: number
      isInteracting: boolean
      radius: number
    }
    dpr: number
    width: number
    height: number
    isVisible: boolean
  }>({
    animId: null,
    isAnimating: false,
    baseCanvas: null,
    particles: [],
    activeIndices: [],
    particleGrid: null,
    spatialGrid: null,
    mouse: {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      isInteracting: false,
      radius: 65,
    },
    dpr: 1,
    width: 0,
    height: 0,
    isVisible: true,
  })

  // Start RAF animation loop only when active
  const startAnimation = useCallback(() => {
    const state = stateRef.current
    if (state.isAnimating) return
    state.isAnimating = true

    const loop = () => {
      const canvas = canvasRef.current
      const {
        baseCanvas,
        particles,
        activeIndices,
        dpr,
        mouse,
        width,
        height,
        isVisible,
      } = state

      if (canvas && baseCanvas && isVisible) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.save()
          ctx.scale(dpr, dpr)

          // 1. Draw pristine full-resolution original photo
          ctx.drawImage(baseCanvas, 0, 0, width, height)

          // 2. If particles are active, cleanly dissolve the disturbed area and render flying particles
          if (activeIndices.length > 0) {
            const spring = 0.24
            const damping = 0.74
            const stillActive: number[] = []

            // Smooth clean radial eraser under the cursor & active clusters
            ctx.globalCompositeOperation = "destination-out"

            if (mouse.isInteracting && mouse.x > -100) {
              const r = mouse.radius * 0.95
              const grad = ctx.createRadialGradient(mouse.x, mouse.y, r * 0.4, mouse.x, mouse.y, r)
              grad.addColorStop(0, "rgba(0,0,0,1)")
              grad.addColorStop(0.85, "rgba(0,0,0,0.9)")
              grad.addColorStop(1, "rgba(0,0,0,0)")
              ctx.fillStyle = grad
              ctx.beginPath()
              ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2)
              ctx.fill()
            }

            // Also softly erase around any displaced particles
            for (let k = 0; k < activeIndices.length; k++) {
              const idx = activeIndices[k]
              const p = particles[idx]
              const dx = p.ox - p.cx
              const dy = p.oy - p.cy
              const distSq = dx * dx + dy * dy

              if (distSq > 3.0) {
                const s = p.size * 1.6
                ctx.fillStyle = "rgba(0,0,0,0.85)"
                ctx.beginPath()
                ctx.arc(p.ox, p.oy, s, 0, Math.PI * 2)
                ctx.fill()
              }
            }

            // 3. Render flying particles in full photographic color
            ctx.globalCompositeOperation = "source-over"
            for (let k = 0; k < activeIndices.length; k++) {
              const idx = activeIndices[k]
              const p = particles[idx]

              const dx = p.ox - p.cx
              const dy = p.oy - p.cy

              const ax = dx * spring
              const ay = dy * spring

              p.vx = (p.vx + ax) * damping
              p.vy = (p.vy + ay) * damping

              p.cx += p.vx
              p.cy += p.vy

              const totalDisp = Math.abs(dx) + Math.abs(dy)
              const totalVel = Math.abs(p.vx) + Math.abs(p.vy)

              // Fast healing snap
              if (totalDisp < 0.9 && totalVel < 0.35) {
                p.cx = p.ox
                p.cy = p.oy
                p.vx = 0
                p.vy = 0
                state.particleGrid![idx] = 0 // release from active grid
              } else {
                stillActive.push(idx)

                ctx.fillStyle = p.color
                const s = p.size
                ctx.fillRect((p.cx - s * 0.5) | 0, (p.cy - s * 0.5) | 0, s | 0, s | 0)
              }
            }

            state.activeIndices = stillActive
          }

          ctx.restore()
        }
      }

      // Decay velocity
      state.mouse.vx *= 0.4
      state.mouse.vy *= 0.4

      // Sleep when all particles return home
      if (state.activeIndices.length > 0 || state.mouse.isInteracting) {
        state.animId = requestAnimationFrame(loop)
      } else {
        if (canvas && baseCanvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(baseCanvas, 0, 0, canvas.width, canvas.height)
          }
        }
        state.isAnimating = false
        state.animId = null
      }
    }

    state.animId = requestAnimationFrame(loop)
  }, [])

  // Build canvas and physics grid from preloaded image
  const buildFromImage = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const isMobile = typeof window !== "undefined" && (window.innerWidth < 640 || "ontouchstart" in window)
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2.5)
    stateRef.current.dpr = dpr

    const imgAspect = img.naturalWidth / img.naturalHeight
    let renderWidth = rect.width
    let renderHeight = rect.width / imgAspect

    if (renderHeight > rect.height) {
      renderHeight = rect.height
      renderWidth = rect.height * imgAspect
    }

    stateRef.current.width = renderWidth
    stateRef.current.height = renderHeight

    canvas.width = Math.floor(renderWidth * dpr)
    canvas.height = Math.floor(renderHeight * dpr)
    canvas.style.width = `${renderWidth}px`
    canvas.style.height = `${renderHeight}px`

    // 1. Pristine High-Resolution Base Canvas
    const baseCanvas = document.createElement("canvas")
    baseCanvas.width = Math.floor(renderWidth * dpr)
    baseCanvas.height = Math.floor(renderHeight * dpr)
    const baseCtx = baseCanvas.getContext("2d")
    if (!baseCtx) return

    baseCtx.imageSmoothingEnabled = true
    baseCtx.imageSmoothingQuality = "high"
    baseCtx.scale(dpr, dpr)
    baseCtx.drawImage(img, 0, 0, renderWidth, renderHeight)

    // Soft bottom gradient fade mask
    baseCtx.globalCompositeOperation = "destination-in"
    const fadeGrad = baseCtx.createLinearGradient(0, 0, 0, renderHeight)
    fadeGrad.addColorStop(0, "black")
    fadeGrad.addColorStop(0.68, "black")
    fadeGrad.addColorStop(1.0, "transparent")
    baseCtx.fillStyle = fadeGrad
    baseCtx.fillRect(0, 0, renderWidth, renderHeight)
    baseCtx.globalCompositeOperation = "source-over"

    stateRef.current.baseCanvas = baseCanvas

    // 2. Sample pixel data for particle physics grid
    const sampleCanvas = document.createElement("canvas")
    sampleCanvas.width = Math.floor(renderWidth)
    sampleCanvas.height = Math.floor(renderHeight)
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true })
    if (!sampleCtx) return

    sampleCtx.imageSmoothingEnabled = true
    sampleCtx.imageSmoothingQuality = "high"
    sampleCtx.drawImage(img, 0, 0, renderWidth, renderHeight)
    const imgData = sampleCtx.getImageData(0, 0, renderWidth, renderHeight)
    const data = imgData.data
    const gridStep = 2.0
    const pSize = Math.max(gridStep * 1.35, 2.4)

    const cols = Math.ceil(renderWidth / gridStep)
    const rows = Math.ceil(renderHeight / gridStep)
    stateRef.current.particleGrid = new Uint8Array(cols * rows)

    const cellSize = 30
    const gridBucketCols = Math.ceil(renderWidth / cellSize)
    const gridBucketRows = Math.ceil(renderHeight / cellSize)
    const buckets: number[][] = Array.from({ length: gridBucketCols * gridBucketRows }, () => [])

    const particles: Particle[] = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * gridStep
        const y = r * gridStep
        const px = Math.min(Math.floor(x), renderWidth - 1)
        const py = Math.min(Math.floor(y), renderHeight - 1)
        const idx = (py * Math.floor(renderWidth) + px) * 4

        const a = data[idx + 3]
        if (a > 30) {
          const yNorm = y / renderHeight
          let fadeA = 1.0
          if (yNorm > 0.68) {
            fadeA = Math.max(0, 1.0 - (yNorm - 0.68) / 0.32)
          }

          if (fadeA <= 0.05) continue

          const red = data[idx]
          const green = data[idx + 1]
          const blue = data[idx + 2]

          const pIndex = particles.length
          particles.push({
            ox: x,
            oy: y,
            cx: x,
            cy: y,
            vx: 0,
            vy: 0,
            color: `rgb(${red},${green},${blue})`,
            size: pSize,
          })

          const bc = Math.min(Math.floor(x / cellSize), gridBucketCols - 1)
          const br = Math.min(Math.floor(y / cellSize), gridBucketRows - 1)
          buckets[br * gridBucketCols + bc].push(pIndex)
        }
      }
    }

    stateRef.current.particles = particles
    stateRef.current.activeIndices = []
    stateRef.current.spatialGrid = {
      cellSize,
      cols: gridBucketCols,
      rows: gridBucketRows,
      buckets,
    }

    // Initial clean draw of the pristine photo
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(baseCanvas, 0, 0, canvas.width, canvas.height)
    }

    lastWidthRef.current = rect.width
    setIsLoaded(true)
  }, [])

  // Initialize and sample the image
  const initCanvas = useCallback(() => {
    getGlobalImage(src)
      .then((img) => {
        imgCacheRef.current = img
        buildFromImage(img)
      })
      .catch(() => {})
  }, [src, buildFromImage])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  // O(1) Particle perturbation
  const perturbParticles = useCallback(
    (x: number, y: number, mouseVx: number, mouseVy: number) => {
      const state = stateRef.current
      const {
        particles,
        particleGrid,
        activeIndices,
        spatialGrid,
      } = state
      if (!spatialGrid || !particleGrid || particles.length === 0) return

      const isMobile = window.innerWidth < 640 || "ontouchstart" in window
      const { cellSize, cols, rows, buckets } = spatialGrid
      const radius = isMobile ? 55 : 75
      const radiusSq = radius * radius
      const repelStrength = isMobile ? 22 : 30
      state.mouse.radius = radius

      const minCol = Math.max(0, Math.floor((x - radius) / cellSize))
      const maxCol = Math.min(cols - 1, Math.floor((x + radius) / cellSize))
      const minRow = Math.max(0, Math.floor((y - radius) / cellSize))
      const maxRow = Math.min(rows - 1, Math.floor((y + radius) / cellSize))

      const speed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy)
      const boost = Math.min(speed * 0.35, 12)

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const bucket = buckets[r * cols + c]
          for (let b = 0; b < bucket.length; b++) {
            const i = bucket[b]
            const p = particles[i]
            const dx = p.cx - x
            const dy = p.cy - y
            const distSq = dx * dx + dy * dy

            if (distSq < radiusSq && distSq > 0.001) {
              const dist = Math.sqrt(distSq)
              const normDist = 1 - dist / radius
              const force = normDist * normDist * repelStrength

              const angle = Math.atan2(dy, dx)
              p.vx += Math.cos(angle) * force + mouseVx * 0.25
              p.vy += Math.sin(angle) * force + mouseVy * 0.25 + (Math.random() - 0.5) * boost

              if (particleGrid[i] === 0) {
                particleGrid[i] = 1
                activeIndices.push(i)
              }
            }
          }
        }
      }

      startAnimation()
    },
    [startAnimation]
  )

  const cachedRectRef = useRef<{ left: number; top: number; time: number }>({ left: 0, top: 0, time: 0 })

  // Coordinate normalizer with cached bounding rect (avoids forced reflows on mousemove)
  const handleInteractionAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const now = performance.now()
      if (now - cachedRectRef.current.time > 500) {
        const rect = canvas.getBoundingClientRect()
        cachedRectRef.current = { left: rect.left, top: rect.top, time: now }
      }

      const x = clientX - cachedRectRef.current.left
      const y = clientY - cachedRectRef.current.top

      const mouse = stateRef.current.mouse
      let vx = 0
      let vy = 0

      if (mouse.prevX !== -9999) {
        vx = x - mouse.prevX
        vy = y - mouse.prevY
      }

      mouse.vx = vx
      mouse.vy = vy

      if (mouse.prevX !== -9999 && (Math.abs(vx) > 10 || Math.abs(vy) > 10)) {
        const steps = Math.min(Math.ceil(Math.sqrt(vx * vx + vy * vy) / 14), 5)
        for (let s = 1; s <= steps; s++) {
          const ix = mouse.prevX + (vx * s) / steps
          const iy = mouse.prevY + (vy * s) / steps
          perturbParticles(ix, iy, vx, vy)
        }
      } else {
        perturbParticles(x, y, vx, vy)
      }

      mouse.prevX = x
      mouse.prevY = y
      mouse.x = x
      mouse.y = y
      mouse.isInteracting = true
    },
    [perturbParticles]
  )

  const handleInteractionEnd = useCallback(() => {
    const mouse = stateRef.current.mouse
    mouse.isInteracting = false
    mouse.x = -9999
    mouse.y = -9999
    mouse.prevX = -9999
    mouse.prevY = -9999
    mouse.vx = 0
    mouse.vy = 0
  }, [])

  // Touch Event Listeners for smooth mobile swipe gestures
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        handleInteractionAt(touch.clientX, touch.clientY)
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        handleInteractionAt(touch.clientX, touch.clientY)
      }
    }

    const onTouchEnd = () => {
      handleInteractionEnd()
    }

    container.addEventListener("touchstart", onTouchStart, { passive: true })
    container.addEventListener("touchmove", onTouchMove, { passive: true })
    container.addEventListener("touchend", onTouchEnd, { passive: true })
    container.addEventListener("touchcancel", onTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", onTouchStart)
      container.removeEventListener("touchmove", onTouchMove)
      container.removeEventListener("touchend", onTouchEnd)
      container.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [handleInteractionAt, handleInteractionEnd])

  // Resize & Orientation Listener - ONLY trigger when container width meaningfully changes
  useEffect(() => {
    let timer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (!containerRef.current) return
        const newWidth = containerRef.current.getBoundingClientRect().width
        // Ignore mobile browser toolbar collapse height changes (only react if width changed by > 5px)
        if (Math.abs(newWidth - lastWidthRef.current) > 5) {
          initCanvas()
        }
      }, 100)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("orientationchange", () => {
      setTimeout(initCanvas, 100)
    }, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [initCanvas])

  // IntersectionObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        stateRef.current.isVisible = entries[0]?.isIntersecting ?? true
        if (!entries[0]?.isIntersecting && stateRef.current.animId) {
          cancelAnimationFrame(stateRef.current.animId)
          stateRef.current.isAnimating = false
          stateRef.current.animId = null
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => handleInteractionAt(e.clientX, e.clientY)}
      onPointerLeave={handleInteractionEnd}
      onPointerDown={(e) => handleInteractionAt(e.clientX, e.clientY)}
      onPointerUp={handleInteractionEnd}
      className={`relative w-full h-full flex justify-center items-end select-none cursor-crosshair overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* High-Resolution Dynamic Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
        className={`max-w-full max-h-full object-contain pointer-events-auto block transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Instant Fallback while loading */}
      {!isLoaded && (
        <img
          src={src}
          alt={alt}
          width={976}
          height={1099}
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none"
          style={{
            maskImage: "linear-gradient(to bottom, black 68%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 68%, transparent 100%)",
          }}
        />
      )}
    </div>
  )
}
