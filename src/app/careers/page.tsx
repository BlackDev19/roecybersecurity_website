'use client'

import {
  Briefcase,
  Clock,
  GraduationCap,
  Users,
  Send,
  Heart,
  MapPin,
  Star,
  ExternalLink,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Types
interface Benefit {
  title: string
  description: string
}

interface Job {
  title: string
  department: string
  type: string
  description: string
  experience: string
}

interface ProcessedBenefit extends Benefit {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  iconColor: string
  hoverColor: string
}

interface ProcessedJob extends Job {
  color: string
  id: string
}

// Configuration des icônes et couleurs pour les bénéfices
const BENEFIT_CONFIG = [
  {
    icon: Briefcase,
    color: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
    hoverColor: 'hover:bg-blue-500/15 hover:border-blue-400/30',
  },
  {
    icon: Clock,
    color: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    hoverColor: 'hover:bg-emerald-500/15 hover:border-emerald-400/30',
  },
  {
    icon: GraduationCap,
    color: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-400',
    hoverColor: 'hover:bg-purple-500/15 hover:border-purple-400/30',
  },
  {
    icon: Users,
    color: 'bg-orange-500/10 border-orange-500/20',
    iconColor: 'text-orange-400',
    hoverColor: 'hover:bg-orange-500/15 hover:border-orange-400/30',
  },
] as const

// Configuration des couleurs pour les offres d'emploi
const JOB_COLORS = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-slate-500 to-slate-600',
] as const

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Composant Badge réutilisable
interface BadgeProps {
  icon: React.ReactNode
  text: string
  color?: string
}

const Badge = ({ icon, text, color = 'bg-blue-500/10 text-blue-400' }: BadgeProps) => (
  <div className={`inline-flex items-center gap-2 ${color} rounded-full px-4 py-2`}>
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </div>
)

// Composant Benefit Card
interface BenefitCardProps {
  benefit: ProcessedBenefit
  index: number
}

