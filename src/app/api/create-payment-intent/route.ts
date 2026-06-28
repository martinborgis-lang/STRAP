import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { getProductById } from '@/lib/products'
import { shippingCost } from '@/lib/utils'

interface IncomingItem {
  productId: string
  quantity: number
}

export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json(
      {
        error:
          'Stripe non configuré. Renseignez STRIPE_SECRET_KEY dans .env.local.',
      },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json()) as { items?: IncomingItem[] }
    const items = body.items ?? []

    if (items.length === 0) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
    }

    // Calcul du total côté serveur (source de vérité — jamais le client)
    let subtotal = 0
    const lineItems: { name: string; quantity: number }[] = []

    for (const item of items) {
      const product = getProductById(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.productId}` },
          { status: 400 },
        )
      }
      const qty = Math.max(1, Math.floor(item.quantity))
      subtotal += product.price * qty
      lineItems.push({ name: product.name, quantity: qty })
    }

    const shipping = shippingCost(subtotal)
    const amount = subtotal + shipping

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(lineItems).slice(0, 500),
        subtotal: String(subtotal),
        shipping: String(shipping),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      subtotal,
      shipping,
    })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement.' },
      { status: 500 },
    )
  }
}
