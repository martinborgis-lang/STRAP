'use client'

import { loadStripe, type Stripe, type Appearance } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    stripePromise = key ? loadStripe(key) : Promise.resolve(null)
  }
  return stripePromise
}

/** Thème Stripe Elements — Dark Indigo */
export const stripeAppearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#FFFFFF',
    colorBackground: '#0A0A0A',
    colorText: '#FFFFFF',
    colorTextSecondary: '#A0A0A0',
    colorDanger: '#FF6B6B',
    colorSuccess: '#FFFFFF',
    borderRadius: '8px',
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSizeBase: '15px',
    spacingGridRow: '20px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: '#0A0A0A',
      color: '#FFFFFF',
    },
    '.Input:focus': {
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)',
    },
    '.Label': {
      color: '#A0A0A0',
      fontFamily: '"DM Mono", monospace',
      fontSize: '11px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
}
