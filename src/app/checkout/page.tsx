'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Elements } from '@stripe/react-stripe-js'
import { Lock, AlertTriangle } from 'lucide-react'
import { getStripe, stripeAppearance } from '@/lib/stripe-client'
import { useCart } from '@/hooks/useCart'
import { formatPrice, shippingCost } from '@/lib/utils'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

const stripePromise = getStripe()

export default function CheckoutPage() {
  const { items, safeTotal, hydrated } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const subtotal = safeTotal
  const shipping = shippingCost(subtotal)

  useEffect(() => {
    if (!hydrated || items.length === 0) return
    let cancelled = false

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
        if (!cancelled) {
          setClientSecret(data.clientSecret)
          setAmount(data.amount)
        }
      })
      .catch((err) => !cancelled && setError(err.message))

    return () => {
      cancelled = true
    }
  }, [hydrated, items])

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="font-serif text-3xl font-medium">Votre panier est vide</h1>
        <Link
          href="/collection"
          className="mt-8 bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-white hover:bg-secondary"
        >
          Explorer la collection
        </Link>
      </div>
    )
  }

  return (
    <div className="container-luxe pb-24 pt-32 md:pt-40">
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Paiement</h1>
      <p className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
        <Lock className="h-3.5 w-3.5" /> Connexion chiffrée · Propulsé par Stripe
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Formulaire */}
        <div>
          {error ? (
            <div className="flex items-start gap-3 border border-amber-300 bg-amber-50 p-6 text-amber-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Paiement indisponible</p>
                <p className="mt-1 text-sm">{error}</p>
                <p className="mt-3 text-xs">
                  Configurez vos clés Stripe dans{' '}
                  <code className="rounded bg-amber-100 px-1">.env.local</code>{' '}
                  puis redémarrez le serveur.
                </p>
              </div>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: stripeAppearance }}
            >
              <CheckoutForm amount={amount} />
            </Elements>
          ) : (
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded bg-muted" />
              <div className="h-32 animate-pulse rounded bg-muted" />
              <div className="h-12 animate-pulse rounded bg-muted" />
            </div>
          )}
        </div>

        {/* Récap commande */}
        <aside className="h-fit border border-border bg-surface p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl font-medium">Votre commande</h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.product.id} className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-serif text-sm">{item.product.name}</span>
                  <span className="font-mono text-xs text-accent">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Sous-total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Livraison</dt>
              <dd>
                {shipping === 0 ? (
                  <span className="text-accent">Offerte</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-serif text-lg">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
