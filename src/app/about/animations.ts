import type { Variants } from 'framer-motion'

// ================== CONSTANTS ==================
const ANIMATION_CONFIG = {
  duration: 0.6,
  stagger: 0.1,
  delay: 0.1,
} as const

// ================== ANIMATIONS ==================
export const createAnimationVariants = (): Record<string, Variants> => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_CONFIG.stagger,
        delayChildren: ANIMATION_CONFIG.delay,
      },
    },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: ANIMATION_CONFIG.duration, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  },
})
