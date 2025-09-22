'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Eye,
  BookOpenCheck,
  Award,
  Server,
  AlertCircle,
  LockKeyhole,
  LucideIcon,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type Solution = {
  icon: LucideIcon
  key: string // clé correspondant au JSON de traduction
  gradient: string
}

const cyberSolutionsList: Solution[] = [
  { icon: ShieldCheck, key: 'audit', gradient: 'from-slate-700 to-slate-900' },
  { icon: Eye, key: 'pentest', gradient: 'from-indigo-700 to-indigo-900' },
  { icon: BookOpenCheck, key: 'training', gradient: 'from-emerald-700 to-emerald-900' },
  { icon: Award, key: 'certifications', gradient: 'from-yellow-500 to-amber-700' },
  { icon: Server, key: 'infrastructure', gradient: 'from-blue-700 to-cyan-800' },
  { icon: AlertCircle, key: 'monitoring', gradient: 'from-red-700 to-pink-700' },
  { icon: LockKeyhole, key: 'access', gradient: 'from-purple-700 to-violet-800' },
]

export default function CyberSolutionsGrid() {
  const { t } = useTranslation() // si tu utilises un hook de traduction

  return (
    <section className="py-20 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-14">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t('cyberSolutions.hero.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('cyberSolutions.hero.subtitle')}
          </p>
        </header>

        {/* Grid des solutions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cyberSolutionsList.map((solution, index) => {
            const Icon = solution.icon
            return (
              <motion.div
                key={solution.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl shadow-xl bg-gradient-to-br ${solution.gradient} hover:scale-105 transition-transform duration-300`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Icon className="w-8 h-8 text-white" />
                  <h3 className="text-xl font-semibold">
                    {t(`cyberSolutions.${solution.key}.title`)}
                  </h3>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {t(`cyberSolutions.${solution.key}.desc`)}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">{t('cyberSolutions.cta.title')}</h3>
          <p className="text-gray-400 mb-6">{t('cyberSolutions.cta.subtitle')}</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg hover:shadow-xl"
          >
            <ShieldCheck className="w-5 h-5" />
            {t('cyberSolutions.cta.button')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
