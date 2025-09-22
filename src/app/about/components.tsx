import { memo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  GraduationCap,
  Shield,
  Coffee,
  Plane,
} from 'lucide-react'

import { useTranslation } from '../../hooks/useTranslation'
import { createAnimationVariants } from './animations'
import type { BadgeProps, BadgeListProps, DotListProps, TeamMemberCardProps } from './types'
import { SHARED_CLASSES, BADGE_STYLES } from './types'

// ================== COMPONENTS ==================

// Badge Component
export const Badge = memo<BadgeProps>(({ text, type }) => (
  <span
    className={`${SHARED_CLASSES.badge} ${BADGE_STYLES[type]} transition-transform hover:scale-105`}
  >
    {text}
  </span>
))
Badge.displayName = 'Badge'

// Section with badges list
export const BadgeList = memo<BadgeListProps>(({ title, items, type, icon: Icon }) => {
  if (!items?.length) return null
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-4 text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" /> {title}
      </h4>
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {items.map((item: string, i: number) => (
          <Badge key={i} text={item} type={type} />
        ))}
      </div>
    </div>
  )
})
BadgeList.displayName = 'BadgeList'

// List with dots
export const DotList = memo<DotListProps>(({ title, items, icon: Icon, dotColor }) => {
  if (!items?.length) return null
  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center gap-3 text-gray-300 uppercase tracking-wider text-sm">
        <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" /> {title}
      </h4>
      <div className="space-y-3">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-start gap-4 text-gray-200 text-sm">
            <div className={`w-2 h-2 ${dotColor} rounded-full mt-2.5 flex-shrink-0`} />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
DotList.displayName = 'DotList'

// Team Member Card
export const TeamMemberCard = memo<TeamMemberCardProps>(({ member }) => {
  const { t } = useTranslation()
  const animations = createAnimationVariants()
  const [showFullBio, setShowFullBio] = useState(false)

  const toggleBio = useCallback(() => {
    setShowFullBio((prev) => !prev)
  }, [])

  return (
    <motion.div
      variants={animations.fadeInUp}
      className={`group relative ${SHARED_CLASSES.glassCard} p-8 lg:p-10 transition-all duration-500 hover:scale-[1.02] hover:border-white/20`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Photo & Info */}
        <div className="lg:col-span-4 text-center lg:text-left">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl mx-auto lg:mx-0 overflow-hidden border-4 border-gradient-to-tr from-blue-500/20 to-purple-500/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
            <Image
              src={`/images/team/${member.image}`}
              alt={member.imageAlt || member.name}
              width={160}
              height={160}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
              priority
            />
          </div>

          <div className="mt-6 lg:mt-8">
            <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
            <p className="text-blue-400 font-semibold text-lg mb-6">{member.role}</p>
          </div>

          <BadgeList
            title={t('hardware.about.team.certifications')}
            items={member.certifications ?? []}
            type="certification"
            icon={Award}
          />
        </div>

        {/* Detailed Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biography */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" aria-hidden="true" />
              {t('hardware.about.team.biography')}
            </h4>
            <div className="space-y-4">
              <p className="text-gray-200 leading-relaxed text-lg">
                {showFullBio ? member.bio : member.bioShort || member.bio}
              </p>

              {member.bioShort && member.bio !== member.bioShort && (
                <button
                  onClick={toggleBio}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group"
                >
                  {showFullBio ? (
                    <>
                      <span>{t('hardware.about.team.readLess')}</span>
                      <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                    </>
                  ) : (
                    <>
                      <span>{t('hardware.about.team.readMore')}</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {member.achievements?.length && member.achievements.length > 0 && (
            <DotList
              title={t('hardware.about.team.achievements')}
              items={member.achievements}
              icon={Shield}
              dotColor="bg-purple-400"
            />
          )}

          {member.specialTraits?.length && member.specialTraits.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {member.specialTraits.map((trait: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
                    {i === 0 ? <Coffee className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                    <span>{trait}</span>
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
