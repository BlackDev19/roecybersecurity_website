'use client'

import { memo, useMemo, type ComponentType } from 'react'
import { 
  Shield, Users, Globe, Award, 
  Lock, GraduationCap, Cloud, 
  Network, Coffee, Plane
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'

import { useTranslation } from '../../hooks/useTranslation'

// ================== TYPES ==================
interface TeamMember {
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

interface Value {
  readonly icon: ComponentType<{ className?: string }>
  readonly title: string
  readonly description: string
}

interface ValueItem {
  readonly title: string
  readonly description: string
}

// Définition des types pour tObject
type StringArrayGetter = (key: string) => string[] | undefined
type ValueArrayGetter = (key: string) => ValueItem[] | undefined

// ================== CONSTANTS ==================
const ANIMATION_CONFIG = {
  duration: 0.6,
  stagger: 0.1,
  delay: 0.1,
} as const

const BADGE_STYLES = {
  certification: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg',
  expertise: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg',
  achievement: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
} as const

const SHARED_CLASSES = {
  gradientText: 'bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent',
  glassCard: 'bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-700/50',
  badge: 'px-3 py-1 rounded-full text-xs font-medium',
  sectionTitle: 'text-4xl lg:text-5xl font-bold mb-4',
} as const

// ================== ANIMATIONS ==================
const createAnimationVariants = (): Record<string, Variants> => ({
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: ANIMATION_CONFIG.stagger, 
        delayChildren: ANIMATION_CONFIG.delay 
      } 
    }
  },
  fadeInUp: { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: ANIMATION_CONFIG.duration, ease: 'easeInOut' } 
    } 
  },
  scaleIn: { 
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
    } 
  }
})

// ================== HOOKS ==================
const useTeamData = (
  t: (key: string) => string,
  tObject: StringArrayGetter
): TeamMember[] =>
  useMemo(() => [
    {
      name: t('hardware.about.team.teamMembers.marate.name'),
      role: t('hardware.about.team.teamMembers.marate.role'),
      bio: t('hardware.about.team.teamMembers.marate.bio'),
      bioShort: t('hardware.about.team.teamMembers.marate.bioShort'),
      expertise: tObject('hardware.about.team.teamMembers.marate.expertise') ?? [],
      certifications: tObject('hardware.about.team.teamMembers.marate.certifications') ?? [],
      education: tObject('hardware.about.team.teamMembers.marate.education') ?? [],
      achievements: tObject('hardware.about.team.teamMembers.marate.achievements') ?? [],
      image: 'marate-agninde.jpg',
      imageAlt: t('hardware.about.team.teamMembers.marate.name')
    },
    {
      name: t('hardware.about.team.teamMembers.adzoavi.name'),
      role: t('hardware.about.team.teamMembers.adzoavi.role'),
      bio: t('hardware.about.team.teamMembers.adzoavi.bio'),
      bioShort: t('hardware.about.team.teamMembers.adzoavi.bioShort'),
      expertise: tObject('hardware.about.team.teamMembers.adzoavi.expertise') ?? [],
      specialTraits: tObject('hardware.about.team.teamMembers.adzoavi.specialTraits') ?? [],
      image: 'adzoavi-akotia.jpg',
      imageAlt: t('hardware.about.team.teamMembers.adzoavi.name')
    },
    {
      name: t('hardware.about.team.teamMembers.pachell.name'),
      role: t('hardware.about.team.teamMembers.pachell.role'),
      bio: t('hardware.about.team.teamMembers.pachell.bio'),
      bioShort: t('hardware.about.team.teamMembers.pachell.bioShort'),
      expertise: tObject('hardware.about.team.teamMembers.pachell.expertise') ?? [],
      certifications: tObject('hardware.about.team.teamMembers.pachell.certifications') ?? [],
      education: tObject('hardware.about.team.teamMembers.pachell.education') ?? [],
      achievements: tObject('hardware.about.team.teamMembers.pachell.achievements') ?? [],
      image: 'pachell-anthony.jpg',
      imageAlt: t('hardware.about.team.teamMembers.pachell.name')
    },
    {
      name: t('hardware.about.team.teamMembers.cesar.name'),
      role: t('hardware.about.team.teamMembers.cesar.role'),
      bio: t('hardware.about.team.teamMembers.cesar.bio'),
      bioShort: t('hardware.about.team.teamMembers.cesar.bioShort'),
      expertise: tObject('hardware.about.team.teamMembers.cesar.expertise') ?? [],
      certifications: tObject('hardware.about.team.teamMembers.cesar.certifications') ?? [],
      education: tObject('hardware.about.team.teamMembers.cesar.education') ?? [],
      achievements: tObject('hardware.about.team.teamMembers.cesar.achievements') ?? [],
      image: 'cesar-lakignang.jpg',
      imageAlt: t('hardware.about.team.teamMembers.cesar.name')
    }
  ], [t, tObject])


