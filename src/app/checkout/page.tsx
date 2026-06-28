'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Elements } from '@stripe/react-stripe-js'
import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react'
import { getStripe, stripeAppearance } from '@/lib/stripe-client'
import { useCart } from '@/hooks/useCart'
import { formatPrice, shippingCost } from '@/lib/utils'
import {
  ShippingForm,
  PaymentForm,
  EMPTY_CUSTOMER,
  type CustomerInfo,
} from '@/components/cart/CheckoutForm'

const stripePromise = getStripe()

export default function CheckoutPage() {
  const { items, safeTotal, hydrated } = useCart()
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const subtotal = safeTotal
  const shipping = shippingCost(subtotal)

  const handleInfoSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            name: i.product.name,
            color: i.product.color,
            compatible_with: i.product.compatibleWith,
            price: i.product.price,
            quantity: i.quantity,
          })),
          customerEmail: customer.email,
          customerName: customer.name,
          shippingAddress: {
            line1: customer.line1,
            line2: customer.line2 || undefined,
            city: customer.city,
            postal_code: customer.postalCode,
            country: customer.country,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setClientSecret(data.clientSecret)
      setAmount(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur')
    } finally {
      setSubmitting(false)
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="font-sans text-3xl font-semibold text-fg">
          Votre panier est vide
        </h1>
        <Link
          href="/collection"
          className="mt-8 rounded-lg bg-white px-8 py-4 text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Explorer la collection
        </Link>
      </div>
    )
  }

  return (
    <div className="container-luxe pb-24 pt-32 md:pt-40">
      <h1 className="font-sans text-4xl font-bold tracking-tightest text-fg md:text-5xl">
        Paiement
      </h1>
      <p className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-secondary">
        <Lock className="h-3.5 w-3.5" /> Connexion chiffrée · Propulsé par Stripe
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Formulaire */}
        <div>
          {clientSecret ? (
            <>
              <button
                onClick={() => setClientSecret(null)}
                className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-secondary transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Modifier mes informations
              </button>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: stripeAppearance }}
              >
                <PaymentForm amount={amount} email={customer.email} />
              </Elements>
            </>
          ) : (
            <>
              <ShippingForm
                value={customer}
                onChange={setCustomer}
                onSubmit={handleInfoSubmit}
                submitting={submitting}
                error={error}
              />
              {error && error.includes('Stripe non configuré') && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-bg-surface p-4 text-fg-secondary">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-xs">
                    Configurez les clés Stripe (variables d&apos;environnement)
                    pour activer le paiement.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Récap commande */}
        <aside className="h-fit rounded-lg border border-border bg-bg-surface p-7 lg:sticky lg:top-28">
          <h2 className="font-sans text-2xl font-semibold text-fg">
            Votre commande
          </h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.product.id} className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white font-mono text-[10px] text-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className="font-sans text-sm text-fg">
                    {item.product.name}
                  </span>
                  <span className="tabular font-mono text-xs text-fg">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-secondary">Sous-total</dt>
              <dd className="text-fg">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-secondary">Livraison</dt>
              <dd className="text-fg">
                {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-sans text-lg font-semibold text-fg">
              <dt>Total</dt>
              <dd className="tabular">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
