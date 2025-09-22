'use client'

// Animation configurations optimisées
const ANIMATION_CONFIG = {
  duration: { fast: 0.3, normal: 0.8, slow: 1.2 },
  ease: 'easeInOut' as Easing,
  threshold: { scroll: 20, intersection: 0.1 },
  intervals: { slogan: 4000, carousel: 3000 },
}

import {
  ShieldCheck,
  BookOpenCheck,
  ShoppingBag,
  UserPlus,
  AlertCircle,
  Eye,
  Award,
  Cpu,
  Server,
  Monitor,
  LucideProps,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion, useReducedMotion, Easing } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect, useCallback, memo, Ref, SetStateAction, Dispatch } from 'react'
import { FaLinkedin, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa'

// Animation configurations optimisées
type NavigationButtonConfig = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  textKey: string
  href: string
  className: string
  shouldPulse?: boolean
}

const NAVIGATION_BUTTONS: NavigationButtonConfig[] = [
  {
    icon: ShieldCheck,
    textKey: 'buttons.aboutUs',
    href: '/about',
    className: 'bg-slate-600 hover:bg-slate-500',
  },
  {
    icon: UserPlus,
    textKey: 'buttons.register',
    href: '/auth/register',
    className: 'bg-amber-600 hover:bg-amber-500',
  },
  {
    icon: ShoppingBag,
    textKey: 'buttons.shop',
    href: '/shop',
    className: 'bg-emerald-600 hover:bg-emerald-500',
  },
  {
    icon: BookOpenCheck,
    textKey: 'buttons.hardwareShop',
    href: '/shop',
    className: 'bg-violet-600 hover:bg-violet-500',
  },
  {
    icon: AlertCircle,
    textKey: 'buttons.contact',
    href: '/contact',
    className: 'bg-rose-600 hover:bg-rose-500',
    shouldPulse: true,
  },
]

// Images du carousel hardware
const HARDWARE_CAROUSEL = [
  '/images/laptop/laptop_1.png',
  '/images/laptop/laptop_2.png',
  '/images/laptop/laptop_3.png',
]

// Caractéristiques techniques du hardware avec couleurs adoucies
const HARDWARE_SPECIFICATIONS = [
  {
    icon: Cpu,
    labelKey: 'specifications.performance',
    descKey: 'specifications.performanceDesc',
    gradient: 'from-indigo-400 to-indigo-500',
  },
  {
    icon: Server,
    labelKey: 'specifications.ram',
    descKey: 'specifications.ramDesc',
    gradient: 'from-sky-400 to-sky-500',
  },
  {
    icon: Monitor,
    labelKey: 'specifications.graphics',
    descKey: 'specifications.graphicsDesc',
    gradient: 'from-teal-400 to-teal-500',
  },
  {
    icon: ShieldCheck,
    labelKey: 'specifications.security',
    descKey: 'specifications.securityDesc',
    gradient: 'from-orange-400 to-orange-500',
  },
]

// Services de cybersécurité proposés avec couleurs adoucies
const CYBERSECURITY_SERVICES: Array<{
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  title: string
  description: string
  gradient: string
}> = [
  {
    icon: ShieldCheck,
    title: 'Audit de Sécurité',
    description:
      "80 % des entreprises ayant subi une violation de données n'avaient not réalisé d'audit complet. Nos audits identifient les failles critiques avant qu'elles ne soient exploitées.",
    gradient: 'from-slate-400 to-slate-500',
  },
  {
    icon: Eye,
    title: "Test d'Intrusion",
    description:
      "En 2022, plus de 493 millions d'attaques par ransomware ont été détectées dans le monde. Nos pentests simulent ces menaces pour renforcer vos défenses.",
    gradient: 'from-indigo-400 to-indigo-500',
  },
  {
    icon: BookOpenCheck,
    title: 'Formation',
    description:
      '20 % des violations sont dues à des erreurs humaines. Nos formations interactives réduisent ce risque en renforçant les compétences de vos équipes.',
    gradient: 'from-emerald-400 to-emerald-500',
  },
  {
    icon: Award,
    title: 'Certifications',
    description:
      'La certification ISO 27001 est reconnue mondialement et exigée dans les secteurs sensibles. Nous vous accompagnement vers ISO 27001, SOC 2 et RGPD.',
    gradient: 'from-amber-400 to-amber-500',
  },
]

