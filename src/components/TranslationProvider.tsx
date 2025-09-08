'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TranslationProviderProps {
  children: React.ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    // Simuler un court délai pour assurer que l'hydratation est terminée
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  // Pendant le chargement, afficher un placeholder ou rien
  if (isLoading) {
    return null
  }

  return <>{children}</>
}
