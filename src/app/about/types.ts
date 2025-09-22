import type { ComponentType } from 'react'

// ================== TYPES ==================
export interface TeamMember {
  readonly name: string
  readonly role: string
  readonly bio: string
  readonly bioShort?: string
  readonly expertise: readonly string[]
  readonly certifications?: readonly string[]
  readonly education?: readonly string[]
  readonly achievements?: readonly string[]
  readonly image: string
  readonly imageAlt?: string
  readonly specialTraits?: readonly string[]
}

export interface Value {
  readonly icon: ComponentType<{ className?: string }>
  readonly title: string
  readonly description: string
}

export interface ValueItem {
  readonly title: string
  readonly description: string
}

export interface TeamMemberCardProps {
  readonly member: TeamMember
}

export interface BadgeProps {
  readonly text: string
  readonly type: keyof typeof BADGE_STYLES
}

export interface BadgeListProps {
  readonly title: string
  readonly items: readonly string[]
  readonly type: keyof typeof BADGE_STYLES
  readonly icon: ComponentType<{ className?: string }>
}

export interface DotListProps {
  readonly title: string
  readonly items: readonly string[]
  readonly icon: ComponentType<{ className?: string }>
  readonly dotColor: string
}

// Types pour les fonctions de traduction
export interface TranslationObject {
  [key: string]: string | string[] | TranslationObject
}

// ================== CONSTANTS ==================
export const BADGE_STYLES = {
  certification: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg',
  expertise: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg',
  achievement: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg',
} as const

export const SHARED_CLASSES = {
  gradientText:
    'bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 bg-clip-text text-transparent',
  glassCard: 'bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl',
  badge: 'px-4 py-3 rounded-full text-sm font-semibold',
  sectionTitle: 'text-4xl lg:text-5xl font-bold mb-6',
  button: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105',
} as const