const BenefitCard = ({ benefit, index }: BenefitCardProps) => {
  const IconComponent = benefit.icon

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`
        group p-6 rounded-xl border transition-all duration-300 cursor-default
        ${benefit.color} ${benefit.hoverColor}
        backdrop-blur-sm
      `}
      role="article"
      aria-labelledby={`benefit-title-${index}`}
    >
      <div className="mb-4">
        <div
          className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          ${benefit.color.replace('/10', '/20')}
          group-hover:scale-110 transition-transform duration-300
        `}
        >
          <IconComponent className={`h-6 w-6 ${benefit.iconColor}`} />
        </div>
      </div>
      <h3
        id={`benefit-title-${index}`}
        className="text-lg font-semibold mb-3 text-white group-hover:text-blue-100 transition-colors"
      >
        {benefit.title}
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
        {benefit.description}
      </p>
    </motion.div>
  )
}

// Composant Job Card
interface JobCardProps {
  job: ProcessedJob
  index: number
  t: (key: string) => string
}

const JobCard = ({ job, index, t }: JobCardProps) => (
  <motion.article
    variants={itemVariants}
    className="
      bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 
      transition-all duration-300 
      hover:border-gray-600/50 hover:bg-gray-800/70
      backdrop-blur-sm
    "
    whileHover={{ y: -4 }}
    aria-labelledby={`job-title-${index}`}
  >
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              id={`job-title-${index}`}
              className="text-xl font-bold mb-3 text-white hover:text-blue-100 transition-colors"
            >
              {job.title}
            </h3>

            {/* Métadonnées du poste */}
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <Briefcase className="h-4 w-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="h-4 w-4" />
                {job.type}
              </span>
              <span className="flex items-center gap-2 text-emerald-400 text-sm">
                <MapPin className="h-4 w-4" />
                {t('careers.jobs.remoteBadge')}
              </span>
            </div>
          </div>

          {/* Badge "Nouveau" pour le premier poste */}
          {index === 0 && (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full px-3 py-1">
              <span className="text-yellow-300 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                {t('careers.jobs.newBadge') || 'Nouveau'}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-300 mb-4 text-sm leading-relaxed">{job.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {t('careers.jobs.experienceBadge').replace('{{experience}}', job.experience)}
          </span>
          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            💼 {t('careers.jobs.fullTimeBadge') || 'Temps plein'}
          </span>
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="lg:text-right">
        <Link
          href="/careers/apply"
          className="
            group inline-flex items-center gap-2 
            bg-gradient-to-r from-blue-600 to-blue-500 
            hover:from-blue-500 hover:to-blue-400
            px-6 py-3 rounded-lg font-medium 
            transition-all duration-200 text-white
            shadow-lg hover:shadow-blue-500/25
            transform hover:scale-105
          "
          aria-label={`Postuler pour ${job.title}`}
        >
          <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          {t('careers.jobs.applyButton')}
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Link>
      </div>
    </div>
  </motion.article>
)

// Composant principal
export default function CareersPage() {
  const { t, tObject } = useTranslation()

  // Traitement des données avec mémoisation
  const benefits = useMemo(() => {
    const benefitsArray = tObject('careers.benefits.items') as Benefit[]
    return benefitsArray.map(
      (b, index): ProcessedBenefit => ({
        ...b,
        ...BENEFIT_CONFIG[index % BENEFIT_CONFIG.length],
      })
    )
  }, [tObject])

  const jobOpenings = useMemo(() => {
    const jobOpeningsArray = tObject('careers.jobs.openings') as Job[]
    return jobOpeningsArray.map(
      (job, index): ProcessedJob => ({
        ...job,
        id: `job-${index}`,
        color: JOB_COLORS[index % JOB_COLORS.length],
      })
    )
  }, [tObject])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.header
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge
            icon={<Heart className="h-4 w-4" />}
            text={t('careers.hero.badge')}
            color="bg-blue-500/10 text-blue-400"
          />

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white mt-8">
            {t('careers.hero.title')}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('careers.hero.company')}
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('careers.hero.description')}
          </p>
        </motion.header>

        {/* Benefits Section */}
        <motion.section
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('careers.benefits.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('careers.benefits.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {benefits.map((benefit, index) => (
              <BenefitCard key={`benefit-${index}`} benefit={benefit} index={index} />
            ))}
          </motion.div>
        </motion.section>

        {/* Job Openings Section */}
        <motion.section
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('careers.jobs.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('careers.jobs.subtitle')}</p>
            {jobOpenings.length > 0 && (
              <div className="mt-4">
                <Badge
                  icon={<Briefcase className="h-4 w-4" />}
                  text={`${jobOpenings.length} ${t('careers.jobs.positionsAvailable') || 'postes disponibles'}`}
                  color="bg-emerald-500/10 text-emerald-400"
                />
              </div>
            )}
          </motion.div>

          {jobOpenings.length > 0 ? (
            <motion.div className="space-y-6" variants={containerVariants}>
              {jobOpenings.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} t={t} />
              ))}
            </motion.div>
          ) : (
            <motion.div className="text-center py-12" variants={itemVariants}>
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30">
                <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {t('careers.jobs.noOpenings.title') || 'Aucune offre pour le moment'}
                </h3>
                <p className="text-gray-400">
                  {t('careers.jobs.noOpenings.description') ||
                    'Revenez bientôt pour découvrir nos nouvelles opportunités !'}
                </p>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Spontaneous Application Section */}
        <motion.section
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <Badge
              icon={<span>🌍</span>}
              text={t('careers.spontaneous.badge')}
              color="bg-purple-500/10 text-purple-400"
            />

            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white mt-6">
              {t('careers.spontaneous.title')}
            </h2>

            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('careers.spontaneous.description')}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/careers/apply"
                className="
                  group inline-flex items-center gap-2 
                  bg-gradient-to-r from-purple-600 to-purple-500 
                  hover:from-purple-500 hover:to-purple-400
                  px-8 py-4 rounded-lg font-semibold text-lg
                  transition-all duration-200 text-white
                  shadow-lg hover:shadow-purple-500/25
                "
                aria-label={t('careers.spontaneous.button')}
              >
                <Send className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                {t('careers.spontaneous.button')}
                <ExternalLink className="h-4 w-4 opacity-70" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
