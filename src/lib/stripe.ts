import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey) {
  // En dev sans clé, on n'empêche pas le build : l'API route renverra une erreur claire.
  console.warn(
    '[stripe] STRIPE_SECRET_KEY manquant — les paiements ne fonctionneront pas tant que la clé n\'est pas configurée dans .env.local',
  )
}

export const stripe = new Stripe(secretKey || 'sk_test_placeholder', {
  typescript: true,
  appInfo: { name: 'STRAP', version: '0.1.0' },
})

export const isStripeConfigured = Boolean(secretKey)
