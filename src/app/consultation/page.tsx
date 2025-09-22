'use client'

import { motion } from 'framer-motion'
import { CalendarDays, ShieldCheck, MessageSquare, Clock, Gift, Award } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const benefits = [
  {
    icon: ShieldCheck,
    titleKey: 'consultation.benefits.riskAnalysis.title',
    descriptionKey: 'consultation.benefits.riskAnalysis.description',
  },
  {
    icon: MessageSquare,
    titleKey: 'consultation.benefits.concreteRecommendations.title',
    descriptionKey: 'consultation.benefits.concreteRecommendations.description',
  },
  {
    icon: CalendarDays,
    titleKey: 'consultation.benefits.strategicSupport.title',
    descriptionKey: 'consultation.benefits.strategicSupport.description',
  },
]

export default function ConsultationPage() {
  const { t } = useTranslation()

  return (
    <section className="bg-gray-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('consultation.header.title')}
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('consultation.header.subtitle')}
          </motion.p>
        </motion.header>

        {/* Avantages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {benefits.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-blue-500/30 transition-all duration-400"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-8 h-8 text-blue-400" />
                  <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                </div>
                <p className="text-gray-300 text-sm">{t(item.descriptionKey)}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-300 mb-8 text-base font-medium">{t('consultation.cta.text')}</p>

          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {t('consultation.cta.button')}
            </span>
          </a>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 text-center">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white text-sm mb-1">
                {t('consultation.info.responseTitle')}
              </h3>
              <p className="text-gray-300 text-xs">{t('consultation.info.responseDesc')}</p>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 text-center">
              <Gift className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white text-sm mb-1">
                {t('consultation.info.freeTitle')}
              </h3>
              <p className="text-gray-300 text-xs">{t('consultation.info.freeDesc')}</p>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 text-center">
              <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white text-sm mb-1">
                {t('consultation.info.certifiedTitle')}
              </h3>
              <p className="text-gray-300 text-xs">{t('consultation.info.certifiedDesc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
