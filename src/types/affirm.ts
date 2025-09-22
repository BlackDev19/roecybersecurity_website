// types/affirm.ts
// Types unifiés pour l'intégration Affirm - compatibles avec usePayment.ts

export interface AffirmError {
  message?: string
  code?: string
}

// Types de base compatibles avec usePayment.ts
export interface AffirmCheckoutData {
  merchant: {
    public_api_key?: string
    user_confirmation_url: string
    user_cancel_url: string
    user_confirmation_url_action: string
  }
  items: Array<{
    display_name: string
    sku: string
    unit_price: number
    qty: number
    item_url: string
    item_image_url?: string
  }>
  // Structure shipping compatible avec usePayment.ts
  shipping: {
    name: {
      full: string
    }
    email: string
  }
  billing?: {
    name: {
      full: string
    }
    email: string
  }
  discounts?: {
    [key: string]: {
      discount_amount: number
      discount_display_name: string
    }
  }
  metadata?: {
    [key: string]: unknown
  }
  order_id?: string
  shipping_amount?: number
  tax_amount?: number
  total: number
}

// Types alternatifs pour une structure plus complète (si vous voulez changer usePayment.ts)
export interface AffirmCheckoutDataExtended {
  merchant: {
    public_api_key?: string
    user_confirmation_url: string
    user_cancel_url: string
    user_confirmation_url_action: string
  }
  items: Array<{
    display_name: string
    sku: string
    unit_price: number
    qty: number
    item_url: string
    item_image_url?: string
  }>
  shipping: {
    name: {
      first: string
      last: string
    }
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      zipcode: string
      country: string
    }
  }
  billing?: {
    name: {
      first: string
      last: string
    }
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      zipcode: string
      country: string
    }
  }
  discounts?: {
    [key: string]: {
      discount_amount: number
      discount_display_name: string
    }
  }
  metadata?: {
    [key: string]: unknown
  }
  order_id?: string
  shipping_amount?: number
  tax_amount?: number
  total: number
}

export interface AffirmCallbacks {
  onSuccess: (checkoutToken: string) => Promise<void>
  onFail: (error: AffirmError) => void
}

// Interface simplifiée pour éviter les conflits d'extension
export interface AffirmWindow {
  affirm?: {
    ui?: {
      ready: (callback: () => void) => void
      error: (callback: (error: AffirmError) => void) => void
    }
    checkout: {
      (data: AffirmCheckoutData): void
      open: (options: AffirmCallbacks) => void
    }
  }
}

// Helper type pour les assertions de type
export type WindowWithAffirm = Window & AffirmWindow

// NOTE: Pas de declare global ici pour éviter les conflits
// Utilisez WindowWithAffirm comme type d'assertion : (window as WindowWithAffirm)