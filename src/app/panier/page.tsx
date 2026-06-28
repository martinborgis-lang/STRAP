'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import {
  formatPrice,
  shippingCost,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/utils'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    safeTotal,
    hydrated,
  } = useCart()

  const subtotal = safeTotal
  const shipping = shippingCost(subtotal)
  const total = subtotal + shipping

  if (hydrated && items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <ShoppingBag className="mb-6 h-12 w-12 text-border" strokeWidth={1} />
        <h1 className="font-serif text-3xl font-medium">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-text-secondary">
          Il est temps de lui trouver le bracelet idéal.
        </p>
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
      <h1 className="font-serif text-4xl font-semibold md:text-5xl">Panier</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        {/* Liste */}
        <div>
          {!hydrated ? (
            <p className="text-text-secondary">Chargement…</p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-5 py-6">
                  <Link
                    href={`/produit/${item.product.slug}`}
                    className="relative h-32 w-24 shrink-0 overflow-hidden bg-muted"
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/produit/${item.product.slug}`}
                          className="font-serif text-xl font-medium hover:text-accent"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-muted">
                          Compatible {item.product.compatibleWith}
                        </p>
                      </div>
                      <p className="font-sans text-base font-semibold text-accent">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Diminuer la quantité"
                          className="px-3 py-2 text-text-secondary hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-9 text-center font-mono text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Augmenter la quantité"
                          className="px-3 py-2 text-text-secondary hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/collection"
            className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continuer mes achats
          </Link>
        </div>

        {/* Récapitulatif */}
        <aside className="h-fit border border-border bg-surface p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl font-medium">Récapitulatif</h2>

          <dl className="mt-6 space-y-3 text-sm">
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
            {shipping > 0 && (
              <p className="text-xs text-text-secondary">
                Plus que {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} pour
                la livraison offerte.
              </p>
            )}
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-text-secondary">
              Total
            </span>
            <span className="font-serif text-2xl font-medium">
              {formatPrice(total)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex min-h-[56px] w-full items-center justify-center rounded-lg bg-white py-4 text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover active:scale-[0.98]"
          >
            Passer au paiement
          </Link>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-fg-muted">
            Paiement 100% sécurisé · Stripe
          </p>
        </aside>
      </div>
    </div>
  )
}
