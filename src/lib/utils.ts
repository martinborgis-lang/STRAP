import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formate un montant en centimes vers une chaîne EUR (ex: 9900 -> "99,00 €") */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export const FREE_SHIPPING_THRESHOLD = 15000 // 150,00 € en centimes
export const SHIPPING_FLAT = 590 // 5,90 €

export function shippingCost(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0
  return subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
}
