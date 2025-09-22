import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Configuration, Customer } from '@/types/shop'
import { sanitizeRequest } from '@/lib/middleware/sanitizeRequest'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

interface RequestBody {
  cart: Configuration[]
  customer: Customer
  currency?: string
}

export async function POST(req: Request) {
  const { data, error } = await sanitizeRequest<RequestBody>(req)

  if (error || !data) {
    return NextResponse.json({ message: error || 'Requête invalide' }, { status: 400 })
  }

  const { cart, customer } = data

  if (!Array.isArray(cart) || cart.length === 0 || typeof customer.email !== 'string') {
    return NextResponse.json({ message: 'Données client ou panier invalides' }, { status: 400 })
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map((item, index) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `Configuration PC #${index + 1}`,
        description:
          [
            item.cpu && `CPU: ${item.cpu}`,
            item.gpu && `GPU: ${item.gpu}`,
            item.ram && `RAM: ${item.ram}`,
            item.storage && `Storage: ${item.storage}`,
          ]
            .filter(Boolean)
            .join(', ') || 'Configuration personnalisée',
        metadata: {
          configuration_id: item.id || `config-${index}`,
          cpu: item.cpu || '',
          gpu: item.gpu || '',
          ram: item.ram || '',
          storage: item.storage || '',
        },
      },
      unit_amount: Math.round((item.price || 0) * 100),
    },
    quantity: 1,
  }))

  const total = lineItems.reduce((sum, item) => sum + (item.price_data?.unit_amount || 0), 0)
  if (total <= 0) {
    return NextResponse.json({ message: 'Montant total invalide' }, { status: 400 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get('origin') ||
    'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: customer.email,
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/cancel`,
    metadata: {
      customer_name: customer.name || '',
      customer_email: customer.email,
      order_type: 'pc_configuration',
      item_count: cart.length.toString(),
      total_amount: (total / 100).toString(),
    },
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'FR', 'DE', 'GB'],
    },
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    automatic_tax: { enabled: false },
  })

  return NextResponse.json({
    sessionId: session.id,
    url: session.url,
  })
}