// Factory pour créer les variantes d'animation
const createAnimationVariants = (reducedMotion: boolean) => ({
  fadeInUp: reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      },

  buttonHover: reducedMotion
    ? {
        scale: 1,
        transition: { duration: 0 },
      }
    : {
        y: -3,
        transition: {
          duration: ANIMATION_CONFIG.duration.fast,
          ease: ANIMATION_CONFIG.ease,
        },
      },

  cardHover: reducedMotion
    ? {
        scale: 1,
        transition: { duration: 0 },
      }
    : {
        y: -4,
        transition: {
          duration: ANIMATION_CONFIG.duration.fast,
          ease: ANIMATION_CONFIG.ease,
        },
      },
})

// Hook personnalisé pour détecter le scroll avec optimisation des performances
const useScrollDetection = (threshold = ANIMATION_CONFIG.threshold.scroll) => {
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScrollEvent = useCallback(() => {
    const scrolled = window.scrollY > threshold
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled)
    }
  }, [threshold, isScrolled])

  useEffect(() => {
    let rafId: number | null = null

    const throttledScrollHandler = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScrollEvent()
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [handleScrollEvent])

  return isScrolled
}

// Hook personnalisé pour l'observation des intersections
const useElementVisibility = (options: IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!targetRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: ANIMATION_CONFIG.threshold.intersection,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(targetRef)
    return () => observer.disconnect()
  }, [targetRef, options])

  return [setTargetRef, isVisible] as [Dispatch<SetStateAction<HTMLElement | null>>, boolean]
}

// Hook pour gérer l'état d'un carousel
const useCarouselState = (
  itemsLength: number,
  autoPlayInterval = ANIMATION_CONFIG.intervals.carousel
) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlayInterval) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemsLength)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [itemsLength, autoPlayInterval])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + itemsLength) % itemsLength)
  }, [itemsLength])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemsLength)
  }, [itemsLength])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  return {
    currentIndex,
    goToPrevious,
    goToNext,
    goToSlide,
  }
}

// Hook pour gérer la rotation des slogans
const useRotatingContent = (items: string[], interval = ANIMATION_CONFIG.intervals.slogan) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!interval) return

    const rotationInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval)

    return () => clearInterval(rotationInterval)
  }, [items.length, interval])

  return currentIndex
}

// Composant bouton de navigation réutilisable
interface NavigationButtonProps {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  text: string
  href?: string
  className: string
  shouldPulse?: boolean
  onClick?: () => void
}

const NavigationButton = memo(
  ({ icon: Icon, text, href, className, shouldPulse, onClick }: NavigationButtonProps) => {
    const animations = createAnimationVariants(useReducedMotion() ?? false)

    // Si href est fourni, utilisez un lien
    if (href) {
      return (
        <Link href={href} className="w-max">
          <motion.div
            whileHover={animations.buttonHover}
            whileFocus={animations.buttonHover}
            className={`
            flex items-center gap-2 px-7 py-4 rounded-3xl font-semibold text-white
            transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer
            ${className} ${shouldPulse ? 'animate-pulse' : ''}
          `}
          >
            {Icon && <Icon className="h-5 w-5" />}
            {text}
          </motion.div>
        </Link>
      )
    }

    // Sinon, utilisez un bouton
    return (
      <motion.button
        whileHover={animations.buttonHover}
        whileFocus={animations.buttonHover}
        className={`
        flex items-center gap-2 px-7 py-4 rounded-3xl font-semibold text-white
        transition-all duration-300 hover:shadow-lg active:scale-95
        ${className} ${shouldPulse ? 'animate-pulse' : ''}
      `}
        onClick={onClick}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {text}
      </motion.button>
    )
  }
)

