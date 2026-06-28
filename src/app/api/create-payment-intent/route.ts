import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { shippingCost } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface IncomingItem {
  product_id: string
  quantity: number
}

interface Body {
  items?: IncomingItem[]
  customerEmail?: string
  customerName?: string
  shippingAddress?: {
    line1?: string
    line2?: string
    city?: string
    postal_code?: string
    country?: string
  }
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
    const { items = [], customerEmail, customerName, shippingAddress } =
      (await request.json()) as Body

    if (items.length === 0) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
    }

    // Calcul du total côté serveur (source de vérité — jamais le client).
    // On ne conserve en metadata qu'une liste compacte {id, q} pour rester
    // sous la limite de 500 caractères par valeur de metadata Stripe ; le
    // webhook reconstruit les détails depuis le catalogue.
    let subtotal = 0
    const compact: { id: string; q: number }[] = []

    for (const item of items) {
      const product = getProductById(item.product_id)
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.product_id}` },
          { status: 400 },
        )
      }
      const qty = Math.max(1, Math.floor(item.quantity))
      subtotal += product.price * qty
      compact.push({ id: product.id, q: qty })
    }

    const shipping = shippingCost(subtotal)
    const total = subtotal + shipping

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail || undefined,
      metadata: {
        customerEmail: customerEmail ?? '',
        customerName: customerName ?? '',
        items: JSON.stringify(compact),
        shippingAddress: JSON.stringify(shippingAddress ?? {}),
        subtotal: String(subtotal),
        shippingCost: String(shipping),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      total,
      shippingCost: shipping,
    })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
