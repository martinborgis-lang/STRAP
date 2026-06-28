'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link
      href={`/produit/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block cursor-pointer"
    >
      {/* Zone image */}
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-lg border-2 bg-bg-surface transition-colors duration-300"
        style={{ borderColor: hovered ? product.braceletColor : 'transparent' }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
        />

        {!product.inStock && (
          <span className="absolute right-3 top-3 z-10 rounded bg-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.05em] text-fg-muted backdrop-blur-sm">
            Épuisé
          </span>
        )}

        {/* Badge couleur du bracelet */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-border bg-bg/70 px-3 py-1.5 backdrop-blur-sm">
          <span
            className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20"
            style={{ backgroundColor: product.braceletColor }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg">
            {product.name}
          </span>
        </div>

        {/* Bouton add-to-cart au hover */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          aria-label={`Ajouter ${product.name} au panier`}
          className="absolute inset-x-4 bottom-4 z-20 flex translate-y-2 items-center justify-center gap-2 rounded-md bg-white py-3 font-sans text-[13px] font-medium text-black opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} /> Ajouté
            </>
          ) : product.inStock ? (
            'Ajouter au panier'
          ) : (
            'Indisponible'
          )}
        </button>
      </div>

      {/* Zone texte */}
      <div className="pt-4">
        <h3 className="font-sans text-base font-medium text-fg">
          {product.name}
        </h3>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-muted">
          Compatible {product.compatibleWith}
        </p>
        <p className="tabular mt-2 font-mono text-lg font-medium text-accent">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
