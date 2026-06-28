import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product/ProductCard'
import { ArrowLink } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const featured = getFeaturedProducts().slice(0, 4)

export function CollectionPreview() {
  return (
    <section className="bg-bg px-2 py-24 md:py-32">
      <div className="container-luxe">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-fg-secondary">
              — Sélection
            </p>
            <h2
              className="font-sans font-semibold tracking-tighter2 text-fg"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              La Collection
            </h2>
          </div>
          <ArrowLink href="/collection" className="hidden sm:inline-flex">
            Voir tout
          </ArrowLink>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <ScrollReveal key={product.id} delay={(i % 4) * 80} threshold={0.1}>
              <ProductCard product={product} priority={i < 2} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
