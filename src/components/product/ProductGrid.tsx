'use client'

import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-24 text-center">
        <p className="font-sans text-2xl font-medium text-fg">
          Aucun coloris disponible
        </p>
        <p className="mt-2 text-sm text-fg-secondary">Revenez bientôt.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {products.map((product, i) => (
        <ScrollReveal
          key={product.id}
          animation="fade-up"
          delay={(i % 4) * 80}
          threshold={0.1}
        >
          <ProductCard product={product} priority={i < 4} />
        </ScrollReveal>
      ))}
    </div>
  )
}
