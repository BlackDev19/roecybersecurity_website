'use client'

import { Briefcase, Clock, GraduationCap, Users, Send, Heart } from 'lucide-react'
import Link from "next/link"
import { useTranslation } from '@/hooks/useTranslation'

export default function CareersPage() {
  const { t, tObject } = useTranslation()
  
  // 🔹 Récupération des avantages depuis le JSON
  const benefitsArray = tObject('careers.benefits.items') as Array<{ title: string; description: string }>
  const benefits = benefitsArray.map((b, index) => ({
    icon: [Briefcase, Clock, GraduationCap, Users][index],
    title: b.title,
    description: b.description,
    color: [
      "bg-blue-500/10 border-blue-500/20",
      "bg-emerald-500/10 border-emerald-500/20",
      "bg-purple-500/10 border-purple-500/20",
      "bg-orange-500/10 border-orange-500/20"
    ][index]
  }))

  // 🔹 Récupération des offres d'emploi depuis le JSON
  const jobOpeningsArray = tObject('careers.jobs.openings') as Array<{ title: string; department: string; type: string; description: string; experience: string }>
  const jobOpenings = jobOpeningsArray.map((job, index) => ({
    ...job,
    color: [
      "from-blue-500 to-blue-600",
      "from-emerald-500 to-emerald-600",
      "from-slate-500 to-slate-600"
    ][index]
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 mb-8">
            <Heart className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              {t('careers.hero.badge')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t('careers.hero.title')}
            <br />
            <span className="text-blue-400">{t('careers.hero.company')}</span>
          </h1>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('careers.hero.description')}
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t('careers.benefits.title')}
            </h2>
            <p className="text-gray-400">{t('careers.benefits.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div 
                  key={index} 
                  className={`group p-6 rounded-xl border transition-all duration-300 ${benefit.color}`}
                >
                  <div className="mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Job Openings */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t('careers.jobs.title')}
            </h2>
            <p className="text-gray-400">{t('careers.jobs.subtitle')}</p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 transition-all duration-300 hover:border-gray-600/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <span className="flex items-center gap-2 text-gray-400 text-sm">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-2 text-gray-400 text-sm">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-2 text-blue-400 text-sm">
                            🌍 {t('careers.jobs.remoteBadge')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
                        🎯 {t('careers.jobs.experienceBadge').replace('{{experience}}', job.experience)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="lg:text-right">
                    <Link
                      href="/careers/apply"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-white"
                    >
                      <Send className="h-4 w-4" />
                      {t('careers.jobs.applyButton')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spontaneous Application */}
        <section className="text-center">
          <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 rounded-full px-3 py-1 mb-4">
              <span className="text-sm text-purple-400 font-medium">
                🌍 {t('careers.spontaneous.badge')}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">
              {t('careers.spontaneous.title')}
            </h2>
            
            <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm">
              {t('careers.spontaneous.description')}
            </p>
            
            <Link
              href="/careers/apply"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-white"
            >
              <Send className="h-4 w-4" />
              {t('careers.spontaneous.button')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
