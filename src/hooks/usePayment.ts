import { useState, useCallback } from 'react'
import { Configuration } from '@/types/shop'

interface Customer {
  email: string
  name: string
}

interface AffirmCheckoutData {
  merchant: {
    user_confirmation_url: string
    user_cancel_url: string
    user_confirmation_url_action: string
  }
  shipping: { name: { full: string }; email: string }
  billing: { name: { full: string }; email: string }
  items: Array<{
    display_name: string
    sku: string
    unit_price: number
    qty: number
    item_image_url: string
    item_url: string
  }>
  discounts: Record<string, unknown>
  metadata: { platform_type: string; platform_affirm: boolean }
  order_id: string
  shipping_amount: number
  tax_amount: number
  total: number
}

interface AffirmError {
  message?: string
  code?: string
}

declare global {
  interface Window {
    affirm?: {
      checkout: {
        (data: AffirmCheckoutData): void
        open: (options: {
          onSuccess: (checkoutToken: string) => Promise<void>
          onFail: (error: AffirmError) => void
        }) => void
      }
    }
    Stripe?: (key: string) => {
      redirectToCheckout: (options: { sessionId: string }) => Promise<{ error?: { message: string } }>
    }
  }
}

const sanitize = (input: unknown): unknown => {
  if (typeof input === 'string') return input.replace(/[<>"'`]/g, '').trim()
  if (Array.isArray(input)) return input.map(sanitize)
  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      result[key] = sanitize(value)
    }
    return result
  }
  return input
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = useCallback(async (
    method: 'stripe' | 'paypal' | 'affirm',
    cart: Configuration[],
    customer: Customer
  ) => {
    setLoading(true)
    setError(null)

    try {
      if (!Array.isArray(cart) || cart.length === 0 || !customer?.email.includes('@')) {
        throw new Error('Données client ou panier invalides')
      }

      switch (method) {
        case 'stripe':
          await processStripePayment(cart, customer)
          break
        case 'paypal':
          await processPayPalPayment(cart, customer)
          break
        case 'affirm':
          await processAffirmPayment(cart, customer)
          break
        default:
          throw new Error(`Méthode de paiement non supportée: ${method}`)
      }
    } catch (err) {
      console.error('Erreur de paiement:', err)
      setError(err instanceof Error ? err.message : 'Erreur de paiement')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { processPayment, loading, error }
}

// === STRIPE IMPLEMENTATION ===
const processStripePayment = async (cart: Configuration[], customer: Customer) => {
  try {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Clé publique Stripe manquante')
    }

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    if (!stripe) throw new Error('Stripe non disponible')

    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: sanitize(cart),
        customer: sanitize(customer),
        currency: 'usd',
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Erreur Stripe: ${response.status} - ${errorData}`)
    }

    const { sessionId } = await response.json()
    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) throw new Error(error.message)
  } catch (error) {
    console.error('Erreur Stripe:', error)
    throw error
  }
}

// === PAYPAL IMPLEMENTATION ===
const processPayPalPayment = async (cart: Configuration[], customer: Customer) => {
  try {
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)

    const response = await fetch('/api/payments/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: sanitize(cart),
        customer: sanitize(customer),
        total,
        currency: 'USD',
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Erreur PayPal: ${response.status} - ${errorData}`)
    }

    const { approvalUrl } = await response.json()
    window.location.href = approvalUrl
  } catch (error) {
    console.error('Erreur PayPal:', error)
    throw error
  }
}

// === AFFIRM IMPLEMENTATION ===
const processAffirmPayment = async (cart: Configuration[], customer: Customer) => {
  try {
    let retries = 0
    while (!window.affirm && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      retries++
    }

    if (!window.affirm) {
      throw new Error('Le SDK Affirm n\'est pas disponible. Veuillez recharger la page.')
    }

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)

    const affirmData: AffirmCheckoutData = {
      merchant: {
        user_confirmation_url: `${window.location.origin}/payment/success`,
        user_cancel_url: `${window.location.origin}/payment/cancel`,
        user_confirmation_url_action: 'POST',
      },
      shipping: {
        name: { full: sanitize(customer.name) as string },
        email: sanitize(customer.email) as string,
      },
      billing: {
        name: { full: sanitize(customer.name) as string },
        email: sanitize(customer.email) as string,
      },
      items: cart.map((item, index) => ({
        display_name: `Configuration PC #${index + 1}`,
        sku: `config-${index}`,
        unit_price: Math.round((item.price || 0) * 100),
        qty: 1,
        item_image_url: `${window.location.origin}/images/pc-config.jpg`,
        item_url: `${window.location.origin}/shop`,
      })),
      discounts: {},
      metadata: {
        platform_type: 'ROE Computers',
        platform_affirm: true,
      },
      order_id: `roe-${Date.now()}`,
      shipping_amount: 0,
      tax_amount: 0,
      total: Math.round(total * 100),
    }

    window.affirm.checkout(affirmData)
    window.affirm.checkout.open({
      onSuccess: async (checkoutToken: string) => {
        try {
          const response = await fetch('/api/payments/affirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checkout_token: checkoutToken,
              customer: sanitize(customer),
              cart: sanitize(cart),
            }),
          })

          if (!response.ok) {
            throw new Error('Erreur lors du traitement du paiement Affirm')
          }

          console.log('Paiement Affirm réussi')
        } catch (error) {
          console.error('Erreur traitement Affirm:', error)
          throw error
        }
      },
      onFail: (error: AffirmError) => {
        console.error('Erreur Affirm:', error)
        throw new Error(error.message || 'Paiement Affirm échoué')
      },
    })
  } catch (error) {
    console.error('Erreur Affirm:', error)
    throw error
  }
}

// === Stripe Loader sécurisé ===
const loadStripe = async (publishableKey: string) => {
  if (typeof window === 'undefined') return null

  if (!document.querySelector('script[src*="stripe"]')) {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    document.head.appendChild(script)
    await new Promise(resolve => { script.onload = resolve })
  }

  if (!window.Stripe) {
    throw new Error('Stripe SDK non disponible')
  }

  return window.Stripe(publishableKey)
}
