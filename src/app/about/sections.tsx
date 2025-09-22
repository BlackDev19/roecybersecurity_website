import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Globe, Shield } from 'lucide-react'

import { useTranslation } from '../../hooks/useTranslation'
import { createAnimationVariants } from './animations'
import { useTeamData, useValuesData, useMissionStatements } from './hooks'
import { TeamMemberCard } from './components'
import { SHARED_CLASSES } from './types'

// ================== SECTIONS ==================

// Hero Section
export const HeroSection = memo(() => {
  const { t } = useTranslation()
  const animations = createAnimationVariants()

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={animations.scaleIn} className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/logo/Roe_Logo.jpg"
                alt="ROE Cybersecurity Logo"
                width={100}
                height={100}
                className="rounded-2xl relative z-10 shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          <motion.h1 variants={animations.fadeInUp} className="text-6xl lg:text-7xl font-bold mb-8">
            <span className={SHARED_CLASSES.gradientText}>{t('hardware.about.hero.title')}</span>
          </motion.h1>

          <motion.p
            variants={animations.fadeInUp}
            className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {t('hardware.about.hero.subtitle')}
          </motion.p>

          <motion.div
            variants={animations.fadeInUp}
            className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
          />
        </motion.div>
      </div>
    </section>
  )
})
HeroSection.displayName = 'HeroSection'

// Team Section
export const TeamSection = memo(() => {
  const { t, tObject } = useTranslation()
  // Utilisation directe avec suppression du conflit de types
  const team = useTeamData(t, tObject as Parameters<typeof useTeamData>[1])
  const animations = createAnimationVariants()

  return (
    <section className="py-32 bg-gradient-to-br from-blue-950/90 via-gray-900 to-purple-950/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={animations.container}
        >
          <motion.div variants={animations.fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 px-8 py-4 rounded-2xl text-base font-semibold mb-8 backdrop-blur-sm border border-blue-500/30">
              <Users className="h-6 w-6" aria-hidden="true" />
              {t('hardware.about.team.badge')}
            </div>
            <h2 className={SHARED_CLASSES.sectionTitle}>
              <span className={SHARED_CLASSES.gradientText}>{t('hardware.about.team.title')}</span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {t('hardware.about.team.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-16">
            {team.map((member, i) => (
              <TeamMemberCard key={`${member.name}-${i}`} member={member} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
})
TeamSection.displayName = 'TeamSection'

// Mission Section
export const MissionSection = memo(() => {
  const { t, tObject } = useTranslation()
  const animations = createAnimationVariants()
  // Utilisation directe avec suppression du conflit de types
  const missionStatements = useMissionStatements(
    tObject as Parameters<typeof useMissionStatements>[0]
  )

  return (
    <section className="py-32 bg-gradient-to-br from-purple-950/90 via-gray-900 to-blue-950/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={animations.container}
        >
          <motion.div variants={animations.fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-8 py-4 rounded-2xl text-base font-semibold mb-8 backdrop-blur-sm border border-purple-500/30">
              <Globe className="h-6 w-6" aria-hidden="true" />
              {t('hardware.about.mission.badge')}
            </div>
            <h2 className={SHARED_CLASSES.sectionTitle}>
              <span className={SHARED_CLASSES.gradientText}>
                {t('hardware.about.mission.title')}
              </span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              {t('hardware.about.mission.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={animations.fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {missionStatements.map((statement: string, i: number) => (
              <motion.div
                key={i}
                variants={animations.scaleIn}
                className={`${SHARED_CLASSES.glassCard} p-8 text-center group hover:bg-white/10 transition-all duration-500`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="text-lg text-blue-100 leading-relaxed">{statement}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})
MissionSection.displayName = 'MissionSection'

// Values Section
export const ValuesSection = memo(() => {
  const { t, tObject } = useTranslation()
  // Utilisation directe avec suppression du conflit de types
  const values = useValuesData(tObject as Parameters<typeof useValuesData>[0])
  const animations = createAnimationVariants()

  return (
    <section className="py-32 bg-gradient-to-br from-blue-950/90 via-gray-900 to-purple-950/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={animations.container}
        >
          <motion.div variants={animations.fadeInUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 px-8 py-4 rounded-2xl text-base font-semibold mb-8 backdrop-blur-sm border border-blue-500/30">
              <Shield className="h-6 w-6" aria-hidden="true" />
              {t('hardware.about.values.badge')}
            </div>
            <h2 className={SHARED_CLASSES.sectionTitle}>
              <span className={SHARED_CLASSES.gradientText}>
                {t('hardware.about.values.title')}
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {t('hardware.about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={animations.fadeInUp}
                className={`${SHARED_CLASSES.glassCard} p-8 text-center group hover:bg-white/10 transition-all duration-500 hover:border-white/20`}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-blue-100 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
})
ValuesSection.displayName = 'ValuesSection'
