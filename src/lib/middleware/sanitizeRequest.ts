import { NextRequest } from 'next/server'

export async function sanitizeRequest<T>(req: NextRequest | Request): Promise<{ data: T | null; error?: string }> {
  try {
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return { data: null, error: 'Type de contenu invalide' }
    }

    const raw = await req.json()
    if (!raw || typeof raw !== 'object') {
      return { data: null, error: 'Payload JSON invalide' }
    }

    const sanitized = deepSanitize(raw)
    return { data: sanitized as T }
  } catch {
    return { data: null, error: 'Erreur lors du parsing JSON' }
  }
}

function deepSanitize(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return obj.replace(/[<>"'`]/g, '').trim()
  }

  if (Array.isArray(obj)) {
    return obj.map(deepSanitize)
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepSanitize(value)
    }
    return result
  }

  return obj
}
