'use client'

import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaGithub, FaMobileAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function RegisterPage() {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return alert(t('register.alerts.fillAll'))
    }
    if (form.password !== form.confirm) {
      return alert(t('register.alerts.passwordMismatch'))
    }
    console.log('Inscription avec:', form)
    // Appel API ici
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Texte explicatif */}
      <div className="text-center px-6 py-10 md:py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">{t('register.hero.title')}</h1>
        <p className="text-gray-300 text-lg md:text-xl">
          {t('register.hero.textBeforeLink')}{' '}
          <Link href="/rgpd/conditions" className="text-blue-300 underline hover:text-blue-200">
            {t('register.hero.conditions')}
          </Link>{' '}
          {t('register.hero.textMiddleLink')}{' '}
          <Link href="/rgpd/confidentalite" className="text-blue-300 underline hover:text-blue-200">
            {t('register.hero.privacy')}
          </Link>
          {t('register.hero.textAfterLink')}
        </p>
      </div>

      {/* Deux colonnes */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* LEFT: Social Register */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex flex-col justify-center items-center p-12 bg-gray-800/90 backdrop-blur-lg"
        >
          <h2 className="text-2xl font-semibold mb-8">{t('register.social.title')}</h2>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button className="flex items-center justify-center gap-3 bg-white text-gray-800 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <FcGoogle className="h-5 w-5" /> Google
            </button>

            <button className="flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700">
              <FaApple className="h-5 w-5" /> Apple
            </button>

            <button className="flex items-center justify-center gap-3 bg-gray-700 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600">
              <FaGithub className="h-5 w-5" /> GitHub
            </button>

            <button className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <FaMobileAlt className="h-5 w-5" /> {t('register.social.phone')}
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Form Register */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex flex-col justify-center items-center p-12 bg-blue-900/90 backdrop-blur-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">{t('register.form.title')}</h2>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('register.form.name')}
              className="w-full bg-gray-800/70 border border-gray-600 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('register.form.email')}
              className="w-full bg-gray-800/70 border border-gray-600 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('register.form.password')}
              className="w-full bg-gray-800/70 border border-gray-600 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder={t('register.form.confirmPassword')}
              className="w-full bg-gray-800/70 border border-gray-600 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <button
              onClick={handleRegister}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('register.form.submit')}
            </button>

            <p className="text-sm text-gray-300 text-center">
              {t('register.form.alreadyAccount')}{' '}
              <Link href="/auth/login" className="text-blue-300 hover:text-blue-200 underline">
                {t('register.form.login')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
