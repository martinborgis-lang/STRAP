'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'

function ConfirmationContent() {
  const params = useSearchParams()
  const clearCart = useCartStore((s) => s.clearCart)
  const [orderId, setOrderId] = useState('')

  const status = params.get('redirect_status')
  const intentId = params.get('payment_intent')
  const success = status === 'succeeded' || !status // tolérant en démo

  useEffect(() => {
    if (success) clearCart()
    // Numéro de commande lisible dérivé de l'intent (ou aléatoire stable côté client)
    const ref = intentId
      ? intentId.replace('pi_', '').slice(-8).toUpperCase()
      : Math.abs(
          Array.from(intentId ?? 'STRAP').reduce(
            (a, c) => a + c.charCodeAt(0),
            42,
          ) * 9973,
        )
          .toString(36)
          .slice(-8)
          .toUpperCase()
    setOrderId(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container-luxe flex min-h-[80vh] flex-col items-center justify-center pb-24 pt-32 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-accent"
      >
        <motion.span
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
        </motion.span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 font-serif text-4xl font-semibold md:text-5xl"
      >
        Merci pour votre commande
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 max-w-md text-base font-light text-text-secondary"
      >
        Votre paiement a bien été reçu. Un e-mail de confirmation vous a été
        envoyé. Votre bracelet est préparé avec soin dans notre atelier.
      </motion.p>

      {orderId && (
        <p className="mt-8 rounded-full border border-border bg-surface px-6 py-3 font-mono text-sm tracking-wider">
          Commande n° <span className="text-accent">#{orderId}</span>
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/collection"
          className="rounded-lg bg-white px-8 py-4 text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Retour à la boutique
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-border-strong px-8 py-4 text-[13px] font-medium text-fg transition-colors hover:border-accent hover:bg-accent-dim"
        >
          Accueil
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
