'use client'

import { useEffect, useState } from 'react'
import {
  PaymentElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import type { PaymentRequest } from '@stripe/stripe-js'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface CustomerInfo {
  name: string
  email: string
  line1: string
  line2: string
  city: string
  postalCode: string
  country: string
}

export const EMPTY_CUSTOMER: CustomerInfo = {
  name: '',
  email: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: 'FR',
}

const COUNTRIES = [
  ['FR', 'France'],
  ['BE', 'Belgique'],
  ['CH', 'Suisse'],
  ['LU', 'Luxembourg'],
  ['DE', 'Allemagne'],
  ['ES', 'Espagne'],
  ['IT', 'Italie'],
  ['NL', 'Pays-Bas'],
  ['GB', 'Royaume-Uni'],
] as const

const inputClass =
  'w-full rounded-lg border border-border bg-bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent'

/* ─────────────────────────  Étape 1 : Coordonnées + Livraison  ──────────────────────── */

export function ShippingForm({
  value,
  onChange,
  onSubmit,
  submitting,
  error,
}: {
  value: CustomerInfo
  onChange: (next: CustomerInfo) => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}) {
  const set = (key: keyof CustomerInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => onChange({ ...value, [key]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="mb-4 font-sans text-xl font-semibold text-fg">
          Coordonnées
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            required
            value={value.name}
            onChange={set('name')}
            placeholder="Nom complet"
            aria-label="Nom complet"
            className={inputClass}
          />
          <input
            type="email"
            required
            value={value.email}
            onChange={set('email')}
            placeholder="Adresse e-mail"
            aria-label="Adresse e-mail"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-sans text-xl font-semibold text-fg">
          Livraison
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            required
            value={value.line1}
            onChange={set('line1')}
            placeholder="Adresse"
            aria-label="Adresse"
            className={inputClass}
          />
          <input
            type="text"
            value={value.line2}
            onChange={set('line2')}
            placeholder="Complément d'adresse (optionnel)"
            aria-label="Complément d'adresse"
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={value.postalCode}
              onChange={set('postalCode')}
              placeholder="Code postal"
              aria-label="Code postal"
              className={inputClass}
            />
            <input
              type="text"
              required
              value={value.city}
              onChange={set('city')}
              placeholder="Ville"
              aria-label="Ville"
              className={inputClass}
            />
          </div>
          <select
            value={value.country}
            onChange={set('country')}
            aria-label="Pays"
            className={inputClass}
          >
            {COUNTRIES.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-border bg-bg-surface px-4 py-3 text-sm text-fg">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-white py-4 text-[13px] font-semibold text-black transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60"
      >
        {submitting ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Préparation…
          </>
        ) : (
          <>
            Continuer vers le paiement
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}

/* ─────────────────────────  Étape 2 : Paiement  ──────────────────────── */

export function PaymentForm({
  amount,
  email,
  clientSecret,
}: {
  amount: number
  email: string
  clientSecret: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null,
  )

  // Apple Pay / Google Pay via le Payment Request Button.
  useEffect(() => {
    if (!stripe) return

    const pr = stripe.paymentRequest({
      country: 'FR',
      currency: 'eur',
      total: { label: 'STRAP', amount },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'standard',
          label: 'Livraison standard 48h',
          detail: 'Livraison en France et Europe',
          amount: 590,
        },
      ],
    })

    // N'affiche le bouton que si un wallet est disponible
    // (Safari → Apple Pay, Chrome Android → Google Pay).
    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr)
    })

    // L'adresse change : on confirme le total et l'option de livraison.
    pr.on('shippingaddresschange', (ev) => {
      ev.updateWith({
        status: 'success',
        total: { label: 'STRAP', amount },
        shippingOptions: [
          {
            id: 'standard',
            label: 'Livraison standard 48h',
            detail: 'Livraison en France et Europe',
            amount: 590,
          },
        ],
      })
    })

    // Confirmation du paiement issu du wallet.
    pr.on('paymentmethod', async (ev) => {
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false },
        )

      if (confirmError) {
        ev.complete('fail')
        setError(confirmError.message ?? 'Le paiement a échoué.')
        return
      }

      ev.complete('success')

      // 3-D Secure éventuel après fermeture de la feuille wallet.
      if (paymentIntent?.status === 'requires_action') {
        const { error: actionError } =
          await stripe.confirmCardPayment(clientSecret)
        if (actionError) {
          setError(actionError.message ?? 'Authentification échouée.')
          return
        }
      }

      window.location.href = `${window.location.origin}/confirmation?redirect_status=succeeded&payment_intent=${paymentIntent?.id ?? ''}`
    })

    return () => {
      pr.off('paymentmethod')
      pr.off('shippingaddresschange')
    }
  }, [stripe, amount, clientSecret])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
        receipt_email: email || undefined,
      },
    })

    if (submitError) {
      setError(submitError.message ?? 'Une erreur est survenue.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-sans text-xl font-semibold text-fg">Paiement</h2>

      {/* Apple Pay / Google Pay — affiché uniquement si supporté */}
      {paymentRequest && (
        <div className="space-y-6">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'buy',
                  theme: 'dark',
                  height: '52px',
                },
              },
            }}
          />
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-secondary">
              ou payer par carte
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <PaymentElement />

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-border bg-bg-surface px-4 py-3 text-sm text-fg">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-white py-4 text-[13px] font-semibold text-black transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60"
      >
        {processing ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Traitement…
          </>
        ) : (
          `Payer ${formatPrice(amount)}`
        )}
      </button>
    </form>
  )
}