NavigationButton.displayName = 'NavigationButton'

// Composant carte de service réutilisable
interface ServiceCardProps {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  title: string
  description: string
  gradient: string
}

const ServiceCard = memo(({ icon: Icon, title, description, gradient }: ServiceCardProps) => {
  const animations = createAnimationVariants(useReducedMotion() ?? false)

  return (
    <motion.div
      whileHover={animations.cardHover}
      className="p-6 bg-white border border-gray-200 rounded-3xl shadow-md 
                 transition-all duration-300 hover:border-blue-200 h-full flex flex-col group relative overflow-hidden"
    >
      {/* Effet de lueur bleue au survol */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
      </div>

      <div
        className={`
        w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl 
        flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10
      `}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-sans tracking-tight relative z-10 group-hover:text-blue-800 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-700 text-sm flex-grow leading-relaxed relative z-10 group-hover:text-blue-700 transition-colors duration-300">
        {description}
      </p>
    </motion.div>
  )
})

ServiceCard.displayName = 'ServiceCard'

// Composant carte de spécification hardware
interface SpecificationCardProps {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  label: string
  description: string
  gradient: string
}

const SpecificationCard = memo(
  ({ icon: Icon, label, description, gradient }: SpecificationCardProps) => {
    const animations = createAnimationVariants(useReducedMotion() ?? false)

    return (
      <motion.div
        whileHover={{
          y: -4,
          scale: 1.03,
          transition: { duration: ANIMATION_CONFIG.duration.fast, ease: ANIMATION_CONFIG.ease },
        }}
        className="flex items-start gap-3 bg-gray-800/60 p-4 rounded-2xl 
                 shadow-md transition-all duration-300 group relative overflow-hidden"
      >
        {/* Effet de lueur bleue au survol */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
        </div>

        <div
          className={`
        w-12 h-12 rounded-xl flex items-center justify-center 
        bg-gradient-to-br ${gradient} relative z-10
      `}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="relative z-10">
          <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
            {label}
          </h4>
          <p className="text-gray-300 text-sm group-hover:text-blue-200 transition-colors duration-300">
            {description}
          </p>
        </div>
      </motion.div>
    )
  }
)

SpecificationCard.displayName = 'SpecificationCard'

// Composant contrôles de carousel
interface CarouselControlsProps {
  currentIndex: number
  totalItems: number
  onPrevious: () => void
  onNext: () => void
  onDotClick: (index: number) => void
}

const CarouselControls = memo(
  ({ currentIndex, totalItems, onPrevious, onNext, onDotClick }: CarouselControlsProps) => (
    <>
      {/* Flèches de navigation */}
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white 
                 bg-black/50 p-3 rounded-full hover:bg-black/70 
                 transition-colors duration-200 z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white 
                 bg-black/50 p-3 rounded-full hover:bg-black/70 
                 transition-colors duration-200 z-10"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicateurs de position */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: totalItems }, (_, index) => (
          <button
            key={index}
            className={`
            w-3 h-3 rounded-full cursor-pointer transition-colors duration-200
            ${index === currentIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'}
          `}
            onClick={() => onDotClick(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
)

CarouselControls.displayName = 'CarouselControls'

// Section Hero avec logo et navigation principale
const HeroSection = memo(() => {
  const isScrolled = useScrollDetection()
  const prefersReducedMotion = !!useReducedMotion()
  const animations = createAnimationVariants(prefersReducedMotion)
  const { t, tObject } = useTranslation()
  const rawSlogans = tObject('hero.rotatingSlogans')
  const slogans = Array.isArray(rawSlogans)
    ? (rawSlogans.filter((s) => typeof s === 'string') as string[])
    : []
  const currentSloganIndex = useRotatingContent(slogans)

  return (
    <section
      className="relative min-h-[85vh] flex flex-col items-center justify-start 
                        px-4 pt-20 pb-8 bg-gradient-to-b from-gray-950 via-gray-900 
                        to-gray-950 text-center overflow-hidden"
    >
      {/* Logo principal animé */}
      <motion.div
        initial={{ scale: 0.95, y: -10 }}
        animate={{
          scale: isScrolled ? 0.9 : 1,
          y: isScrolled ? -20 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration.fast,
          ease: ANIMATION_CONFIG.ease,
        }}
        className="relative inline-block mb-12 -translate-y-6 group"
      >
        <div
          className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"
          aria-hidden="true"
        />
        <div
          className="h-44 w-44 sm:h-52 sm:w-52 rounded-3xl overflow-hidden 
                        border border-gray-700/50 shadow-2xl relative group-hover:border-blue-500/30 transition-all duration-500"
        >
          <Image
            src="/logo/Roe_Logo.jpg"
            alt="ROE Cybersecurity Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div
          className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 
                        to-teal-500 text-white text-xs px-2 py-1 rounded-full 
                        font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
        >
          Expert
        </div>
      </motion.div>

      {/* Titre principal */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={animations.fadeInUp}
        transition={{ duration: ANIMATION_CONFIG.duration.normal }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 font-sans tracking-tight"
      >
        {t('hero.welcome')}{' '}
        <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
          {t('hero.companyName')}
        </span>
      </motion.h1>

      {/* Sous-titre */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={animations.fadeInUp}
        transition={{ duration: ANIMATION_CONFIG.duration.slow }}
        className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 font-medium"
      >
        {t('hero.subtitle')}
      </motion.p>

      {/* Boutons de navigation */}
      <motion.div className="flex flex-wrap justify-center gap-5 mb-4">
        {NAVIGATION_BUTTONS.map((button, index) => (
          <div key={button.textKey + index} className="relative group">
            <NavigationButton
              icon={button.icon}
              text={t(button.textKey)}
              href={button.href}
              className={button.className}
              shouldPulse={button.shouldPulse}
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
          </div>
        ))}
      </motion.div>

      {/* Slogan rotatif */}
      <motion.p
        key={currentSloganIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ANIMATION_CONFIG.duration.normal }}
        className="mt-12 text-lg text-gray-200 font-medium max-w-2xl mx-auto"
      >
        {slogans[currentSloganIndex]}
      </motion.p>

      {/* Badge d'approbation SAM.gov */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-2 rounded-full border border-blue-700/30"
      >
        <CheckCircle className="h-5 w-5 text-green-400" />
        <span className="text-sm text-blue-200">
          {t('hero.samApproved')}{' '}
          <a
            href={t('hero.samLink')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-100 underline transition-colors"
          >
            {t('hero.samLinkText')}
          </a>
        </span>
      </motion.div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

// Section présentation du hardware avec carousel
const HardwareShowcaseSection = memo(() => {
  const prefersReducedMotion = !!useReducedMotion()
  const animations = createAnimationVariants(prefersReducedMotion)
  const { t } = useTranslation()
  const carousel = useCarouselState(HARDWARE_CAROUSEL.length)

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={animations.fadeInUp}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center 
                     justify-between gap-8"
        >
          {/* Carousel d'images */}
          <div
            className="relative w-full lg:w-1/2 rounded-3xl overflow-hidden 
                          shadow-lg h-96"
          >
            {HARDWARE_CAROUSEL.map((imageSrc, index) => (
              <motion.div
                key={`${imageSrc}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === carousel.currentIndex ? 1 : 0 }}
                transition={{
                  duration: ANIMATION_CONFIG.duration.normal,
                  ease: ANIMATION_CONFIG.ease,
                }}
                className="absolute inset-0"
              >
                <Image
                  src={imageSrc}
                  alt={`Configuration hardware ${index + 1}`}
                  fill
                  className="object-cover w-full h-full rounded-3xl"
                />
              </motion.div>
            ))}

            <CarouselControls
              currentIndex={carousel.currentIndex}
              totalItems={HARDWARE_CAROUSEL.length}
              onPrevious={carousel.goToPrevious}
              onNext={carousel.goToNext}
              onDotClick={carousel.goToSlide}
            />
          </div>

          {/* Contenu textuel et spécifications */}
          <motion.div
            className="flex-1 flex flex-col items-center lg:items-start 
                                 gap-6 px-4 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
              {t('ordinateur.title')}
            </h2>
            <p className="text-lg text-gray-300 mb-6 font-medium">{t('ordinateur.subtitle')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {HARDWARE_SPECIFICATIONS.map((spec, index) => (
                <SpecificationCard
                  key={`${spec.labelKey}-${index}`}
                  icon={spec.icon}
                  label={t(spec.labelKey)}
                  description={t(spec.descKey)}
                  gradient={spec.gradient}
                />
              ))}
            </div>

            <div className="relative group">
              <NavigationButton
                icon={Cpu}
                text={t('buttons.hardwareShop')}
                href="/shop"
                className="bg-slate-600 hover:bg-slate-500 rounded-3xl"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

HardwareShowcaseSection.displayName = 'HardwareShowcaseSection'

// Section présentation des services
const ServicesShowcaseSection = memo(() => {
  const prefersReducedMotion = !!useReducedMotion()
  const animations = createAnimationVariants(prefersReducedMotion)
  const { t, tObject } = useTranslation()
  const [sectionRef, isVisible] = useElementVisibility()

  return (
    <section ref={sectionRef as Ref<HTMLElement>} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={animations.fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sans tracking-tight">
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {(
            (Array.isArray(tObject('services.list')) ? tObject('services.list') : []) as Array<{
              title?: string
              description?: string
            }>
          ).map((service, index) => (
            <motion.div
              key={`${service.title}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.5,
                  },
                },
              }}
            >
              <ServiceCard
                icon={CYBERSECURITY_SERVICES[index]?.icon}
                title={typeof service.title === 'string' ? service.title : ''}
                description={typeof service.description === 'string' ? service.description : ''}
                gradient={CYBERSECURITY_SERVICES[index]?.gradient}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
})

ServicesShowcaseSection.displayName = 'ServicesShowcaseSection'

const CallToActionSection = memo(() => {
  const prefersReducedMotion = !!useReducedMotion()
  const animations = createAnimationVariants(prefersReducedMotion)
  const { t, tObject } = useTranslation()

  const socialLinks = [
    {
      icon: <FaLinkedin size={28} />,
      link: 'https://www.linkedin.com',
      bg: 'bg-[#0A66C2]',
      name: 'LinkedIn',
    },
    {
      icon: <FaTwitter size={28} />,
      link: 'https://twitter.com',
      bg: 'bg-[#1DA1F2]',
      name: 'Twitter',
    },
    {
      icon: <FaFacebook size={28} />,
      link: 'https://www.facebook.com/share/p/1BTZqnrS5U/?mibextid=wwXIfr',
      bg: 'bg-[#1877F2]',
      name: 'Facebook',
    },
    {
      icon: <FaTiktok size={28} />,
      link: 'https://www.tiktok.com/t/ZP8BvuSBD/',
      bg: 'bg-[#000000]',
      name: 'TikTok',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-6xl mx-auto"
        >
          {/* En-tête professionnel */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight font-sans tracking-tight"
            >
              {t('callToAction.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-medium"
            >
              {t('callToAction.subtitle')}
            </motion.p>
          </div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {(
              (Array.isArray(tObject('callToAction.stats'))
                ? tObject('callToAction.stats')
                : []) as Array<{ number?: string; label?: string }>
            ).map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 group relative overflow-hidden"
              >
                {/* Effet de lueur bleue au survol */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
                </div>

                {index === 0 && (
                  <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                )}
                {index === 1 && (
                  <BookOpenCheck className="h-8 w-8 mx-auto mb-3 text-violet-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                )}
                {index === 2 && (
                  <Award className="h-8 w-8 mx-auto mb-3 text-amber-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                )}
                {index === 3 && (
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 text-rose-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="text-2xl md:text-3xl font-bold text-white mb-1 font-sans relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                  {typeof stat.number === 'string' ? stat.number : ''}
                </div>
                <div className="text-sm text-slate-400 font-medium relative z-10 group-hover:text-blue-200 transition-colors duration-300">
                  {typeof stat.label === 'string' ? stat.label : ''}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Boutons d'action professionnels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            {/* Bouton Consultation */}
            <div className="relative group">
              <NavigationButton
                text={t('buttons.planConsultation')}
                icon={BookOpenCheck}
                href="/consultation"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl border-0 px-8 py-4 rounded-3xl"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            </div>

            {/* Bouton Solutions */}
            <div className="relative group">
              <NavigationButton
                text={t('buttons.exploreSolutions')}
                icon={Server}
                href="/solution"
                className="w-max bg-transparent border-2 border-slate-400 text-white hover:bg-white hover:text-slate-900 shadow-lg px-8 py-4 rounded-3xl flex items-center gap-2 font-semibold"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            </div>
          </motion.div>

          {/* Séparateur élégant */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <div className="px-6">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Section réseaux sociaux professionnelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-slate-200 mb-6 font-sans tracking-tight">
              {t('callToAction.socialsTitle')}
            </h3>
            <div className="flex justify-center items-center gap-6">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: idx * 0.1,
                  }}
                  className={`relative group w-14 h-14 flex items-center justify-center rounded-2xl text-white ${social.bg} shadow-lg transition-all duration-300 overflow-hidden`}
                >
                  {/* Effet de lueur bleue au survol */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-md" />
                  </div>

                  {social.icon}
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {t(`callToAction.socialsTooltip.${social.name.toLowerCase()}`)}
                  </div>
                </motion.a>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 text-slate-400 text-sm font-medium"
            >
              {t('callToAction.newsletter')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

CallToActionSection.displayName = 'CallToActionSection'

// Section Footer avec mentions légales
const LegalFooterSection = memo(() => {
  const prefersReducedMotion = !!useReducedMotion()
  const animations = createAnimationVariants(prefersReducedMotion)
  const { t, tObject } = useTranslation()

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-6xl mx-auto"
        >
          {/* Titre de section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-sans tracking-tight">
              {t('footer.title')}
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">{t('footer.description')}</p>
          </div>

          {/* Badges de certification */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(tObject('footer.certifications') as Record<string, string>).map(
              ([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-full text-white font-semibold shadow-lg group relative overflow-hidden"
                >
                  {/* Effet de lueur bleue au survol */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
                  </div>

                  {key === 'gdpr' && <ShieldCheck className="h-5 w-5 relative z-10" />}
                  {key === 'iso' && <Award className="h-5 w-5 relative z-10" />}
                  {key === 'audit' && <Eye className="h-5 w-5 relative z-10" />}
                  <span className="relative z-10">{typeof value === 'string' ? value : ''}</span>
                </motion.div>
              )
            )}
          </div>

          {/* Copyright bar */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 text-gray-400 group relative overflow-hidden">
                <div
                  className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 
                                rounded-lg flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300"
                >
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-medium relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                  {t('footer.copyright', {
                    default: `© ${new Date().getFullYear()} ROECybersecurity - Tous droits réservés`,
                  }).replace('{year}', new Date().getFullYear().toString())}
                </span>

                {/* Effet de lueur bleue au survol */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium group-hover:text-blue-300 transition-colors duration-300">
                  {t('footer.developed')}
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-gray-500 text-sm">
              <a
                href={t('hero.samLink')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition-colors"
              >
                {t('footer.samVerification')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
})

LegalFooterSection.displayName = 'LegalFooterSection'

// Composant principal de la page d'accueil
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <HeroSection />
      <HardwareShowcaseSection />
      <ServicesShowcaseSection />
      <CallToActionSection />
      <LegalFooterSection />
    </main>
  )
}
