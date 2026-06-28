export type Material = 'ceramic'
export type Color =
  | 'black'
  | 'pink'
  | 'white'
  | 'green'
  | 'mint'
  | 'navy'
  | 'blue-orange'
  | 'pink-yellow'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  /** Prix en centimes (compatible Stripe) */
  price: number
  material: Material
  color: Color
  /** Hex — couleur du bracelet (maillons) */
  braceletColor: string
  /** Hex — couleur du boîtier */
  caseColor: string
  /** Hex — couleur d'accent */
  accentColor: string
  images: string[]
  /** Nom de la montre Royal Pop compatible */
  compatibleWith: string
  inStock: boolean
  featured: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  lastAdded: Product | null
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const MATERIAL_LABELS: Record<Material, string> = {
  ceramic: 'Biocéramique',
}
