import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import ContactEmail from '@/emails/ContactEmail'
import type { CreateEmailResponse } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }

    // Envoi de l'email via Resend
    const sentEmail: CreateEmailResponse = await resend.emails.send({
      from: 'contact@roecybersecure.com',
      to: 'roecybersecdev@gmail.com',
      subject: `Nouveau message: ${subject}`,
      react: ContactEmail({ name, email, subject, message }),
    })

    // Log de l'ID de l'email envoyé
    console.log('Email envoyé :', sentEmail.data?.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Erreur serveur inconnue'
    console.error('Erreur lors de l’envoi de l’email :', errorMessage)

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
