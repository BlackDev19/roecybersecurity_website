'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Globe, Menu, X, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

// ================== Types ==================
interface NavLink {
  href: string
  key: string
  icon?: React.ComponentType<{ className?: string }>
}

type Language = 'FR' | 'EN'

const LANGUAGES: ReadonlyArray<{ code: Language; name: string; flag: string }> = [
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'EN', name: 'English', flag: '🇺🇸' },
] as const

// ================== Hooks utilitaires ==================
const useScrolled = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = useCallback(() => setScrolled(window.scrollY > threshold), [threshold])
  useEffect(() => {
    const debounced = debounce(handleScroll, 10)
    window.addEventListener('scroll', debounced, { passive: true })
    return () => window.removeEventListener('scroll', debounced)
  }, [handleScroll])
  return scrolled
}

const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) callback()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callback()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [callback])
  return ref
}

const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')

const fadeInUp = { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }
const slideIn = { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -12 } }

const useNavLinks = (): NavLink[] =>
  useMemo(() => [
    { href: '/', key: 'home', icon: undefined },
    { href: '/courses', key: 'courses', icon: undefined },
    { href: '/shop', key: 'shop', icon: undefined },
    { href: '/about', key: 'about' },
    { href: '/careers', key: 'careers' },
    { href: '/contact', key: 'contact' },
  ], [])

// ================== Styles utilitaires ==================
function getLinkStyles(isActive: boolean, variant: 'desktop' | 'mobile' = 'desktop') {
  const base = 'group relative flex items-center gap-3 rounded-2xl transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
  const desktop = 'px-4 py-2.5 text-sm font-medium'
  const mobile = 'px-5 py-4 text-base font-medium'
  const activeStyles = 'text-blue-100 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border border-blue-400/20 shadow-lg shadow-blue-500/5'
  const inactiveStyles = 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
  return cn(base, variant === 'desktop' ? desktop : mobile, isActive ? activeStyles : inactiveStyles)
}

// ================== Composants ==================
const Logo = React.memo(() => {
  const scrolled = useScrolled()
  const { t } = useTranslation()
  return (
    <Link
      href="/"
      aria-label={t('header.home') || 'Accueil - RoeCybersecurity'}
      className="group relative flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-xl"
    >
      <motion.div
        className="flex items-center gap-3"
        animate={{ scale: scrolled ? 0.95 : 1 }}
        whileHover={{ scale: 1.07, rotate: 3 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="relative w-14 h-14">
          <Image
            src="/logo/Roe_Logo.jpg"
            alt="RoeCybersecurity Logo"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-300 bg-clip-text text-transparent transition-all duration-500 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-purple-400">
            RoeCybersecurity
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-400 tracking-wide">{t('header.slogan')}</p>
        </div>
      </motion.div>
    </Link>
  )
})
Logo.displayName = 'Logo'

const LanguageSelector = React.memo(() => {
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useClickOutside(() => setIsOpen(false))
  const shouldReduceMotion = useReducedMotion()

  const isValidLanguage = (code: string): code is Language => LANGUAGES.some(lang => lang.code === code)
  const handleSelect = useCallback((code: string) => {
    if (isValidLanguage(code)) {
      changeLanguage(code)
      setIsOpen(false)
    }
  }, [changeLanguage])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="language-dropdown"
        aria-label={t('header.languageSelector.label')}
        className="group flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <Globe className={cn('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')} />
        <span>{language}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-300', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...fadeInUp}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeInOut' }}
            className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
            role="menu"
            id="language-dropdown"
          >
            <div className="p-1">
              {LANGUAGES.map(({ code, flag }, index) => (
                <motion.button
                  key={code}
                  {...slideIn}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200',
                    language === code ? 'bg-blue-600/20 text-blue-200 font-medium' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )}
                  role="menuitem"
                >
                  <span aria-hidden="true">{flag}</span>
                  <span>{t(`header.languageSelector.${code.toLowerCase()}`)}</span>
                  {language === code && <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
LanguageSelector.displayName = 'LanguageSelector'

const DesktopNavigation = React.memo<{ pathname: string }>(({ pathname }) => {
  const { t } = useTranslation()
  const navLinks = useNavLinks()
  const shouldReduceMotion = useReducedMotion()

  return (
    <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
      {navLinks.map(({ href, key, icon: Icon }, index) => {
        const isActive = pathname === href
        return (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, ease: 'easeInOut' }}
          >
            <Link href={href} prefetch className={getLinkStyles(isActive)}>
              {Icon && <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />}
              <span>{t(`header.navigation.${key}`)}</span>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
})
DesktopNavigation.displayName = 'DesktopNavigation'

const MobileNavigation = React.memo<{ isOpen: boolean; pathname: string; onClose: () => void }>(({ isOpen, pathname, onClose }) => {
  const { t } = useTranslation()
  const navLinks = useNavLinks()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return
    const focusableEls = Array.from(document.querySelectorAll('#mobile-nav a, #mobile-nav button')) as HTMLElement[]
    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]
    firstEl?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    document.addEventListener('keydown', handleTab)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-xl border-t border-white/10 shadow-2xl z-50"
            aria-label="Navigation mobile"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-1">
                {navLinks.map(({ href, key, icon: Icon }, index) => {
                  const isActive = pathname === href
                  return (
                    <motion.div key={href} {...slideIn} transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}>
                      <Link href={href} onClick={onClose} className={getLinkStyles(isActive, 'mobile')}>
                        {Icon && <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />}
                        <span>{t(`header.navigation.${key}`)}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
})
MobileNavigation.displayName = 'MobileNavigation'

// ================== Header ==================
const Header = React.memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const scrolled = useScrolled()

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), [])
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300 bg-gray-950/80 backdrop-blur-xl border-b border-white/10',
      scrolled && 'shadow-xl shadow-black/10'
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <DesktopNavigation pathname={pathname} />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            className="lg:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </button>
        </div>
      </div>
      <MobileNavigation isOpen={isMobileMenuOpen} pathname={pathname} onClose={closeMobileMenu} />
    </header>
  )
})
Header.displayName = 'Header'

export default Header
