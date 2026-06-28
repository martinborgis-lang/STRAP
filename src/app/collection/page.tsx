import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import { ProductGrid } from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Les 8 Coloris',
  description:
    'Le bracelet biocéramique STRAP, adaptable pour la montre à gousset AP × Swatch Royal Pop, décliné en 8 coloris — un par modèle Royal Pop.',
}

export default function CollectionPage() {
  const products = getAllProducts()

  return (
    <>
      {/* Hero compact — typographie pure */}
      <header className="flex min-h-[40vh] items-end bg-bg pb-10 pt-32 md:pt-40">
        <div className="container-luxe">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-accent">
            — {products.length} coloris
          </p>
          <h1
            className="font-sans font-bold tracking-tightest text-fg"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
          >
            Les 8 Coloris
          </h1>
          <p className="mt-4 max-w-xl font-sans text-base font-light text-fg-secondary">
            Un bracelet biocéramique adaptable, pensé pour chaque montre à
            gousset AP × Swatch Royal Pop. Choisissez le coloris de la vôtre.
          </p>
        </div>
      </header>

      <div className="container-luxe py-12 md:py-16">
        <ProductGrid products={products} />
      </div>
    </>
  )
}
