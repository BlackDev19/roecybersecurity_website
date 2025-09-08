'use client'

import { Clock, ChevronRight, Play, Lock, Filter, Zap } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

// Simule l’authentification (à remplacer par ton vrai hook d’auth)
const useAuth = () => {
  const isAuthenticated = false // ⚡ change en fonction de ta logique
  return { isAuthenticated }
}

type Course = {
  title: string
  description: string
  lessons: string
  duration: string
  level: string
  price: string
  action: string
  premiumNotice?: string
}

export default function CoursesPage() {
  const { t, tObject } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'premium'>('all')
  const { isAuthenticated } = useAuth()

  // Récupère les cours traduits
  const rawCourses = tObject('courses.coursesList') ?? []
  const courses: Course[] = Array.isArray(rawCourses) ? (rawCourses as Course[]) : []

  // Labels traduits
  const labelAll = t('courses.filters.all')
  const labelFree = t('courses.filters.free')
  const labelPremium = t('courses.filters.premium')

  // Badge textes traduits
  const badgeFree = t('courses.courseBadge.free')
  const badgePremium = t('courses.courseBadge.premium')

  // Stats
  const stats = {
    total: courses.length,
    free: courses.filter(c => c.price === badgeFree).length,
    premium: courses.filter(c => c.price !== badgeFree).length,
  }

  const filteredCourses =
    activeFilter === 'all'
      ? courses
      : courses.filter(c => (activeFilter === 'free' ? c.price === badgeFree : c.price !== badgeFree))

  // Niveaux traduits
  const lvlBeginner = t('courses.levels.beginner')
  const lvlIntermediate = t('courses.levels.intermediate')
  const lvlAdvanced = t('courses.levels.advanced')

  const getLevelStyle = (level: string) => {
    if (level === lvlBeginner) return 'bg-green-600/20 text-green-400 border-green-500/30'
    if (level === lvlIntermediate) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
    if (level === lvlAdvanced) return 'bg-red-600/20 text-red-400 border-red-500/30'
    return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-6">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 font-medium">{t('courses.hero.badge')}</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-300">
            {t('courses.hero.title')}
          </h1>

          <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('courses.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 justify-center items-center">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-400">{t('courses.filters.label')}</span>

          {[
            { key: 'all', label: labelAll, count: stats.total },
            { key: 'free', label: labelFree, count: stats.free },
            { key: 'premium', label: labelPremium, count: stats.premium },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as 'all' | 'free' | 'premium')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeFilter === filter.key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/80 border border-gray-700/50 text-slate-300 hover:text-white'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </section>

      {/* Liste des cours */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {courses.length === 0 ? (
            <p className="text-center text-slate-400">Aucun cours disponible.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, idx) => {
                const isPremium = course.price !== badgeFree
                const targetHref = isAuthenticated
                  ? `/courses/${idx + 1}` // ⚡ Exemple → /courses/1, /courses/2
                  : '/auth/register'

                return (
                  <div key={idx} className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
                    {/* Badge */}
                    <div
                      className={`px-3 py-2 rounded-xl border font-medium text-sm ${
                        isPremium ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' : 'bg-green-600/20 text-green-300 border-green-500/30'
                      }`}
                    >
                      {isPremium ? badgePremium : badgeFree}
                    </div>

                    {/* Contenu */}
                    <div className="space-y-4 mt-4">
                      <h3 className="text-2xl font-bold text-white">{course.title}</h3>
                      <p className="text-slate-300">{course.description}</p>
                    </div>

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <Play className="h-4 w-4" /> {course.lessons}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {course.duration}
                      </span>
                    </div>

                    <div className={`mt-2 px-3 py-1 rounded-xl border font-medium text-sm ${getLevelStyle(course.level)}`}>
                      {course.level}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className={`text-2xl font-bold ${isPremium ? 'text-purple-400' : 'text-green-400'}`}>{course.price}</div>

                      <Link
                        href={targetHref}
                        className={`px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r ${
                          isPremium ? 'from-purple-500 to-pink-500' : 'from-green-500 to-emerald-500'
                        } hover:scale-105 transition-transform duration-300`}
                      >
                        {course.action} <ChevronRight className="h-4 w-4 inline-block" />
                      </Link>
                    </div>

                    {isPremium && course.premiumNotice && (
                      <div className="mt-4 p-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-purple-300 text-sm">
                        <Lock className="h-4 w-4 inline-block mr-2" /> {course.premiumNotice}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
