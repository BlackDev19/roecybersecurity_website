import {
  X,
  MessageCircle,
  CreditCard,
  Loader2,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Configuration, CheckoutStep, PaymentMethod } from './page'
import CartItemCard from './CartItemCard'
import { usePayment } from '@/hooks/usePayment'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import addToCartAnimation from '@/assets/lotties/add_to_cart.json'

// Interface pour les options de traduction
interface TranslationOptions {
  [key: string]: string | number
}

// Interface corrigée avec orderViaWhatsApp
interface CartSidebarProps {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  cart: Configuration[]
  removeFromCart: (index: number) => void
  total: number
  checkoutStep: CheckoutStep
  setCheckoutStep: (step: CheckoutStep) => void
  orderViaWhatsApp: () => void // ✅ Propriété ajoutée
  proceedToOnlinePayment: () => void
  backToInitialStep: () => void
  handleCheckout: (method: PaymentMethod) => void
  t: (key: string, opts?: TranslationOptions) => string // ✅ Type amélioré
}

const CartSidebar = ({
  cartOpen,
  setCartOpen,
  cart,
  removeFromCart,
  total,
  checkoutStep,
  setCheckoutStep,
  orderViaWhatsApp, // ✅ Propriété reçue
  proceedToOnlinePayment,
  backToInitialStep,
  handleCheckout,
  t,
}: CartSidebarProps) => {
  const { processPayment, loading, error } = usePayment()
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [emailError, setEmailError] = useState('')
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>(
    { show: false, type: 'success', message: '' }
  )

  // Numéro WhatsApp
  const whatsappNumber = '19126223901' // +1 (912) 622-3901 sans les caractères spéciaux

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }))
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  const validateEmail = useCallback(
    (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (email && !emailRegex.test(email)) {
        setEmailError(t('shop.emailInvalid'))
      } else {
        setEmailError('')
      }
    },
    [t]
  )

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setCustomerEmail(email)
    validateEmail(email)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleCloseCart = () => {
    setCartOpen(false)
    setCheckoutStep('initial')
    setCustomerEmail('')
    setCustomerName('')
    setEmailError('')
  }

  // ✅ Fonction simplifiée - utilise la fonction du parent
  const handleWhatsAppOrder = () => {
    orderViaWhatsApp() // Utilise la fonction passée en props
    showToast('success', t('shop.redirectWhatsapp'))
    setTimeout(() => handleCloseCart(), 1500)
  }

  const handleOnlinePayment = async (method: 'stripe' | 'paypal' | 'affirm') => {
    if (!customerEmail.trim()) {
      showToast('error', t('shop.emailRequired'))
      return
    }
    if (emailError) {
      showToast('error', t('shop.emailFix'))
      return
    }

    try {
      const customer = { email: customerEmail.trim(), name: customerName.trim() || 'Client ROE' }
      await processPayment(method, cart, customer)

      showToast('success', t('shop.paymentSuccess'))
      setTimeout(() => handleCloseCart(), 2000)
    } catch (err) {
      console.error('Erreur de paiement:', err)
      showToast('error', t('shop.paymentError'))
    }
  }

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      color: 'from-[#635bff] to-[#564fd8]',
      hoverColor: 'hover:from-[#564fd8] hover:to-[#4c44c7]',
      glowColor: '#635bff30',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      color: 'from-[#0070ba] to-[#005ea6]',
      hoverColor: 'hover:from-[#005ea6] hover:to-[#004c8f]',
      glowColor: '#0070ba30',
    },
    {
      id: 'affirm',
      name: 'Affirm',
      color: 'from-[#0a3d62] to-[#074873]',
      hoverColor: 'hover:from-[#074873] hover:to-[#055d84]',
      glowColor: '#0a3d6230',
    },
  ]

  if (!cartOpen) return null

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleCloseCart}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-96 h-full bg-gray-800/95 backdrop-blur-lg shadow-2xl p-6 z-50 overflow-y-auto border-l-2 border-blue-500/30"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t('shop.cartTitle')}</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCloseCart}
            className="hover:text-red-400 transition-colors duration-300 p-2 hover:bg-red-400/10 rounded-lg"
            aria-label={t('shop.closeCart')}
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-400 text-lg">{t('shop.cartEmpty')}</p>
          </motion.div>
        ) : (
          <>
            <motion.div className="space-y-4 mb-6">
              {cart.map((item, i) => (
                <CartItemCard key={i} item={item} onRemove={() => removeFromCart(i)} />
              ))}
            </motion.div>

            <motion.div className="font-bold text-lg mb-6 text-center p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
              {t('shop.total')} : <span className="text-blue-400">${total.toLocaleString()}</span>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {loading && (
                <motion.div className="mb-4 flex items-center justify-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin mr-2" />
                  <span className="text-blue-300 text-sm">{t('shop.processingPayment')}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {checkoutStep === 'initial' && (
                <motion.div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {t('shop.chooseOrderMethod')}
                  </h3>
                  <motion.div>
                    <button
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3"
                      onClick={handleWhatsAppOrder}
                      disabled={loading}
                    >
                      <MessageCircle className="h-5 w-5" />
                      {t('shop.orderViaWhatsApp')}
                    </button>
                  </motion.div>

                  <motion.div>
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3"
                      onClick={proceedToOnlinePayment}
                      disabled={loading}
                    >
                      <CreditCard className="h-5 w-5" />
                      {t('shop.otherOrder')}
                    </button>
                  </motion.div>

                  <motion.div className="mt-6 flex justify-center">
                    <Lottie animationData={addToCartAnimation} loop={true} className="w-32 h-32" />
                  </motion.div>
                </motion.div>
              )}

              {checkoutStep === 'online-payment' && (
                <motion.div className="space-y-4">
                  <motion.button
                    onClick={backToInitialStep}
                    className="w-full bg-gray-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('shop.back')}
                  </motion.button>

                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {t('shop.onlinePaymentTitle')}
                  </h3>

                  <motion.div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
                    <h4 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('shop.clientInfoTitle')}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="email" className="block text-xs text-gray-400 mb-1">
                          {t('shop.emailLabel')}
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={customerEmail}
                          onChange={handleEmailChange}
                          placeholder={t('shop.emailPlaceholder')}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-gray-600 border rounded-lg text-sm text-white"
                        />
                        {emailError && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-xs text-gray-400 mb-1">
                          {t('shop.nameLabel')}
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={t('shop.namePlaceholder')}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-gray-600 border rounded-lg text-sm text-white"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    {paymentMethods.map((method, index) => (
                      <motion.div key={method.id}>
                        <button
                          className={`w-full bg-gradient-to-r ${method.color} px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3`}
                          onClick={() =>
                            handleOnlinePayment(method.id as 'stripe' | 'paypal' | 'affirm')
                          }
                          disabled={loading || !!emailError || !customerEmail.trim()}
                        >
                          <CreditCard className="h-5 w-5" />
                          {t(`shop.payWith${method.name}`)}
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-xs text-center flex items-center justify-center gap-2">
                      <Shield className="h-3 w-3" />
                      {t('shop.securePaymentInfo')}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl text-white font-medium shadow-2xl flex items-center gap-2 z-50 border ${
                toast.type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-400/20'
                  : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400/20'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default CartSidebar
