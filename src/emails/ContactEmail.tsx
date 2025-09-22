import React from 'react'

interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.5' }}>
      <h2>Nouvelle demande de contact</h2>
      <p>
        <strong>Nom :</strong> {name}
      </p>
      <p>
        <strong>Email :</strong> {email}
      </p>
      <p>
        <strong>Sujet :</strong> {subject}
      </p>
      <p>
        <strong>Message :</strong>
      </p>
      <p>{message}</p>
    </div>
  )
}
