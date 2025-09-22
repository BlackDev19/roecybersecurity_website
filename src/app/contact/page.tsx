'use client'

import { useState, useEffect } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    // Validation
    if (!formData.name.trim()) return setErrorMessageAndStop('Le nom est requis')
    if (!formData.email.trim()) return setErrorMessageAndStop("L'email est requis")
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return setErrorMessageAndStop("Format d'email invalide")
    if (!formData.subject.trim()) return setErrorMessageAndStop('Le sujet est requis')
    if (!formData.message.trim()) return setErrorMessageAndStop('Le message est requis')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok)
        throw new Error((data as { error?: string }).error || `Erreur HTTP! statut: ${res.status}`)

      if ((data as { success?: boolean; error?: string }).success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setErrorMessage((data as { error?: string }).error || "Une erreur s'est produite")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Erreur de réseau')
      }
      console.error('Erreur:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const setErrorMessageAndStop = (message: string) => {
    setErrorMessage(message)
    setIsLoading(false)
    return
  }

  const contactMethods = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+1 912-622-3901',
      link: 'https://wa.me/19126223901',
      color: 'text-green-400',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'roecybersec@gmail.com',
      link: 'mailto:roecybersec@gmail.com',
      color: 'text-blue-400',
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: '123 Cyber Street, Security City',
      link: null,
      color: 'text-purple-400',
    },
    {
      icon: Clock,
      label: 'Horaires',
      value: 'Lun-Ven: 9h-18h',
      link: null,
      color: 'text-orange-400',
    },
  ]

  const inputClass = (field: string) => `
    w-full bg-slate-800/40 border rounded-lg py-3 px-4 text-sm placeholder:text-slate-400 text-white
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    transition-all duration-300
    ${focusedField === field ? 'border-indigo-500 bg-slate-700 shadow-md' : 'border-slate-600'}
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white py-16 px-6 flex flex-col items-center relative">
      {/* Toast succès et erreur */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.4 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-400/20"
          >
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Message envoyé avec succès !</p>
              <p className="text-sm text-emerald-100">Nous vous répondrons bientôt.</p>
            </div>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.4 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-red-400/20 max-w-md"
          >
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="font-semibold">Erreur</p>
              <p className="text-sm text-red-100">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 leading-tight">Contactez-nous</h1>
        <p className="text-base text-slate-300">
          Nous sommes là pour répondre à toutes vos questions sur la cybersécurité.
        </p>
      </div>

      {/* Grid contact info + form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Contact info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-2">Informations de contact</h2>
          <div className="grid grid-cols-1 gap-4">
            {contactMethods.map((m, i) => {
              const Icon = m.icon
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex flex-col p-5 bg-slate-800/30 border border-slate-700 rounded-lg hover:bg-slate-700/40 transition-all shadow hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`h-5 w-5 ${m.color}`} />
                    <span className="font-medium">{m.label}</span>
                  </div>
                  {m.link ? (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {m.value}
                    </a>
                  ) : (
                    <span className="text-slate-300">{m.value}</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:mt-6">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 bg-slate-800/30 border border-slate-700 rounded-xl p-8 shadow-md backdrop-blur-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4">Envoyer un message</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Votre nom complet"
                  className={inputClass('name') + ' pl-12'}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Votre adresse email"
                  className={inputClass('email') + ' pl-12'}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField('')}
                placeholder="Sujet du message"
                className={inputClass('subject') + ' pl-12'}
                required
                disabled={isLoading}
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField('')}
              placeholder="Votre message"
              rows={6}
              className={inputClass('message') + ' resize-none'}
              required
              disabled={isLoading}
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 shadow-md hover:shadow-xl ${
                isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer le message
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </motion.button>

            <p className="text-xs text-slate-400 text-center mt-4">
              Nous respectons votre vie privée et ne partageons pas vos informations.
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
