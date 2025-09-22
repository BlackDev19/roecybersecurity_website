import { useMemo } from 'react'
import { Shield, Globe, GraduationCap, Lock } from 'lucide-react'

// Types de ton projet
import type { TeamMember, Value, TranslationObject } from './types'
import type { TranslationOptions, TranslationType } from '../../hooks/useTranslation'

// ================== TYPES UTILES ==================
type TFunction = (key: string, options?: TranslationOptions) => string
type TObjectFunction = (
  key: string,
  options?: TranslationOptions
) => TranslationObject | TranslationType[]

// ================== HOOKS ==================

// ---- TEAM ----
export const useTeamData = (t: TFunction, tObject: TObjectFunction): TeamMember[] =>
  useMemo(
    () => [
      {
        name: t('hardware.about.team.teamMembers.marate.name'),
        role: t('hardware.about.team.teamMembers.marate.role'),
        bio: t('hardware.about.team.teamMembers.marate.bio'),
        bioShort: t('hardware.about.team.teamMembers.marate.bioShort'),
        expertise: Array.isArray(tObject('hardware.about.team.teamMembers.marate.expertise'))
          ? (tObject('hardware.about.team.teamMembers.marate.expertise') as string[])
          : [],
        certifications: Array.isArray(
          tObject('hardware.about.team.teamMembers.marate.certifications')
        )
          ? (tObject('hardware.about.team.teamMembers.marate.certifications') as string[])
          : [],
        education: Array.isArray(tObject('hardware.about.team.teamMembers.marate.education'))
          ? (tObject('hardware.about.team.teamMembers.marate.education') as string[])
          : [],
        achievements: Array.isArray(tObject('hardware.about.team.teamMembers.marate.achievements'))
          ? (tObject('hardware.about.team.teamMembers.marate.achievements') as string[])
          : [],
        image: 'marate-agninde.jpg',
        imageAlt: t('hardware.about.team.teamMembers.marate.name'),
      },
      {
        name: t('hardware.about.team.teamMembers.adzoavi.name'),
        role: t('hardware.about.team.teamMembers.adzoavi.role'),
        bio: t('hardware.about.team.teamMembers.adzoavi.bio'),
        bioShort: t('hardware.about.team.teamMembers.adzoavi.bioShort'),
        expertise: Array.isArray(tObject('hardware.about.team.teamMembers.adzoavi.expertise'))
          ? (tObject('hardware.about.team.teamMembers.adzoavi.expertise') as string[])
          : [],
        specialTraits: Array.isArray(
          tObject('hardware.about.team.teamMembers.adzoavi.specialTraits')
        )
          ? (tObject('hardware.about.team.teamMembers.adzoavi.specialTraits') as string[])
          : [],
        image: 'adzoavi-akotia.jpg',
        imageAlt: t('hardware.about.team.teamMembers.adzoavi.name'),
      },
      {
        name: t('hardware.about.team.teamMembers.pachell.name'),
        role: t('hardware.about.team.teamMembers.pachell.role'),
        bio: t('hardware.about.team.teamMembers.pachell.bio'),
        bioShort: t('hardware.about.team.teamMembers.pachell.bioShort'),
        expertise: Array.isArray(tObject('hardware.about.team.teamMembers.pachell.expertise'))
          ? (tObject('hardware.about.team.teamMembers.pachell.expertise') as string[])
          : [],
        certifications: Array.isArray(
          tObject('hardware.about.team.teamMembers.pachell.certifications')
        )
          ? (tObject('hardware.about.team.teamMembers.pachell.certifications') as string[])
          : [],
        education: Array.isArray(tObject('hardware.about.team.teamMembers.pachell.education'))
          ? (tObject('hardware.about.team.teamMembers.pachell.education') as string[])
          : [],
        achievements: Array.isArray(tObject('hardware.about.team.teamMembers.pachell.achievements'))
          ? (tObject('hardware.about.team.teamMembers.pachell.achievements') as string[])
          : [],
        image: 'pachell-anthony.jpg',
        imageAlt: t('hardware.about.team.teamMembers.pachell.name'),
      },
      {
        name: t('hardware.about.team.teamMembers.cesar.name'),
        role: t('hardware.about.team.teamMembers.cesar.role'),
        bio: t('hardware.about.team.teamMembers.cesar.bio'),
        bioShort: t('hardware.about.team.teamMembers.cesar.bioShort'),
        expertise: Array.isArray(tObject('hardware.about.team.teamMembers.cesar.expertise'))
          ? (tObject('hardware.about.team.teamMembers.cesar.expertise') as string[])
          : [],
        certifications: Array.isArray(
          tObject('hardware.about.team.teamMembers.cesar.certifications')
        )
          ? (tObject('hardware.about.team.teamMembers.cesar.certifications') as string[])
          : [],
        education: Array.isArray(tObject('hardware.about.team.teamMembers.cesar.education'))
          ? (tObject('hardware.about.team.teamMembers.cesar.education') as string[])
          : [],
        achievements: Array.isArray(tObject('hardware.about.team.teamMembers.cesar.achievements'))
          ? (tObject('hardware.about.team.teamMembers.cesar.achievements') as string[])
          : [],
        image: 'cesar-lakignang.jpg',
        imageAlt: t('hardware.about.team.teamMembers.cesar.name'),
      },
    ],
    [t, tObject]
  )

// ---- VALUES ----
export const useValuesData = (tObject: TObjectFunction): Value[] =>
  useMemo(() => {
    const valuesData = tObject('hardware.about.values.items')
    const icons = [Shield, Globe, GraduationCap, Lock] as const

    if (Array.isArray(valuesData)) {
      return icons.map((icon, i) => {
        const item = valuesData[i]
        if (item && typeof item === 'object' && 'title' in item && 'description' in item) {
          return {
            icon,
            title: String(item.title),
            description: String(item.description),
          }
        }
        if (typeof item === 'string') {
          return { icon, title: item, description: '' }
        }
        return { icon, title: '', description: '' }
      })
    }

    if (valuesData && typeof valuesData === 'object') {
      return icons.map((icon, i) => {
        const itemKey = `item${i}`
        const item = (valuesData as TranslationObject)[itemKey]

        if (item && typeof item === 'object' && 'title' in item && 'description' in item) {
          return {
            icon,
            title: String(item.title),
            description: String(item.description),
          }
        }

        return { icon, title: typeof item === 'string' ? item : '', description: '' }
      })
    }

    return icons.map((icon) => ({ icon, title: '', description: '' }))
  }, [tObject])

// ---- MISSION ----
export const useMissionStatements = (tObject: TObjectFunction): string[] =>
  useMemo(() => {
    const statements = tObject('hardware.about.mission.statements')
    return Array.isArray(statements) ? (statements as string[]) : []
  }, [tObject])
