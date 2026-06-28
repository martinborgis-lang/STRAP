import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import {
  getProductBySlug,
  getAllProducts,
  getRelatedProducts,
} from '@/lib/products'
import { MATERIAL_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductCard } from '@/components/product/ProductCard'

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · STRAP`,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  }
}

export default function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: 'STRAP' },
    material: MATERIAL_LABELS[product.material],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (product.price / 100).toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <article className="pb-28 pt-24 md:pt-28 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-luxe">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'ariane"
          className="flex items-center gap-1.5 py-6 text-[11px] uppercase tracking-[0.14em] text-text-secondary"
        >
          <Link href="/" className="hover:text-accent">
            Accueil
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/collection" className="hover:text-accent">
            Collection
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Galerie + infos */}
        <div className="grid gap-10 py-6 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:py-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-secondary">
              {MATERIAL_LABELS[product.material]}
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 font-sans text-2xl font-semibold text-accent">
              {formatPrice(product.price)}
            </p>

            <p className="mt-6 max-w-lg font-sans text-[15px] font-light leading-relaxed text-secondary">
              {product.description}
            </p>

            <div className="mt-10">
              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </div>

        {/* Vous aimerez aussi */}
        <section className="border-t border-border py-20">
          <h2 className="mb-10 font-serif text-3xl font-medium">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Barre d'achat sticky — mobile uniquement */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-4 pr-[4.5rem]">
          <div className="shrink-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-muted">
              {product.name}
            </p>
            <p className="tabular font-sans text-lg font-semibold text-fg">
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="flex-1">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  )
}
