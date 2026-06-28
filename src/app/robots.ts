import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/confirmation', '/api/'],
    },
    sitemap: 'https://strap.example/sitemap.xml',
  }
}
