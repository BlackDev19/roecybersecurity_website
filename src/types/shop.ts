// types/shop.ts

// Configuration d'un PC
export interface Configuration {
  id?: string
  name?: string
  cpu?: string
  gpu?: string
  ram?: string
  storage?: string
  motherboard?: string
  powerSupply?: string
  cooler?: string
  pcCase?: string
  price?: number
  category?: 'gaming' | 'workstation' | 'office' | 'server' | 'custom'
  image?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

// Étapes du checkout
export type CheckoutStep = 'initial' | 'online-payment' | 'confirmation'

// Méthodes de paiement
export type PaymentMethod = 'whatsapp' | 'stripe' | 'paypal' | 'affirm'

// Client
export interface Customer {
  email: string
  name: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

// Commande
export interface Order {
  id: string
  customer: Customer
  configurations: Configuration[]
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
  notes?: string
  trackingNumber?: string
}

// Statuts de commande
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'building'
  | 'testing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

// Statuts de paiement
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled'

// Composants PC disponibles
export interface Component {
  id: string
  name: string
  type: ComponentType
  brand: string
  model: string
  price: number
  specifications: Record<string, string | number | boolean>
  compatibility: string[]
  image?: string
  description?: string
  inStock: boolean
  rating?: number
  reviews?: Review[]
}

// Types de composants
export type ComponentType =
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'storage'
  | 'motherboard'
  | 'powerSupply'
  | 'cooler'
  | 'case'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset'

// Avis client
export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: Date
  verified: boolean
}

// Panier
export interface Cart {
  items: Configuration[]
  total: number
  itemCount: number
}

// Réponses des API de paiement
export interface StripeResponse {
  sessionId: string
  url?: string
}

export interface PayPalResponse {
  orderId: string
  approvalUrl: string
}

export interface AffirmResponse {
  success: boolean
  chargeId: string
  amount: number
}

// Données de session de paiement
export interface PaymentSession {
  id: string
  method: PaymentMethod
  amount: number
  currency: string
  status: PaymentStatus
  configurations: Configuration[]
  customer: Customer
  createdAt: Date
  expiresAt: Date
  metadata?: Record<string, unknown>
}

// Erreurs de paiement
export interface PaymentError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Configuration des prix
export interface PricingTier {
  name: string
  basePrice: number
  components: Partial<Configuration>
  features: string[]
  recommended?: boolean
  popular?: boolean
}

// Filtres de recherche
export interface SearchFilters {
  category?: string[]
  priceRange?: {
    min: number
    max: number
  }
  brands?: string[]
  components?: Partial<Record<ComponentType, string[]>>
  inStock?: boolean
  rating?: number
}

// Résultats de recherche
export interface SearchResult {
  configurations: Configuration[]
  totalCount: number
  filters: SearchFilters
  sortBy?: 'price' | 'rating' | 'popularity' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

// Notifications
export interface NotificationToast {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// États de l'UI
export interface ShopUIState {
  cartOpen: boolean
  checkoutStep: CheckoutStep
  loading: boolean
  error: string | null
  toast: NotificationToast
}

// Props communes pour les composants
export interface BaseShopProps {
  className?: string
  loading?: boolean
  disabled?: boolean
}

// Props pour les cartes de configuration
export interface ConfigurationCardProps extends BaseShopProps {
  configuration: Configuration
  onAddToCart: (config: Configuration) => void
  onViewDetails: (config: Configuration) => void
  showPrice?: boolean
  compact?: boolean
}

// Props pour le panier
export interface CartProps extends BaseShopProps {
  items: Configuration[]
  total: number
  onRemoveItem: (index: number) => void
  onUpdateQuantity?: (index: number, quantity: number) => void
  onCheckout: (method: PaymentMethod) => void
}

export default Configuration
