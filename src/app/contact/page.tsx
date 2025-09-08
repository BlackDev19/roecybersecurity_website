'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, User, MessageSquare, Send, ArrowRight, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message envoyé:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactMethods = [
    { icon: Phone, label: t('contact.methods.phone.label'), value: t('contact.methods.phone.value'), link: "https://wa.me/19126223901", color: "text-green-400" },
    { icon: Mail, label: t('contact.methods.email.label'), value: t('contact.methods.email.value'), link: "mailto:roecybersec@gmail.com", color: "text-blue-400" },
    { icon: MapPin, label: t('contact.methods.address.label'), value: t('contact.methods.address.value'), link: null, color: "text-purple-400" },
    { icon: Clock, label: t('contact.methods.hours.label'), value: t('contact.methods.hours.value'), link: null, color: "text-orange-400" }
  ]

  const inputClass = (field: string) => `
    w-full bg-slate-800/40 border rounded-lg py-3 px-4 text-sm placeholder:text-slate-400 text-white
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    transition-all duration-300
    ${focusedField === field ? 'border-indigo-500 bg-slate-700 shadow-md' : 'border-slate-600'}
  `

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">{t('contact.form.submitButton')} ✅</h2>
          <p className="text-sm text-slate-300">{t('contact.hero.subtitle')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white py-16 px-6 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 leading-tight">{t('contact.hero.title')}</h1>
        <p className="text-base text-slate-300">{t('contact.hero.subtitle')}</p>
      </div>

      {/* Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">

        {/* Coordonnées */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-2">{t('contact.header.contactInfo')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {contactMethods.map((m, i) => {
              const Icon = m.icon
              return (
                <div key={i} className="flex flex-col p-5 bg-slate-800/30 border border-slate-700 rounded-lg hover:bg-slate-700/40 transition-all shadow hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`h-5 w-5 ${m.color}`} />
                    <span className="font-medium">{m.label}</span>
                  </div>
                  {m.link ? (
                    <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                      {m.value}
                    </a>
                  ) : (
                    <span className="text-slate-300">{m.value}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:mt-6">
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/30 border border-slate-700 rounded-xl p-8 shadow-md backdrop-blur-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4">{t('contact.header.sendMessage')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.form.fields.name')}
                  className={inputClass('name') + ' pl-12'}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.form.fields.email')}
                  className={inputClass('email') + ' pl-12'}
                  required
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
                placeholder={t('contact.form.fields.subject')}
                className={inputClass('subject') + ' pl-12'}
                required
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.form.fields.message')}
              rows={6}
              className={inputClass('message') + ' resize-none'}
              required
            />

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-6 rounded-lg font-medium text-white hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
              <Send className="h-4 w-4" /> {t('contact.form.submitButton')} <ArrowRight className="h-3 w-3" />
            </button>

            <p className="text-xs text-slate-400 text-center mt-4">{t('contact.form.privacyNotice')}</p>
          </form>
        </div>
      </div>
    </div>
  )
}
