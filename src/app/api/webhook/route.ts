import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getProductById } from '@/lib/products'
import { sendOrderConfirmation, isResendConfigured } from '@/lib/emails'

// Le webhook a besoin du corps brut : on désactive toute mise en cache.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CompactItem {
  id: string
  q: number
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } else {
      // Mode dev sans secret : parse direct (NON sécurisé — dev only).
      event = JSON.parse(rawBody) as Stripe.Event
    }
  } catch (err) {
    console.error('[webhook] signature invalide', err)
    return NextResponse.json(
      { error: 'Webhook signature invalide' },
      { status: 400 },
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const metadata = paymentIntent.metadata ?? {}

    // Reconstruit les lignes depuis le catalogue (source de vérité).
    const compact = safeParse<CompactItem[]>(metadata.items, [])
    const dbItems = compact.map((line) => {
      const product = getProductById(line.id)
      return {
        product_id: line.id,
        product_name: product?.name ?? line.id,
        color: product?.color ?? '',
        compatible_with: product?.compatibleWith ?? '',
        quantity: line.q,
        price: product?.price ?? 0,
      }
    })

    const shippingAddress = safeParse(metadata.shippingAddress, {})

    // 1) Sauvegarde Supabase
    if (isSupabaseConfigured) {
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .insert({
          stripe_payment_intent_id: paymentIntent.id,
          status: 'paid',
          customer_email: metadata.customerEmail,
          customer_name: metadata.customerName,
          shipping_address: shippingAddress,
          items: dbItems,
          total: paymentIntent.amount,
          shipping_cost: parseInt(metadata.shippingCost || '0', 10),
        })
        .select()
        .single()

      if (error) {
        // Idempotence : si l'intent existe déjà (UNIQUE), on ne ré-échoue pas.
        if (error.code === '23505') {
          console.warn('[webhook] commande déjà enregistrée', paymentIntent.id)
          return NextResponse.json({ received: true })
        }
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }

      // 2) Email de confirmation
      if (isResendConfigured) {
        try {
          await sendOrderConfirmation({
            customerEmail: metadata.customerEmail,
            customerName: metadata.customerName,
            orderId: order.id,
            items: dbItems.map((i) => ({
              name: i.product_name,
              color: i.color,
              quantity: i.quantity,
              price: i.price,
            })),
            total: paymentIntent.amount,
            shippingAddress: shippingAddress as {
              line1: string
              city: string
              postal_code: string
              country: string
            },
          })
        } catch (emailError) {
          console.error('Email error:', emailError)
        }
      }
    } else {
      console.log(
        `[webhook] ✓ Paiement ${paymentIntent.id} — ${
          paymentIntent.amount / 100
        }€ (Supabase non configuré, commande non persistée)`,
      )
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    console.warn(`[webhook] ✗ Paiement échoué — ${intent.id}`)
  }

  return NextResponse.json({ received: true })
}

function safeParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
