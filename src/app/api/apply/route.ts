import { Resend } from 'resend'
import React from 'react'
import ApplyEmail from '@/emails/ApplyEmail'

const resend = new Resend(process.env.RESEND_API_KEY!)

type FormFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  message: string
}

type Attachment = {
  filename: string
  content: string
  type: string
  disposition: 'attachment'
}

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData()

    const sanitize = (key: keyof FormFields): string => {
      const value = formData.get(key)
      return typeof value === 'string'
        ? value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
        : ''
    }

    const firstName = sanitize('firstName')
    const lastName = sanitize('lastName')
    const email = sanitize('email')
    const phone = sanitize('phone')
    const position = sanitize('position')
    const message = sanitize('message')
    const resumeFile = formData.get('resume') as File | null

    const errors: string[] = []
    if (!firstName) errors.push('Prénom requis')
    if (!lastName) errors.push('Nom requis')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email invalide')
    if (!position) errors.push('Poste requis')
    if (!message) errors.push('Message requis')

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), { status: 400 })
    }

    const attachments: Attachment[] = []
    if (resumeFile) {
      if (!resumeFile.type.startsWith('application/pdf')) {
        return new Response(
          JSON.stringify({ success: false, error: 'Le CV doit être un fichier PDF.' }),
          { status: 400 }
        )
      }

      if (resumeFile.size > 5 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ success: false, error: 'Le fichier dépasse 5MB.' }),
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await resumeFile.arrayBuffer())
      if (buffer.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'Le fichier est vide ou corrompu.' }),
          { status: 400 }
        )
      }

      const signature = buffer.toString('utf8', 0, 4)
      if (signature !== '%PDF') {
        return new Response(
          JSON.stringify({ success: false, error: 'Le fichier n’est pas un PDF valide.' }),
          { status: 400 }
        )
      }

      attachments.push({
        filename: resumeFile.name,
        content: buffer.toString('base64'),
        type: resumeFile.type,
        disposition: 'attachment',
      })
    }

    const emailComponent = React.createElement(ApplyEmail, {
      firstName,
      lastName,
      email,
      phone,
      position,
      message,
    })

    const { data, error: sendError } = await resend.emails.send({
      from: 'contact@roecybersecure.com',
      to: 'roecybersecdev@gmail.com',
      subject: `Nouvelle candidature: ${position}`,
      react: emailComponent,
      attachments,
    })

    if (sendError) {
      console.error('Erreur Resend:', sendError)
      return new Response(JSON.stringify({ success: false, error: 'Échec d’envoi du mail.' }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, messageId: data?.id }), { status: 200 })
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error')
    console.error('Erreur serveur:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Erreur interne', details: error.message }),
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}
