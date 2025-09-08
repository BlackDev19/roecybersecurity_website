'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Image from 'next/image'
import {
  Laptop, Shield, Cpu, HardDrive, Wifi, Camera, Lock, Package,
  CheckCircle, ShoppingCart, X, Download, MessageCircle, CreditCard
} from 'lucide-react'
import { motion, easeInOut } from 'framer-motion'

// =====================
// Types
// =====================
type Configuration = {
  ram: string
  storage: string
  price: number
  cpu: string
  generation: string
  gpu: string
}

type Feature = {
  icon: React.ElementType
  title: string
  description: string
}

type PaymentMethod = 'affirm' | 'stripe' | 'paypal'

type CheckoutStep = 'initial' | 'online-payment'

interface AffirmWindow extends Window {
  affirm?: {
    checkout: {
      open: (options: {
        merchant: {
          public_api_key: string
          user_confirmation_url: string
          user_cancel_url: string
        }
        items: Array<{
          display_name: string
          sku: string
          unit_price: number
          qty: number
          item_url: string
        }>
      }) => void
    }
  }
}

// =====================
// Animations
// =====================
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeInOut } }
  }
}

// =====================
// ConfigCard Component
// =====================
const ConfigCard = ({
  config,
  selected,
  onSelect,
  alreadyAdded
}: {
  config: Configuration
  selected: boolean
  onSelect: () => void
  alreadyAdded: boolean
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className={`relative bg-gray-800/60 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
      selected 
        ? 'border-blue-500 bg-blue-900/20 hover:shadow-blue-500/30' 
        : 'border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30'
    } shadow-xl hover:shadow-2xl`}
    onClick={onSelect}
  >
    {/* Effet de lueur bleue au survol */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>

    <div className="text-center relative z-10">
      <div className="text-lg font-semibold mb-1 group-hover:text-blue-300 transition-colors duration-300">{config.ram}</div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">{config.storage}</div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">{config.cpu} - {config.generation} Gen</div>
      <div className="text-gray-300 mb-1 group-hover:text-blue-200 transition-colors duration-300">{config.gpu}</div>
      <div className="text-2xl font-bold text-blue-400 mb-1 group-hover:text-blue-300 transition-colors duration-300">${config.price.toLocaleString()}</div>
      {selected && (
        <div className="mt-2 flex justify-center">
          <CheckCircle className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      )}
      {alreadyAdded && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full z-20">
          Déjà ajouté
        </span>
      )}
    </div>
  </motion.div>
)

// =====================
// FeatureCard Component
// =====================
const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      variants={animations.fadeInUp}
      className="bg-gray-800/60 p-6 rounded-xl text-center transition-all duration-300 relative overflow-hidden group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
      </div>
      <Icon className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 relative z-10" />
      <h3 className="font-semibold mb-2 group-hover:text-blue-300 transition-colors duration-300 relative z-10">{feature.title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-blue-200 transition-colors duration-300 relative z-10">{feature.description}</p>
    </motion.div>
  )
}

