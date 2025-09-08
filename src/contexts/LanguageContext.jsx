'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Créer le contexte avec une valeur par défaut typée
const LanguageContext = createContext({ 
  language: 'FR', 
  changeLanguage: () => {} 
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('FR')

  useEffect(() => {
    // Récupérer la langue depuis localStorage si elle existe
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        setLanguage(savedLanguage.toUpperCase())
      }
    }
  }, [])

  const changeLanguage = (newLanguage) => {
    // S'assurer que la langue est toujours en majuscules
    const normalizedLanguage = newLanguage.toUpperCase()
    setLanguage(normalizedLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', normalizedLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}