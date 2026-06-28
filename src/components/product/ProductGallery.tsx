'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const hasThumbs = product.images.length > 1

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Miniatures (si plusieurs images) */}
      {hasThumbs && (
        <div className="flex gap-3 md:flex-col">
          {product.images.map((src, idx) => (
            <button
              key={src}
              onClick={() => setActive(idx)}
              aria-label={`Voir l'image ${idx + 1}`}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-md border transition-all',
                active === idx
                  ? 'border-accent'
                  : 'border-border opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Visuel principal */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-lg bg-bg-surface">
        <Image
          src={product.images[active]}
          alt={`${product.name} — vue ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
