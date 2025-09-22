import { useCallback } from 'react'

/**
 * Nettoyage basique des chaînes pour éviter les injections
 */
const sanitize = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return input.replace(/[<>"'`]/g, '').trim()
  }
  if (Array.isArray(input)) {
    return input.map(sanitize)
  }
  if (typeof input === 'object' && input !== null) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      result[key] = sanitize(value)
    }
    return result
  }
  return input
}

/**
 * Hook sécurisé pour les appels API POST
 */
export const useSecureFetch = () => {
  const post = useCallback(
    async <T>(
      url: string,
      payload: unknown,
      options?: { headers?: Record<string, string> }
    ): Promise<T> => {
      const sanitizedPayload = sanitize(payload)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        body: JSON.stringify(sanitizedPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Erreur API [${url}]:`, errorText)
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }

      try {
        return await response.json()
      } catch {
        throw new Error('Réponse JSON invalide')
      }
    },
    []
  )

  return { post }
}
