import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'

const BASE = 'https://strap.example'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/collection', '/panier'].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const productRoutes = getAllProducts().map((p) => ({
    url: `${BASE}/produit/${p.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