const useValuesData = (
  tObject: ValueArrayGetter
): Value[] =>
  useMemo(() => {
    const items = tObject('valuesSection.items') ?? []
    const icons = [Shield, Globe, GraduationCap, Lock] as const
    
    return icons.map((icon, i) => ({
      icon,
      title: items[i]?.title || '',
      description: items[i]?.description || ''
    }))
  }, [tObject])

// ================== COMPONENTS ==================

// Badge Component
interface BadgeProps {
  readonly text: string
  readonly type: keyof typeof BADGE_STYLES
}
const Badge = memo<BadgeProps>(({ text, type }) => (
  <span className={`${SHARED_CLASSES.badge} ${BADGE_STYLES[type]}`}>
    {text}
  </span>
))
Badge.displayName = 'Badge'

// Section with badges list
interface BadgeListProps {
  readonly title: string
  readonly items: readonly string[]
  readonly type: keyof typeof BADGE_STYLES
  readonly icon: ComponentType<{ className?: string }>
}
const BadgeList = memo<BadgeListProps>(({ title, items, type, icon: Icon }) => {
  if (!items?.length) return null
  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-3 text-sm text-gray-200 uppercase tracking-wide flex items-center gap-1">
        <Icon className="h-4 w-4" aria-hidden="true" /> {title}
      </h4>
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
        {items.map((item, i) => <Badge key={i} text={item} type={type} />)}
      </div>
    </div>
  )
})
BadgeList.displayName = 'BadgeList'

