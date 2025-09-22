// pages/api/payments/paypal.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, Customer } from '@/types/shop'

// Types pour les réponses PayPal
interface PayPalAuthResponse {
  access_token: string
  token_type: string
  app_id: string
  expires_in: number
  scope: string
  nonce: string
}

interface PayPalLink {
  href: string
  rel: string
  method: string
}

interface PayPalOrderResponse {
  id: string
  status: string
  links: PayPalLink[]
}

interface RequestBody {
  cart: Configuration[]
  customer: Customer
  total: number
  currency?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  try {
    const { cart, customer, total }: RequestBody = req.body

    // Validation des données
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Panier invalide' })
    }

    if (!customer?.email) {
      return res.status(400).json({ message: 'Email client requis' })
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Montant invalide' })
    }

    // Vérifier les variables d'environnement
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET || !process.env.PAYPAL_API_URL) {
      return res.status(500).json({ message: 'Configuration PayPal manquante' })
    }

    // Obtenir le token d'accès PayPal
    const authResponse = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!authResponse.ok) {
      throw new Error(`Erreur d'authentification PayPal: ${authResponse.status}`)
    }

    const authData: PayPalAuthResponse = await authResponse.json()

    // Préparer les items pour PayPal
    const items = cart.map((item, index) => ({
      name: `Configuration PC #${index + 1}`,
      description: [
        item.cpu && `CPU: ${item.cpu}`,
        item.gpu && `GPU: ${item.gpu}`,
        item.ram && `RAM: ${item.ram}`,
        item.storage && `Storage: ${item.storage}`
      ].filter(Boolean).join(', ') || 'Configuration personnalisée',
      quantity: '1',
      unit_amount: {
        currency_code: 'USD',
        value: (item.price || 0).toFixed(2)
      }
    }))

    // Créer la commande PayPal
    const orderResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.access_token}`,
        'PayPal-Request-Id': `roe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID unique pour éviter les doublons
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `roe-order-${Date.now()}`,
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total.toFixed(2)
              }
            }
          },
          items: items,
          description: `Commande ROE Computers - ${cart.length} configuration(s)`,
          custom_id: `customer-${customer.email}`,
          soft_descriptor: 'ROE COMPUTERS'
        }],
        application_context: {
          brand_name: 'ROE Computers',
          locale: 'en-US',
          landing_page: 'BILLING',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          return_url: `${req.headers.origin}/payment/success?provider=paypal`,
          cancel_url: `${req.headers.origin}/payment/cancel?provider=paypal`,
        },
        payer: {
          email_address: customer.email,
          name: {
            given_name: customer.name.split(' ')[0] || customer.name,
            surname: customer.name.split(' ').slice(1).join(' ') || 'Client'
          }
        }
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error('Erreur création commande PayPal:', errorData)
      throw new Error(`Erreur création commande PayPal: ${orderResponse.status}`)
    }

    const orderData: PayPalOrderResponse = await orderResponse.json()
    
    // Trouver l'URL d'approbation avec typage approprié
    const approvalUrl = orderData.links.find((link: PayPalLink) => link.rel === 'approve')?.href

    if (!approvalUrl) {
      throw new Error('URL d\'approbation PayPal non trouvée')
    }

    // Logging pour le debugging (à supprimer en production)
    console.log('Commande PayPal créée:', {
      orderId: orderData.id,
      customerId: customer.email,
      total: total,
      itemCount: cart.length
    })

    res.status(200).json({ 
      approvalUrl, 
      orderId: orderData.id,
      status: orderData.status
    })
  } catch (error) {
    console.error('Erreur PayPal:', error)
    
    // Gestion d'erreur plus spécifique
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Erreur lors de la création de la commande PayPal',
        details: error.message 
      })
    } else {
      res.status(500).json({ 
        message: 'Erreur inconnue lors de la création de la commande PayPal' 
      })
    }
  }
}