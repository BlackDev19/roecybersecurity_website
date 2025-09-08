'use client'

import { useState, useMemo } from 'react'
import { User, Mail, Phone, Briefcase, ArrowLeft, CheckCircle, Send, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

interface FormDataType {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  message: string
  resume: File | null
}

export default function ApplyPage() {
  const { language } = useLanguage()
  const { t, tObject } = useTranslation() // <-- Ici on récupère tObject aussi

  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    resume: null,
  })
  const [focusedField, setFocusedField] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // --- Options de postes dynamiques selon la langue ---
  const availablePositions = useMemo(() => {
    return tObject('apply.form.positions') as { value: string; label: string }[]
  }, [language, tObject])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.resume) {
      alert(t('apply.form.fileUpload.requiredAlert'))
      return
    }
    setLoading(true)

    try {
      const payload = new FormData()
      payload.append('firstName', formData.firstName)
      payload.append('lastName', formData.lastName)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('position', formData.position)
      payload.append('message', formData.message)
      payload.append('language', language)
      if (formData.resume) payload.append('resume', formData.resume)

      const res = await fetch('/api/apply', { method: 'POST', body: payload })
      if (!res.ok) throw new Error('Erreur lors de l\'envoi')
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = (fieldName: string) => `
    w-full bg-gray-800 border border-gray-600/50 rounded-xl py-4 pl-12 pr-4
    text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50
    transition-all duration-200
    ${focusedField === fieldName ? 'shadow-lg shadow-blue-500/10 bg-gray-700' : ''}
  `

  // --- Affichage succès après envoi ---
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">{t('apply.status.success.title')}</h2>
          <p className="text-gray-300 text-sm mb-8 leading-relaxed">{t('apply.status.success.message')}</p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-white"
          >
            {t('apply.status.success.button')}
          </button>
        </div>
      </div>
    )
  }

  // --- Formulaire ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">{t('apply.hero.badge')}</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-white">
            {t('apply.hero.title')} <span className="text-blue-400">{t('apply.hero.company')}</span>
          </h1>
          <p className="text-gray-300 text-lg">{t('apply.hero.description')}</p>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Infos perso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['firstName', 'lastName'].map((field) => (
                <div key={field} className="space-y-3">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-200">
                    {t(`apply.form.labels.${field}`)} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id={field}
                      name={field}
                      type="text"
                      value={formData[field as 'firstName' | 'lastName']}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field)}
                      onBlur={() => setFocusedField('')}
                      className={inputClasses(field)}
                      placeholder={t(`apply.form.placeholders.${field}`)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['email', 'phone'].map((field) => (
                <div key={field} className="space-y-3">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-200">
                    {t(`apply.form.labels.${field}`)} {field === 'email' ? '*' : ''}
                  </label>
                  <div className="relative">
                    {field === 'email' ? (
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    )}
                    <input
                      id={field}
                      name={field}
                      type={field === 'email' ? 'email' : 'tel'}
                      value={formData[field as 'email' | 'phone']}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field)}
                      onBlur={() => setFocusedField('')}
                      className={inputClasses(field)}
                      placeholder={t(`apply.form.placeholders.${field}`)}
                      {...(field === 'email' ? { required: true } : {})}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sélection du poste */}
            <div className="space-y-3">
              <label htmlFor="position" className="block text-sm font-medium text-gray-200">
                {t('apply.form.labels.position')} *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('position')}
                  onBlur={() => setFocusedField('')}
                  className={`${inputClasses('position')} appearance-none bg-gray-800 text-white cursor-pointer`}
                  required
                >
                  <option value="">{t('apply.form.placeholders.position')}</option>
                  {availablePositions.map((pos) => (
                    <option key={pos.value} value={pos.value} className="bg-gray-800 text-white">
                      {pos.label} {/* Emoji + traduction */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload CV */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">
                {t('apply.form.labels.resume')} *
              </label>
              <label
                htmlFor="resume"
                className="block w-full text-sm text-gray-300 py-2 px-4 rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-500 text-center"
              >
                {t('apply.form.fileUpload.chooseFile')}
              </label>
              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <div className="text-green-400 text-sm mt-1 flex items-center gap-1">
                {formData.resume ? (
                  <>
                    <span>✅</span>
                    <span>{t('apply.form.fileUpload.selected').replace('{{filename}}', formData.resume.name)}</span>
                  </>
                ) : (
                  <span>{t('apply.form.fileUpload.noFileSelected')}</span>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                {t('apply.form.labels.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses('message')} resize-none pt-4 pl-4 bg-gray-800 text-white`}
                placeholder={t('apply.form.placeholders.message')}
              />
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 px-6 rounded-xl font-medium transition-all duration-200 text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? t('apply.form.submitButton.loading') : (
                <>
                  <Send className="h-5 w-5" />
                  {t('apply.form.submitButton.text')}
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">
                ❌ {t('apply.status.error.message')}
              </p>
            )}
          </form>
        </div>

        {/* Retour */}
        <div className="text-center mt-12">
          <a href="/careers" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 text-sm">
            <ArrowLeft className="h-4 w-4" />
            {t('apply.backLink')}
          </a>
        </div>
      </div>
    </div>
  )
}
