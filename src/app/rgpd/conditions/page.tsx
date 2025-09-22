'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function ConditionsUtilisation() {
  const { t } = useTranslation()

  const sections = [
    {
      title: t('conditions.sections.objet.title'),
      content: t('conditions.sections.objet.content'),
    },
    {
      title: t('conditions.sections.acces.title'),
      content: t('conditions.sections.acces.content'),
    },
    {
      title: t('conditions.sections.propriete.title'),
      content: t('conditions.sections.propriete.content'),
    },
    {
      title: t('conditions.sections.responsabilites.title'),
      content: t('conditions.sections.responsabilites.content'),
    },
    {
      title: t('conditions.sections.donnees.title'),
      content: t('conditions.sections.donnees.content'),
    },
    {
      title: t('conditions.sections.modifications.title'),
      content: t('conditions.sections.modifications.content'),
    },
    { title: t('conditions.sections.loi.title'), content: t('conditions.sections.loi.content') },
    {
      title: t('conditions.sections.contact.title'),
      content: t('conditions.sections.contact.content'),
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('conditions.title')}</h1>

      <section className="space-y-8">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">{s.title}</h2>
            <p className="text-gray-700 leading-relaxed">{s.content}</p>
          </div>
        ))}

        {/* Section Contact */}
        <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            {t('conditions.sections.contact.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('conditions.sections.contact.content')}
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Email :</strong>{' '}
            <a
              href={`mailto:${t('conditions.contact.email')}`}
              className="text-blue-600 font-medium underline hover:text-blue-800"
            >
              {t('conditions.contact.email')}
            </a>
            <br />
            <strong>Téléphone :</strong>{' '}
            <a
              href={`https://wa.me/${t('conditions.contact.phone')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium underline hover:text-blue-800"
            >
              {t('conditions.contact.phoneDisplay')}
            </a>
            <br />
            <strong>Site web :</strong>{' '}
            <a
              href={t('conditions.contact.website')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium underline hover:text-blue-800"
            >
              {t('conditions.contact.website')}
            </a>
          </p>
        </div>
      </section>

      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <p className="text-center text-blue-800 font-medium">
          {t('conditions.lastUpdate')} :{' '}
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
