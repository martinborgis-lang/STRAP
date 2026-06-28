'use client'

import Image from 'next/image'
import { getAllProducts } from '@/lib/products'

const products = getAllProducts()

export function MarqueeSection() {
  // Dupliqué ×2 pour un défilement en boucle sans saut
  const items = [...products, ...products]

  return (
    <section className="overflow-hidden border-y border-border bg-bg-surface py-6">
      <div className="flex">
        <div
          className="flex shrink-0 items-center gap-4 pr-4"
          style={{ animation: 'marquee-left 35s linear infinite' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = 'paused'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = 'running'
          }}
        >
          {items.map((product, i) => (
            <div key={`${product.id}-${i}`} className="flex items-center gap-4">
              <div className="relative h-[140px] w-[180px] shrink-0 overflow-hidden rounded-lg sm:h-[160px] sm:w-[200px]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <span className="shrink-0 font-mono text-xs uppercase tracking-[0.1em] text-fg-muted">
                STRAP ·
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