// =====================
// ImageCard Component
// =====================
const ImageCard = ({ src, alt }: { src: string; alt: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.05 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-800/60 cursor-pointer group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
  >
    <Image src={src} alt={alt} fill className="object-contain rounded-xl" />
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>
  </motion.div>
)

// =====================
// CartItemCard Component
// =====================
const CartItemCard = ({
  item,
  onRemove
}: {
  item: Configuration
  onRemove: () => void
}) => (
  <motion.li
    initial="hidden"
    whileInView="visible"
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
    variants={animations.fadeInUp}
    className="flex justify-between items-center bg-gray-700/60 p-4 rounded-xl cursor-pointer relative group border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/30 shadow-xl"
  >
    {/* Effet de lueur bleue au survol */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
    </div>

    <div className="relative z-10">
      <p className="font-semibold group-hover:text-blue-300 transition-colors duration-300">
        {item.ram} / {item.storage} / {item.cpu} {item.generation} Gen / {item.gpu}
      </p>
      <p className="text-blue-400 font-bold group-hover:text-blue-300 transition-colors duration-300">${item.price.toLocaleString()}</p>
    </div>
    <button 
      onClick={onRemove} 
      className="text-red-500 hover:text-red-400 relative z-10 group/button"
      aria-label="Retirer du panier"
    >
      <X className="h-5 w-5 group-hover/button:scale-110 transition-transform duration-300" />
    </button>
  </motion.li>
)

// =====================
// Fonction utilitaire pour générer le message WhatsApp
// =====================
const generateWhatsAppMessage = (cart: Configuration[]) => {
  const baseUrl = window.location.origin
  const imageUrl = `${baseUrl}/images/laptop/laptop_1.png` // Image du laptop ROE
  
  let message = "🛒 COMMANDE LAPTOP ROE 🛒\n\n"
  message += "📷 Image du produit: " + imageUrl + "\n\n"
  message += "💻 Caractéristiques commandées:\n\n"
  
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
  message += "✅ Je souhaite finaliser cette commande.\n"
  message += "📞 Merci de me contacter pour les détails de livraison et paiement."
  
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
    '/images/laptop/laptop_4.png'
  ]

  const configurations: Configuration[] = [
    { ram: t('shop.configurations.0').split('•')[0].trim(), storage: t('shop.configurations.0').split('•')[1].trim(), price: 2850, cpu: "Core i9", generation: "14th", gpu: "Nvidia GeForce RTX 4060" },
    { ram: t('shop.configurations.1').split('•')[0].trim(), storage: t('shop.configurations.1').split('•')[1].trim(), price: 3000, cpu: "Core i9", generation: "14th", gpu: "Nvidia GeForce RTX 4060" },
    { ram: t('shop.configurations.2').split('•')[0].trim(), storage: t('shop.configurations.2').split('•')[1].trim(), price: 3400, cpu: "Core i9", generation: "14th", gpu: "Nvidia GeForce RTX 4060" },
    { ram: t('shop.configurations.3').split('•')[0].trim(), storage: t('shop.configurations.3').split('•')[1].trim(), price: 4000, cpu: "Core i9", generation: "14th", gpu: "Nvidia GeForce RTX 4060" }
  ]

  const features: Feature[] = [
    { icon: Cpu, title: t('shop.technicalFeatures.processor').split(' - ')[0], description: t('shop.technicalFeatures.processor').split(' - ')[1] },
    { icon: Cpu, title: t('shop.technicalFeatures.ram').split(' - ')[0], description: t('shop.technicalFeatures.ram').split(' - ')[1] },
    { icon: HardDrive, title: t('shop.technicalFeatures.storage').split(' - ')[0], description: t('shop.technicalFeatures.storage').split(' - ')[1] },
    { icon: Laptop, title: t('shop.technicalFeatures.gpu').split(' - ')[0], description: t('shop.technicalFeatures.gpu').split(' - ')[1] },
    { icon: Shield, title: t('shop.technicalFeatures.dualOS').split(' - ')[0], description: t('shop.technicalFeatures.dualOS').split(' - ')[1] },
    { icon: Wifi, title: t('shop.technicalFeatures.vpn').split(' - ')[0], description: t('shop.technicalFeatures.vpn').split(' - ')[1] },
    { icon: Lock, title: t('shop.technicalFeatures.encryption').split(' - ')[0], description: t('shop.technicalFeatures.encryption').split(' - ')[1] },
    { icon: Camera, title: t('shop.technicalFeatures.webcam').split(' - ')[0], description: t('shop.technicalFeatures.webcam').split(' - ')[1] },
    { icon: Shield, title: t('shop.technicalFeatures.bios').split(' - ')[0], description: t('shop.technicalFeatures.bios').split(' - ')[1] },
    { icon: Package, title: t('shop.technicalFeatures.bonus').split(' - ')[0], description: t('shop.technicalFeatures.bonus').split(' - ')[1] },
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

    const configIndex = configurations.findIndex(c =>
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
      const confirmRedownload = window.confirm("Vous avez déjà téléchargé le flyer. Voulez-vous le retélécharger ?")
      if (!confirmRedownload) return
    }
    setFlyerDownloaded(true)
    window.open('/flyer/image_flyer.jpg', '_blank')
  }

  const nextImage = () => setCurrentImage((currentImage + 1) % productImages.length)
  const prevImage = () => setCurrentImage((currentImage - 1 + productImages.length) % productImages.length)

  // =====================
  // Nouvelle fonction pour commander via WhatsApp
  // =====================
  const orderViaWhatsApp = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    const message = generateWhatsAppMessage(cart)
    const whatsappNumber = "19126223901" // Numéro WhatsApp ROE (sans le +)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    // Ouvrir WhatsApp dans un nouvel onglet
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
      alert("Votre panier est vide !");
      return;
    }

    switch (method) {
      case 'affirm':
        checkoutWithAffirm(cart);
        break;
      case 'stripe':
        alert("Ici vous pouvez rediriger vers Stripe ou lancer Stripe Checkout");
        break;
      case 'paypal':
        alert("Ici vous pouvez rediriger vers PayPal Checkout");
        break;
    }
  }

  const checkoutWithAffirm = (cart: Configuration[]) => {
    const items = cart.map(item => ({
      display_name: `${item.ram} / ${item.storage} / ${item.cpu}`,
      sku: item.cpu + item.generation,
      unit_price: item.price * 100,
      qty: 1,
      item_url: window.location.href
    }));

    if (typeof window !== 'undefined' && (window as AffirmWindow).affirm) {
      (window as AffirmWindow).affirm?.checkout.open({
        merchant: {
          public_api_key: "YOUR_PUBLIC_SANDBOX_KEY",
          user_confirmation_url: "https://tonsite.com/confirmation",
          user_cancel_url: "https://tonsite.com/cancel"
        },
        items
      });
    } else {
      alert("Le service de paiement Affirm n'est pas disponible pour le moment.");
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
            <h1 className="text-4xl font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300">{t('shop.title')}</h1>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300">{t('shop.purpose')}</p>
            <p className="text-blue-400 mb-2 font-bold group-hover:text-blue-300 transition-colors duration-300"><strong>{t('shop.startingPrice')}</strong></p>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300"><strong>{t('shop.delivery')}</strong></p>
            <p className="text-gray-300 mb-2 group-hover:text-blue-200 transition-colors duration-300"><strong>{t('shop.bonus')}</strong></p>
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
                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">{t('shop.previous')}</span>
              </button>
              <button 
                onClick={nextImage} 
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 group relative overflow-hidden"
                aria-label="Image suivante"
              >
                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">{t('shop.next')}</span>
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
                aria-label={addedToCart[selectedConfig] ? "Déjà ajouté au panier" : "Ajouter au panier"}
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
          <h2 className="text-3xl font-bold mb-8 text-center">{t('shop.technicalFeaturesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => <FeatureCard key={i} feature={feature} />)}
          </div>
        </section>

        {/* Cart Sidebar - NOUVELLE LOGIQUE AVEC WHATSAPP */}
        {cartOpen && (
          <div className="fixed top-0 right-0 w-96 h-full bg-gray-800/95 backdrop-blur-sm shadow-lg p-6 z-50 overflow-y-auto transition-transform border-l-2 border-blue-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t('shop.cartTitle')}</h2>
              <button 
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutStep('initial') // Reset à l'étape initiale
                }} 
                className="hover:text-red-400 transition-colors duration-300"
                aria-label="Fermer le panier"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-400">{t('shop.cartEmpty')}</p>
            ) : (
              <>
                <ul className="space-y-4 mb-6">
                  {cart.map((item, i) => (
                    <CartItemCard key={i} item={item} onRemove={() => removeFromCart(i)} />
                  ))}
                </ul>
                
                <p className="font-bold text-lg mb-6 text-center">
                  {t('shop.total')} : <span className="text-blue-400">${total.toLocaleString()}</span>
                </p>

                {/* ÉTAPE INITIALE : Choix entre WhatsApp et Paiement en ligne */}
                {checkoutStep === 'initial' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4 text-center">Choisissez votre mode de commande :</h3>
                    
                    {/* Bouton WhatsApp */}
                    <div className="relative group">
                      <button
                        className="w-full bg-green-600 hover:bg-green-500 px-6 py-4 rounded-xl font-bold transition-colors duration-500 relative z-10 shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-3"
                        onClick={orderViaWhatsApp}
                        aria-label="Commander via WhatsApp"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Commande sur WhatsApp
                      </button>
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    </div>

                    {/* Bouton Autre commande */}
                    <div className="relative group">
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-bold transition-colors duration-500 relative z-10 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                        onClick={proceedToOnlinePayment}
                        aria-label="Autres options de paiement"
                      >
                        <CreditCard className="h-5 w-5" />
                        Autre commande
                      </button>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    </div>
                  </div>
                )}

                {/* ÉTAPE PAIEMENT EN LIGNE : Options Stripe, PayPal, Affirm */}
                {checkoutStep === 'online-payment' && (
                  <div className="space-y-4">
                    {/* Bouton Retour */}
                    <button
                      onClick={backToInitialStep}
                      className="w-full bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg font-medium transition-colors duration-300 mb-4"
                      aria-label="Retour aux options de commande"
                    >
                      ← Retour
                    </button>

                    <h3 className="text-lg font-semibold mb-4 text-center">Paiement en ligne :</h3>

                    {/* Bouton Stripe */}
                    <div className="relative group">
                      <button
                        className="w-full bg-green-600 hover:bg-green-500 px-6 py-4 rounded-xl font-bold transition-colors duration-500 relative z-10 shadow-lg hover:shadow-green-500/30"
                        onClick={() => handleCheckout('stripe')}
                        aria-label="Payer avec Stripe"
                      >
                        Payer avec Stripe
                      </button>
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    </div>

                    {/* Bouton PayPal */}
                    <div className="relative group">
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-bold transition-colors duration-500 relative z-10 shadow-lg hover:shadow-blue-500/30"
                        onClick={() => handleCheckout('paypal')}
                        aria-label="Payer avec PayPal"
                      >
                        Payer avec PayPal
                      </button>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    </div>

                    {/* Bouton Affirm */}
                    <div className="relative group">
                      <button
                        className="w-full bg-yellow-500 hover:bg-yellow-400 px-6 py-4 rounded-xl font-bold transition-colors duration-500 relative z-10 shadow-lg hover:shadow-yellow-500/30 text-gray-900"
                        onClick={() => handleCheckout('affirm')}
                        aria-label="Payer avec Affirm"
                      >
                        Payer avec Affirm
                      </button>
                      <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}