// List with dots
interface DotListProps {
  readonly title: string
  readonly items: readonly string[]
  readonly icon: ComponentType<{ className?: string }>
  readonly dotColor: string
}
const DotList = memo<DotListProps>(({ title, items, icon: Icon, dotColor }) => {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      <h4 className="font-semibold flex items-center gap-2 text-gray-200 uppercase tracking-wide text-sm">
        <Icon className="h-4 w-4 text-blue-400" aria-hidden="true" /> {title}
      </h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-gray-200 text-sm">
            <div className={`w-1.5 h-1.5 ${dotColor} rounded-full mt-2 flex-shrink-0`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
DotList.displayName = 'DotList'

// Team Member Card
interface TeamMemberCardProps {
  readonly member: TeamMember
}
const TeamMemberCard = memo<TeamMemberCardProps>(({ member }) => {
  const { t } = useTranslation()
  const animations = createAnimationVariants()

  return (
    <motion.div 
      variants={animations.fadeInUp} 
      className={`group relative ${SHARED_CLASSES.glassCard} p-6 md:p-8 transition-all hover:scale-[1.02]`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Photo & Info */}
        <div className="lg:col-span-3 text-center lg:text-left">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl mx-auto lg:mx-0 overflow-hidden border-2 border-gradient-to-tr from-blue-500 to-purple-500 bg-gray-700">
            <Image 
              src={`/images/team/${member.image}`} 
              alt={member.imageAlt || member.name} 
              width={128} 
              height={128} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white mt-4">{member.name}</h3>
          <p className="text-blue-400 font-semibold mb-6 text-sm">{member.role}</p>

          <BadgeList
            title={t('hardware.about.team.certifications')}
            items={member.certifications ?? []}
            type="certification"
            icon={Award}
          />
        </div>

        {/* Detailed Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Biography */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-gray-200 uppercase tracking-wide flex items-center gap-1">
              <Users className="h-4 w-4" aria-hidden="true" /> {t('hardware.about.team.biography')}
            </h4>
            <p className="text-gray-200 leading-relaxed">{member.bioShort || member.bio}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DotList
              title={t('hardware.about.team.education')}
              items={member.education ?? []}
              icon={GraduationCap}
              dotColor="bg-blue-400"
            />
            <BadgeList
              title={t('hardware.about.team.expertise')}
              items={member.expertise}
              type="expertise"
              icon={Award}
            />
          </div>

          <DotList
            title={t('hardware.about.team.achievements')}
            items={member.achievements ?? []}
            icon={Shield}
            dotColor="bg-purple-400"
          />

          {member.specialTraits?.length && (
            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex gap-4 text-sm text-gray-400">
                {member.specialTraits.map((trait, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i === 0 ? <Coffee className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                    {trait}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})
TeamMemberCard.displayName = 'TeamMemberCard'

// Hero Section
const HeroSection = memo(() => {
  const { t } = useTranslation()
  const animations = createAnimationVariants()

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-800/10 via-transparent to-purple-800/10" />
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} 
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial="hidden" animate="visible" variants={animations.container} className="max-w-4xl mx-auto">
          <motion.div variants={animations.scaleIn} className="flex justify-center mb-8">
            <div className="relative">
              <Image 
                src="/logo/Roe_Logo.jpg" 
                alt="ROE Cybersecurity Logo" 
                width={80} 
                height={80} 
                className="rounded-full"
                priority
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h1 variants={animations.fadeInUp} className="text-5xl lg:text-6xl font-bold mb-6">
            <span className={SHARED_CLASSES.gradientText}>{t('hardware.about.hero.title')}</span>
          </motion.h1>

          <motion.p variants={animations.fadeInUp} className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('hardware.about.hero.subtitle')}
          </motion.p>

          <motion.div variants={animations.fadeInUp} className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
})
HeroSection.displayName = 'HeroSection'

// Team Section
const TeamSection = memo(() => {
  const { t, tObject } = useTranslation()
  const team = useTeamData(t, tObject as StringArrayGetter)
  const animations = createAnimationVariants()

  return (
    <section className="py-24 bg-gradient-to-br from-blue-950/80 via-gray-900 to-purple-950/80 relative overflow-hidden" aria-labelledby="team-heading">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={animations.container}>
          <motion.div variants={animations.fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/20">
              <Users className="h-5 w-5" aria-hidden="true" />
              {t('hardware.about.team.badge')}
            </div>
            <h2 id="team-heading" className={SHARED_CLASSES.sectionTitle}>
              <span className={SHARED_CLASSES.gradientText}>{t('hardware.about.team.title')}</span>
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">{t('hardware.about.team.subtitle')}</p>
          </motion.div>

          <div className="space-y-12">
            {team.map((member, i) => <TeamMemberCard key={`${member.name}-${i}`} member={member} />)}
          </div>
        </motion.div>
      </div>
    </section>
  )
})
TeamSection.displayName = 'TeamSection'

// Values Section
const ValuesSection = memo(() => {
  const { tObject, t } = useTranslation()
  const values = useValuesData(tObject as unknown as ValueArrayGetter)
  const animations = createAnimationVariants()

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 relative overflow-hidden" aria-labelledby="values-heading">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={animations.container}>
          <motion.h2 id="values-heading" variants={animations.fadeInUp} className="text-3xl lg:text-4xl font-bold mb-12">
            <span className={SHARED_CLASSES.gradientText}>{t('valuesSection.title')}</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, i) => (
              <motion.div key={`${value.title}-${i}`} variants={animations.fadeInUp} className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-transparent hover:border-blue-500/50 hover:shadow-blue-500/30 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -inset-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" aria-hidden="true" />
                <div className="flex flex-col items-center text-center">
                  <value.icon className="h-10 w-10 text-blue-400 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
})
ValuesSection.displayName = 'ValuesSection'

// ================== PAGE ==================
export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <TeamSection />
      <ValuesSection />
    </main>
  )
}