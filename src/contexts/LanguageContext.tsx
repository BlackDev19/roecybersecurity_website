'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'FR' | 'EN'

interface LanguageContextType {
  language: Language
  changeLanguage: (newLanguage: Language) => void
}

interface LanguageProviderProps {
  children: ReactNode
}

// Fonction pour déterminer la langue initiale
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'FR'
  try {
    // 1️⃣ Vérifier si une langue est déjà sauvegardée
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && (savedLanguage === 'FR' || savedLanguage === 'EN')) {
      return savedLanguage as Language
    }

    // 2️⃣ Détecter la langue du navigateur
    const browserLang = navigator.language.slice(0, 2).toUpperCase()
    if (browserLang === 'FR' || browserLang === 'EN') {
      return browserLang as Language
    }

    // 3️⃣ Langue par défaut
    return 'FR'
  } catch {
    return 'FR'
  }
}

// Créer le contexte
const LanguageContext = createContext<LanguageContextType>({
  language: 'FR',
  changeLanguage: () => {}
})

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  // Marquer le composant comme monté pour éviter le flash de contenu incorrect
  useEffect(() => {
    setMounted(true)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    try {
      setLanguage(newLanguage)
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage)
      }
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  // Éviter le rendu côté client avant la détection de la langue
  if (!mounted) return null

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
