// pages/api/payments/affirm.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  try {
    const { checkout_token, customer, cart } = req.body

    // Autoriser le paiement Affirm
    const response = await fetch(`${process.env.AFFIRM_API_URL}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.AFFIRM_PUBLIC_API_KEY}:${process.env.AFFIRM_PRIVATE_API_KEY}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        checkout_token,
      }),
    })

    const chargeData = await response.json()

    if (chargeData.type === 'invalid_request') {
      throw new Error('Token de checkout invalide')
    }

    // Capturer immédiatement le paiement
    const captureResponse = await fetch(`${process.env.AFFIRM_API_URL}/charges/${chargeData.id}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.AFFIRM_PUBLIC_API_KEY}:${process.env.AFFIRM_PRIVATE_API_KEY}`
        ).toString('base64')}`,
      },
    })

    const captureData = await captureResponse.json()

    // Ici, vous pouvez sauvegarder la commande en base de données
    // await saveOrder({ customer, cart, payment: captureData })

    res.status(200).json({ 
      success: true, 
      chargeId: captureData.id,
      amount: captureData.amount 
    })
  } catch (error) {
    console.error('Erreur Affirm:', error)
    res.status(500).json({ message: 'Erreur lors du traitement du paiement Affirm' })
  }
}