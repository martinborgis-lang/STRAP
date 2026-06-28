'use client'

import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  product: Product
  className?: string
}

type State = 'idle' | 'loading' | 'done'

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [state, setState] = useState<State>('idle')

  const handleClick = () => {
    if (!product.inStock || state !== 'idle') return
    setState('loading')
    // petite latence simulée pour le feedback visuel
    setTimeout(() => {
      addItem(product)
      setState('done')
      setTimeout(() => setState('idle'), 1600)
    }, 450)
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.inStock || state === 'loading'}
      className={cn(
        'flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-lg py-4 text-[13px] font-semibold transition-all duration-300 active:scale-[0.98]',
        product.inStock
          ? 'bg-white text-black hover:bg-accent-hover'
          : 'cursor-not-allowed bg-bg-elevated text-fg-muted',
        className,
      )}
    >
      {!product.inStock ? (
        'Épuisé'
      ) : state === 'loading' ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          Ajout en cours…
        </>
      ) : state === 'done' ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2} />
          Ajouté au panier !
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          Ajouter au panier
        </>
      )}
    </button>
  )
}
