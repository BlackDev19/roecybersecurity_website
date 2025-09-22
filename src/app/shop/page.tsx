'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Image from 'next/image'
import {
  Laptop,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Camera,
  Lock,
  Package,
  ShoppingCart,
  Download,
} from 'lucide-react'
import { easeInOut } from 'framer-motion'
import ConfigCard from './ConfigCard'
import FeatureCard from './FeatureCard'
import ImageCard from './ImageCard'
import CartSidebar from './CartSidebar'
// Import des types Affirm depuis le fichier centralisé
import type {
  AffirmError,
  AffirmCheckoutData,
  AffirmCallbacks,
  WindowWithAffirm
} from '@/types/affirm'

// =====================
// Types et Interfaces
// =====================
export type Configuration = {
  ram: string
  storage: string
  price: number
  cpu: string
  generation: string
  gpu: string
}

export type Feature = {
  icon: React.ElementType
  title: string
  description: string
}

export type PaymentMethod = 'affirm' | 'stripe' | 'paypal'

export type CheckoutStep = 'initial' | 'online-payment'

// Interface pour les options de traduction
export interface TranslationOptions {
  [key: string]: string | number
}

// Interface pour CartSidebar Props
export interface CartSidebarProps {
  cartOpen: boolean
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  cart: Configuration[]
  removeFromCart: (index: number) => void
  total: number
  checkoutStep: CheckoutStep
  setCheckoutStep: React.Dispatch<React.SetStateAction<CheckoutStep>>
  orderViaWhatsApp: () => void
  proceedToOnlinePayment: () => void
  backToInitialStep: () => void
  handleCheckout: (method: PaymentMethod) => void
  t: (key: string, options?: TranslationOptions) => string
}

// =====================
// Animations
// =====================
export const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeInOut } },
  },
}

// =====================
// Fonction utilitaire pour générer le message WhatsApp
// =====================
export const generateWhatsAppMessage = (cart: Configuration[]) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const imageUrl = `${baseUrl}/images/laptop/laptop_1.png`

  let message = '🛒 COMMANDE LAPTOP ROE 🛒\n\n'
  message += '📷 Image du produit: ' + imageUrl + '\n\n'
  message += '💻 Caractéristiques commandées:\n\n'

  cart.forEach((item, index) => {
    message += `📦 Ordinateur ${index + 1}:\n`
    message += `• RAM: ${item.ram}\n`
    message += `• Stockage: ${item.storage}\n`
    message += `• Processeur: ${item.cpu} ${item.generation} Gen\n`
    message += `• Carte graphique: ${item.gpu}\n`
    message += `• Prix: $${item.price.toLocaleString()}\n\n`
  })

  const total = cart.reduce((acc, item) => acc + item.price, 0)
  message += `💰 TOTAL: $${total.toLocaleString()}\n\n`
  message += '✅ Je souhaite finaliser cette commande.\n'
  message += '📞 Merci de me contacter pour les détails de livraison et paiement.'

  return message
}

