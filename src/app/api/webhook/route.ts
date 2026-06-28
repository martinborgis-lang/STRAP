import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

// Le webhook a besoin du corps brut : on désactive toute mise en cache.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')

  const rawBody = await request.text()

  let event: Stripe.Event

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } else {
      // Mode dev sans secret : on parse directement (NON sécurisé, dev only)
      event = JSON.parse(rawBody) as Stripe.Event
    }
  } catch (err) {
    console.error('[webhook] signature invalide', err)
    return NextResponse.json(
      { error: 'Signature webhook invalide.' },
      { status: 400 },
    )
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent
      // TODO : enregistrer la commande en base, envoyer l'email de confirmation
      console.log(
        `[webhook] ✓ Paiement réussi — ${intent.id} — ${
          intent.amount / 100
        } €`,
        intent.metadata,
      )
      break
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      console.warn(`[webhook] ✗ Paiement échoué — ${intent.id}`)
      break
    }
    default:
      console.log(`[webhook] événement non géré : ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
