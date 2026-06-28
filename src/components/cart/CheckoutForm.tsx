'use client'

import { useState } from 'react'
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

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

    // Si on arrive ici, c'est qu'il y a eu une erreur (sinon redirection)
    if (submitError) {
      setError(submitError.message ?? 'Une erreur est survenue.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Coordonnées */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium">Coordonnées</h2>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          aria-label="Adresse e-mail"
          className="w-full rounded-lg border border-border bg-bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent"
        />
      </div>

      {/* Livraison */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium">Livraison</h2>
        <AddressElement options={{ mode: 'shipping' }} />
      </div>

      {/* Paiement */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium">Paiement</h2>
        <PaymentElement />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
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
