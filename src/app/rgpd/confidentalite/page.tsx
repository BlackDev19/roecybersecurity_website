'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation()

  const sections = [
    { title: t('privacy.sections.responsable.title'), content: t('privacy.sections.responsable.content') },
    { title: t('privacy.sections.donneesCollectees.title'), content: t('privacy.sections.donneesCollectees.content') },
    { title: t('privacy.sections.finalites.title'), content: t('privacy.sections.finalites.content') },
    { title: t('privacy.sections.basesLegales.title'), content: t('privacy.sections.basesLegales.content') },
    { title: t('privacy.sections.dureeConservation.title'), content: t('privacy.sections.dureeConservation.content') },
    { title: t('privacy.sections.partageDonnees.title'), content: t('privacy.sections.partageDonnees.content') },
    { title: t('privacy.sections.vosDroits.title'), content: t('privacy.sections.vosDroits.content') },
    { title: t('privacy.sections.cookies.title'), content: t('privacy.sections.cookies.content') },
    { title: t('privacy.sections.securite.title'), content: t('privacy.sections.securite.content') },
    { title: t('privacy.sections.contact.title'), content: t('privacy.sections.contact.content') }
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('privacy.title')}</h1>

      <section className="space-y-8">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">{s.title}</h2>
            <p className="text-gray-700 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </section>

      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <p className="text-center text-blue-800 font-medium">
          {t('privacy.lastUpdate')} : {new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </main>
  )
}
