'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/utils'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    safeTotal,
    hydrated,
  } = useCart()

  // Mobile : plein écran + slide-up depuis le bas. Desktop : drawer latéral droit.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const panelMotion = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }

  const total = safeTotal
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-bg/60 backdrop-blur-md"
            aria-hidden
          />

          <motion.aside
            {...panelMotion}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex w-full flex-col border-border bg-bg-surface shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-[420px] sm:border-l"
            role="dialog"
            aria-label="Panier"
          >
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-sans text-xl font-semibold text-fg">
                Votre panier
              </h2>
              <button
                onClick={closeCart}
                aria-label="Fermer le panier"
                className="p-1 text-fg-secondary transition-colors hover:text-fg"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Barre livraison offerte */}
            {hydrated && items.length > 0 && (
              <div className="border-b border-border px-6 py-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-secondary">
                  {remaining > 0 ? (
                    <>
                      Plus que{' '}
                      <span className="font-medium text-accent">
                        {formatPrice(remaining)}
                      </span>{' '}
                      pour la livraison offerte
                    </>
                  ) : (
                    <span className="font-medium text-accent">
                      ✓ Livraison offerte débloquée
                    </span>
                  )}
                </p>
                <div className="h-1 overflow-hidden rounded-full bg-bg-elevated">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Liste */}
            <div className="flex-1 overflow-y-auto px-6">
              {!hydrated || items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag
                    className="mb-4 h-10 w-10 text-fg-muted"
                    strokeWidth={1}
                  />
                  <p className="font-sans text-lg font-medium text-fg">
                    Votre panier est vide
                  </p>
                  <p className="mt-1 text-sm text-fg-secondary">
                    Découvrez nos bracelets d&apos;exception.
                  </p>
                  <Link
                    href="/collection"
                    onClick={closeCart}
                    className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-accent underline-offset-4 hover:underline"
                  >
                    Explorer la collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link
                              href={`/produit/${item.product.slug}`}
                              onClick={closeCart}
                              className="font-sans text-sm font-medium leading-tight text-fg hover:text-accent"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted">
                              {item.product.compatibleWith}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Retirer ${item.product.name}`}
                            className="h-fit p-1 text-fg-muted transition-colors hover:text-accent"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-md border border-border bg-bg-elevated">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Diminuer la quantité"
                              className="px-2 py-1.5 text-fg-secondary hover:text-fg"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-7 text-center font-mono text-xs text-fg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Augmenter la quantité"
                              className="px-2 py-1.5 text-fg-secondary hover:text-fg"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="tabular font-mono text-sm font-medium text-accent">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pied : total + CTA */}
            {hydrated && items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-secondary">
                    Sous-total
                  </span>
                  <span className="tabular font-sans text-2xl font-semibold text-fg">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-lg bg-white py-4 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover active:scale-[0.98]"
                >
                  Passer la commande
                </Link>
                <Link
                  href="/panier"
                  onClick={closeCart}
                  className="mt-3 block text-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg-secondary underline-offset-4 hover:text-fg hover:underline"
                >
                  Voir le panier
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
