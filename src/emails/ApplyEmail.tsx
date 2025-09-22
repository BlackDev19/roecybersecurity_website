// src/emails/ApplyEmail.tsx
interface ApplyEmailProps {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  message: string
}

export default function ApplyEmail({
  firstName,
  lastName,
  email,
  phone,
  position,
  message,
}: ApplyEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#111' }}>
      <h1>Nouvelle candidature: {position}</h1>
      <p>
        <strong>Nom:</strong> {firstName} {lastName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Téléphone:</strong> {phone}
      </p>
      {message && (
        <p>
          <strong>Message:</strong> {message}
        </p>
      )}
    </div>
  )
}
