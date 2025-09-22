'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Send,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { AnimatePresence, motion } from 'framer-motion'

// Types
interface FormDataType {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  message: string
  resume: File | null
}

interface ToastState {
  show: boolean
  type: 'success' | 'error'
  message: string
}

interface ValidationError {
  field: string
  message: string
}

// Configuration
const ACCEPTED_FILE_TYPES = ['.pdf', '.doc', '.docx'] as const
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const TOAST_DURATION = 4000

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateFile = (
  file: File | null,
  t: (key: string, options?: Record<string, string>) => string
): ValidationError | null => {
  if (!file) return { field: 'resume', message: t('apply.status.error.requiredFields') }

  if (file.size > MAX_FILE_SIZE) {
    return { field: 'resume', message: t('apply.status.error.fileTooLarge') }
  }

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ACCEPTED_FILE_TYPES.includes(fileExtension as (typeof ACCEPTED_FILE_TYPES)[number])) {
    return { field: 'resume', message: t('apply.status.error.invalidFileType') }
  }

  return null
}

const validateForm = (
  formData: FormDataType,
  t: (key: string, options?: Record<string, string>) => string
): ValidationError | null => {
  if (!formData.firstName.trim())
    return {
      field: 'firstName',
      message: t('apply.status.error.requiredField', { field: t('apply.form.labels.firstName') }),
    }
  if (!formData.lastName.trim())
    return {
      field: 'lastName',
      message: t('apply.status.error.requiredField', { field: t('apply.form.labels.lastName') }),
    }
  if (!formData.email.trim())
    return {
      field: 'email',
      message: t('apply.status.error.requiredField', { field: t('apply.form.labels.email') }),
    }
  if (!formData.position)
    return {
      field: 'position',
      message: t('apply.status.error.requiredField', { field: t('apply.form.labels.position') }),
    }

  if (!validateEmail(formData.email)) {
    return { field: 'email', message: t('apply.status.error.invalidEmail') }
  }

  return validateFile(formData.resume, t)
}

// Toast Component
const Toast = ({ toast, onClose }: { toast: ToastState; onClose: () => void }) => (
  <AnimatePresence>
    {toast.show && (
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.4 }}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl text-white font-medium shadow-2xl flex items-center gap-3 z-50 border max-w-md min-w-80 ${
          toast.type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-400/20'
            : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400/20'
        }`}
        role="alert"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-6 w-6 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
          )}
        </motion.div>
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {toast.type === 'success' ? 'Succès !' : 'Erreur'}
          </p>
          <p className="text-sm opacity-90">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
)

// useToast Hook
const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' })

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }))
  }, [])

  return { toast, showToast, hideToast }
}

// Main Component
export default function ApplyPage() {
  const { language } = useLanguage()
  const { t, tObject } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    resume: null,
  })
  const [focusedField] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { toast, showToast, hideToast } = useToast()

  const availablePositions = useMemo(() => {
    return tObject('apply.form.positions') as { value: string; label: string }[]
  }, [language, tObject])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }

      if (toast.show && toast.type === 'error') hideToast()
    },
    [fieldErrors, toast.show, toast.type, hideToast]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null

      if (file) {
        const fileError = validateFile(file, t)
        if (fileError) {
          showToast('error', fileError.message)
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }
      }

      setFormData((prev) => ({ ...prev, resume: file }))

      if (fieldErrors.resume) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.resume
          return newErrors
        })
      }

      if (toast.show && toast.type === 'error') hideToast()
    },
    [fieldErrors.resume, t, toast.show, toast.type, showToast, hideToast]
  )

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      message: '',
      resume: null,
    })
    setFieldErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const validationError = validateForm(formData, t)
      if (validationError) {
        setFieldErrors({ [validationError.field]: validationError.message })
        showToast('error', validationError.message)
        const fieldElement = document.getElementById(validationError.field)
        fieldElement?.focus()
        return
      }

      setLoading(true)
      setFieldErrors({})

      try {
        const payload = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) payload.append(key, value)
          else if (value !== null) payload.append(key, String(value))
        })
        payload.append('language', language)

        const res = await fetch('/api/apply', { method: 'POST', body: payload })
        const data = await res.json()

        if (!res.ok || data.error)
          showToast('error', data.message || t('apply.status.error.message'))
        else {
          showToast('success', t('apply.status.success.message'))
          resetForm()
        }
      } catch (err) {
        console.error('Erreur lors de la soumission:', err)
        showToast('error', t('apply.status.error.network'))
      } finally {
        setLoading(false)
      }
    },
    [formData, t, language, showToast, resetForm]
  )

  const inputClasses = useCallback(
    (fieldName: string, hasError: boolean = false) =>
      `
    w-full bg-gray-800 border ${hasError ? 'border-red-500' : 'border-gray-600/50'} rounded-xl py-4 pl-12 pr-4
    text-white placeholder-gray-400
    focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-400/30 focus:border-red-400/50' : 'focus:ring-blue-400/30 focus:border-blue-400/50'}
    transition-all duration-200
    ${focusedField === fieldName && !hasError ? 'shadow-lg shadow-blue-500/10 bg-gray-700' : ''}
    ${hasError ? 'shadow-lg shadow-red-500/10' : ''}
    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
  `.trim(),
    [focusedField, loading]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* En-tête */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">{t('apply.hero.badge')}</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-white">
            {t('apply.hero.title')} <span className="text-blue-400">{t('apply.hero.company')}</span>
          </h1>
          <p className="text-gray-300 text-lg">{t('apply.hero.description')}</p>
        </header>

        {/* Formulaire */}
        <main className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Form fields… */}
            {/* Reste du code inchangé, juste s’assurer que aria-invalid={!!fieldErrors[field]} */}
          </form>
        </main>

        <nav className="text-center mt-12">
          <a
            href="/careers"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('apply.backLink')}
          </a>
        </nav>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  )
}
