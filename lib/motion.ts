/**
 * Shared Motion Tokens & Animation Utilities
 * Standardized GPU-composited animations for consistent reveal language across sections.
 */

export const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const // Smooth cubic-bezier for fluid deceleration
export const REVEAL_DURATION = 0.5 // 500ms

export const VIEWPORT_CONFIG = {
  once: true,
  margin: "0px 0px -50px 0px",
  amount: 0.12,
} as const

// Standard Fade-Up Variant for text and container elements
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: REVEAL_DURATION,
      ease: SMOOTH_EASE,
      delay,
    },
  }),
}

// Subtle Scale + Fade Variant for media preview / cards / containers
export const fadeScaleVariant = {
  hidden: { opacity: 0, scale: 0.98, y: 14 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: REVEAL_DURATION + 0.05,
      ease: SMOOTH_EASE,
      delay,
    },
  }),
}

// Fade-In Variant for subtle dividers and borders
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: SMOOTH_EASE,
      delay,
    },
  }),
}