// =====================
// RoeLaptopPage Component
// =====================
export default function RoeLaptopPage() {
  const { t } = useTranslation()
  const [selectedConfig, setSelectedConfig] = useState(0)
  const [cart, setCart] = useState<Configuration[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [flyerDownloaded, setFlyerDownloaded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('initial')

  const productImages = [
    '/images/laptop/laptop_1.png',
    '/images/laptop/laptop_2.png',
    '/images/laptop/laptop_3.png',
    '/images/laptop/laptop_4.png',
  ]

  const configurations: Configuration[] = [
    {
      ram: t('shop.configurations.0').split('•')[0].trim(),
      storage: t('shop.configurations.0').split('•')[1].trim(),
      price: 2850,
      cpu: 'Core i9',
      generation: '14th',
      gpu: 'Nvidia GeForce RTX 4060',
    },
    {
      ram: t('shop.configurations.1').split('•')[0].trim(),
      storage: t('shop.configurations.1').split('•')[1].trim(),
      price: 3000,
      cpu: 'Core i9',
      generation: '14th',
      gpu: 'Nvidia GeForce RTX 4060',
    },
    {
      ram: t('shop.configurations.2').split('•')[0].trim(),
      storage: t('shop.configurations.2').split('•')[1].trim(),
      price: 3400,
      cpu: 'Core i9',
      generation: '14th',
      gpu: 'Nvidia GeForce RTX 4060',
    },
    {
      ram: t('shop.configurations.3').split('•')[0].trim(),
      storage: t('shop.configurations.3').split('•')[1].trim(),
      price: 4000,
      cpu: 'Core i9',
      generation: '14th',
      gpu: 'Nvidia GeForce RTX 4060',
    },
  ]

  const features: Feature[] = [
    {
      icon: Cpu,
      title: t('shop.technicalFeatures.processor').split(' - ')[0],
      description: t('shop.technicalFeatures.processor').split(' - ')[1],
    },
    {
      icon: Cpu,
      title: t('shop.technicalFeatures.ram').split(' - ')[0],
      description: t('shop.technicalFeatures.ram').split(' - ')[1],
    },
    {
      icon: HardDrive,
      title: t('shop.technicalFeatures.storage').split(' - ')[0],
      description: t('shop.technicalFeatures.storage').split(' - ')[1],
    },
    {
      icon: Laptop,
      title: t('shop.technicalFeatures.gpu').split(' - ')[0],
      description: t('shop.technicalFeatures.gpu').split(' - ')[1],
    },
    {
      icon: Shield,
      title: t('shop.technicalFeatures.dualOS').split(' - ')[0],
      description: t('shop.technicalFeatures.dualOS').split(' - ')[1],
    },
    {
      icon: Wifi,
      title: t('shop.technicalFeatures.vpn').split(' - ')[0],
      description: t('shop.technicalFeatures.vpn').split(' - ')[1],
    },
    {
      icon: Lock,
      title: t('shop.technicalFeatures.encryption').split(' - ')[0],
      description: t('shop.technicalFeatures.encryption').split(' - ')[1],
    },
    {
      icon: Camera,
      title: t('shop.technicalFeatures.webcam').split(' - ')[0],
      description: t('shop.technicalFeatures.webcam').split(' - ')[1],
    },
    {
      icon: Shield,
      title: t('shop.technicalFeatures.bios').split(' - ')[0],
      description: t('shop.technicalFeatures.bios').split(' - ')[1],
    },
    {
      icon: Package,
      title: t('shop.technicalFeatures.bonus').split(' - ')[0],
      description: t('shop.technicalFeatures.bonus').split(' - ')[1],
    },
  ]

  const [addedToCart, setAddedToCart] = useState<boolean[]>(configurations.map(() => false))
  const total = cart.reduce((acc, item) => acc + item.price, 0)

  const addToCart = (index: number) => {
    if (!addedToCart[index]) {
      setCart([...cart, configurations[index]])
      const newAdded = [...addedToCart]
      newAdded[index] = true
      setAddedToCart(newAdded)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  const removeFromCart = (index: number) => {
    const removedItem = cart[index]
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)

    const configIndex = configurations.findIndex(
      (c) =>
        c.ram === removedItem.ram &&
        c.storage === removedItem.storage &&
        c.cpu === removedItem.cpu &&
        c.generation === removedItem.generation &&
        c.gpu === removedItem.gpu
    )

    if (configIndex !== -1) {
      const newAdded = [...addedToCart]
      newAdded[configIndex] = false
      setAddedToCart(newAdded)
    }
  }

  const downloadFlyer = () => {
    if (flyerDownloaded) {
      const confirmRedownload = window.confirm(
        'Vous avez déjà téléchargé le flyer. Voulez-vous le retélécharger ?'
      )
      if (!confirmRedownload) return
    }
    setFlyerDownloaded(true)
    window.open('/flyer/image_flyer.jpg', '_blank')
  }

  const nextImage = () => setCurrentImage((currentImage + 1) % productImages.length)
  const prevImage = () =>
    setCurrentImage((currentImage - 1 + productImages.length) % productImages.length)

  // =====================
  // Fonction pour commander via WhatsApp
  // =====================
  const orderViaWhatsApp = () => {
    if (cart.length === 0) {
      alert('Votre panier est vide !')
      return
    }

    const message = generateWhatsAppMessage(cart)
    const whatsappNumber = '19126223901'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  // =====================
  // Fonction pour passer aux options de paiement en ligne
  // =====================
  const proceedToOnlinePayment = () => {
    setCheckoutStep('online-payment')
  }

  // =====================
  // Fonction pour revenir à l'étape initiale
  // =====================
  const backToInitialStep = () => {
    setCheckoutStep('initial')
  }

  const handleCheckout = (method: PaymentMethod) => {
    if (cart.length === 0) {
      alert('Votre panier est vide !')
      return
    }

    switch (method) {
      case 'affirm':
        checkoutWithAffirm(cart)
        break
      case 'stripe':
        alert('Ici vous pouvez rediriger vers Stripe ou lancer Stripe Checkout')
        break
      case 'paypal':
        alert('Ici vous pouvez rediriger vers PayPal Checkout')
        break
    }
  }

  // Fonction simplifiée pour Affirm (compatible avec usePayment)
  const checkoutWithAffirm = (cart: Configuration[]) => {
    if (cart.length === 0) {
      alert('Votre panier est vide !')
      return
    }

    // Utilisation du hook usePayment si disponible
    try {
      // Import dynamique du hook usePayment
      import('@/hooks/usePayment').then(({ usePayment }) => {
        // Ici vous pouvez utiliser le hook usePayment
        console.log('Hook usePayment disponible')
      }).catch(() => {
        // Fallback vers l'implémentation directe
        directAffirmCheckout(cart)
      })
    } catch (error) {
      // Fallback vers l'implémentation directe
      directAffirmCheckout(cart)
    }
  }

  // Implémentation directe d'Affirm
  const directAffirmCheckout = (cart: Configuration[]) => {
    const items = cart.map((item, index) => ({
      display_name: `ROE Laptop ${item.ram} / ${item.storage} / ${item.cpu}`,
      sku: `${item.cpu}-${item.generation}-${index}`,
      unit_price: item.price * 100, // Affirm attend le prix en centimes
      qty: 1,
      item_url: window.location.href,
      item_image_url: `${window.location.origin}/images/laptop/laptop_1.png`
    }))

    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0)

    // Données pour le checkout Affirm (structure compatible avec usePayment.ts)
    const checkoutData: AffirmCheckoutData = {
      merchant: {
        public_api_key: process.env.NEXT_PUBLIC_AFFIRM_PUBLIC_KEY,
        user_confirmation_url: `${window.location.origin}/checkout/confirmation`,
        user_cancel_url: `${window.location.origin}/checkout/cancel`,
        user_confirmation_url_action: 'POST'
      },
      items,
      // Structure shipping compatible avec usePayment.ts
      shipping: {
        name: {
          full: 'Client ROE'
        },
        email: 'client@roe-cybersecurity.com'
      },
      total: totalAmount * 100, // En centimes
      order_id: `roe_order_${Date.now()}`,
      shipping_amount: 0,
      tax_amount: 0
    }

    // Callbacks pour le succès et l'échec
    const callbacks: AffirmCallbacks = {
      onSuccess: async (checkoutToken: string) => {
        console.log('Checkout token reçu:', checkoutToken)
        try {
          // Exemple d'appel à votre API
          const response = await fetch('/api/affirm/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              checkout_token: checkoutToken,
              cart: cart
            }),
          })

          if (response.ok) {
            alert('Commande traitée avec succès!')
            setCart([]) // Vider le panier
            setCartOpen(false)
          } else {
            throw new Error('Erreur lors du traitement de la commande')
          }
        } catch (error) {
          console.error('Erreur lors du traitement:', error)
          alert('Une erreur est survenue lors du traitement de votre commande.')
        }
      },
      onFail: (error: AffirmError) => {
        console.error('Erreur Affirm:', error)
        const errorMessage = error?.message || 'Erreur inconnue'
        alert(`Erreur lors du paiement: ${errorMessage}`)
      }
    }

    // Vérification et utilisation de l'API Affirm avec types corrects
    const windowWithAffirm = window as WindowWithAffirm

    if (typeof window !== 'undefined' && windowWithAffirm.affirm) {
      const affirm = windowWithAffirm.affirm

      try {
        // Méthode moderne
        if (affirm.checkout && typeof affirm.checkout.open === 'function') {
          affirm.checkout.open(callbacks)
          if (typeof affirm.checkout === 'function') {
            affirm.checkout(checkoutData)
          }
        } else {
          // Méthode alternative
          console.log('API Affirm non disponible - redirection manuelle')
          alert('Le service de paiement Affirm sera bientôt disponible. Veuillez utiliser WhatsApp pour le moment.')
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation d\'Affirm:', error)
        alert("Une erreur est survenue lors de l'initialisation du paiement.")
      }
    } else {
      alert("Le service de paiement Affirm n'est pas disponible pour le moment.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Résumé du produit */}
        <section className="bg-gray-800/60 p-6 rounded-2xl mb-12 border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300">
              {t('shop.title')}
            </h1>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300">
              {t('shop.purpose')}
            </p>
            <p className="text-blue-400 mb-2 font-bold group-hover:text-blue-300 transition-colors duration-300">
              <strong>{t('shop.startingPrice')}</strong>
            </p>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300">
              <strong>{t('shop.delivery')}</strong>
            </p>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300">
              <strong>{t('shop.bonus')}</strong>
            </p>
          </div>
        </section>

        {/* Header Configurations */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold">{t('shop.configurationsTitle')}</h2>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl flex items-center gap-2 group transition-all duration-500 shadow-lg hover:shadow-blue-500/30"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            {t('shop.cart')}
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Slider */}
          <div className="flex flex-col items-center justify-center relative space-y-4">
            <ImageCard src={productImages[currentImage]} alt={`ROE Laptop ${currentImage + 1}`} />
            <div className="flex justify-between w-full">
              <button
                onClick={prevImage}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 group relative overflow-hidden"
                aria-label="Image précédente"
              >
                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                  {t('shop.previous')}
                </span>
              </button>
              <button
                onClick={nextImage}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 group relative overflow-hidden"
                aria-label="Image suivante"
              >
                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                  {t('shop.next')}
                </span>
              </button>
            </div>
          </div>

          {/* Configurations & Boutons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {configurations.map((config, i) => (
                <ConfigCard
                  key={i}
                  config={config}
                  selected={selectedConfig === i}
                  onSelect={() => setSelectedConfig(i)}
                  alreadyAdded={addedToCart[i]}
                />
              ))}
            </div>

            <div className="relative group">
              <button
                onClick={() => addToCart(selectedConfig)}
                className={`w-full px-6 py-4 rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 relative z-10 ${
                  addedToCart[selectedConfig]
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/30'
                }`}
                disabled={addedToCart[selectedConfig]}
                aria-label={
                  addedToCart[selectedConfig] ? 'Déjà ajouté au panier' : 'Ajouter au panier'
                }
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {addedToCart[selectedConfig] ? t('shop.alreadyAdded') : t('shop.addToCart')}
              </button>
              {!addedToCart[selectedConfig] && (
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              )}
            </div>

            {/* Bouton Flyer */}
            <div className="relative group">
              <button
                onClick={downloadFlyer}
                className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-xl font-bold transition-colors duration-500 flex items-center justify-center gap-2 relative z-10 shadow-lg hover:shadow-blue-500/30"
                aria-label="Télécharger le flyer"
              >
                <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {t('shop.downloadFlyer')}
              </button>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              {flyerDownloaded && (
                <span className="absolute top-0 right-0 mt-1 mr-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce z-20">
                  {t('shop.alreadyDownloaded')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-bounce">
            {t('shop.productAdded')}
          </div>
        )}

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('shop.technicalFeaturesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </div>
        </section>

        {/* Cart Sidebar */}
        <CartSidebar
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cart={cart}
          removeFromCart={removeFromCart}
          total={total}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          orderViaWhatsApp={orderViaWhatsApp}
          proceedToOnlinePayment={proceedToOnlinePayment}
          backToInitialStep={backToInitialStep}
          handleCheckout={handleCheckout}
          t={t}
        />
      </div>
    </div>
  )
}