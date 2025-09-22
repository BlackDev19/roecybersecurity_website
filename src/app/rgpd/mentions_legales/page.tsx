'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function MentionsLegales() {
  const { t } = useTranslation()

  const sections = [
    {
      title: t('legal.sections.editeur.title'),
      content: t('legal.sections.editeur.content'),
    },
    {
      title: t('legal.sections.responsables.title'),
      content: t('legal.sections.responsables.content'),
    },
    {
      title: t('legal.sections.hebergement.title'),
      content: t('legal.sections.hebergement.content'),
    },
    {
      title: t('legal.sections.contact.title'),
      content: t('legal.sections.contact.content'),
    },
    {
      title: t('legal.sections.propriete.title'),
      content: t('legal.sections.propriete.content'),
    },
    {
      title: t('legal.sections.responsabilite.title'),
      content: t('legal.sections.responsabilite.content'),
    },
    {
      title: t('legal.sections.protectionDonnees.title'),
      content: t('legal.sections.protectionDonnees.content'),
    },
    {
      title: t('legal.sections.litiges.title'),
      content: t('legal.sections.litiges.content'),
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('legal.title')}</h1>

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
          {t('legal.lastUpdate')} :{' '}
          {new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </main>
  )
}
