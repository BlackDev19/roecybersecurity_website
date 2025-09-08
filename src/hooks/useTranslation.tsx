'use client'

import { useLanguage } from '@/contexts/LanguageContext'

// Import des traductions
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'

type Language = 'FR' | 'EN'

interface TranslationOptions {
  returnObjects?: boolean
  default?: string
}

type TranslationType =
  | string
  | number
  | boolean
  | null
  | undefined
  | TranslationObject
  | TranslationType[]

interface TranslationObject {
  [key: string]: TranslationType
}

const translations: Record<Language, TranslationObject> = {
  FR: frTranslations as TranslationObject,
  EN: enTranslations as TranslationObject,
}

const defaultLanguage: Language = 'FR'

// 🔹 Fonction utilitaire pour aller chercher une valeur dans les traductions
function getTranslationValue(
  language: Language,
  key: string,
  options: TranslationOptions = {}
): TranslationType {
  if (!key) return ''

  try {
    const keys = key.split('.')
    let currentValue: TranslationType = translations[language]

    // Fallback si la langue n'existe pas
    if (!currentValue || typeof currentValue !== 'object') {
      console.warn(`Language ${language} not found, falling back to FR`)
      currentValue = translations['FR']
    }

    // Parcours des clés
    for (const k of keys) {
      if (
        currentValue &&
        typeof currentValue === 'object' &&
        !Array.isArray(currentValue) &&
        k in currentValue
      ) {
        currentValue = (currentValue as TranslationObject)[k]
      } else {
        console.warn(`Translation key not found: ${key} in language ${language}`)
        return options.default || key
      }
    }

    return currentValue
  } catch (error) {
    console.error(`Translation error for key "${key}":`, error)
    return options.default || key
  }
}

// 🔹 Hook principal
export const useTranslation = () => {
  const { language } = useLanguage()
  // Normalisation de la casse pour supporter 'fr', 'en', 'FR', 'EN'
  const currentLanguage = ((language || defaultLanguage).toUpperCase()) as Language

  // 🔸 Renvoie toujours une string
  const t = (key: string, options: TranslationOptions = {}): string => {
    const value = getTranslationValue(currentLanguage, key, options)
    return typeof value === 'string' ? value : options.default || key
  }

  // 🔸 Renvoie toujours un objet ou un tableau
  const tObject = (
    key: string,
    options: TranslationOptions = {}
  ): TranslationObject | TranslationType[] => {
    const value = getTranslationValue(currentLanguage, key, {
      ...options,
      returnObjects: true,
    })

    if (value === null || value === undefined) {
      return []
    }

    if (Array.isArray(value)) {
      return value
    }

    if (typeof value === 'object') {
      return value as TranslationObject
    }

    return []
  }

  return { t, tObject, language: currentLanguage }
}
