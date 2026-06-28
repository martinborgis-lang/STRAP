'use client'

import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { useAutoplayVideo } from '@/hooks/useAutoplayVideo'

const products = getAllProducts()

export function CompatibilityGuide() {
  const videoRef = useAutoplayVideo()

  return (
    <section
      id="guide"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg py-24"
    >
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.7 }}
      >
        <source src="/videos/compatibility-loop.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Contenu */}
      <div className="container-luxe relative z-10 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-fg-secondary">
          — Compatibilité
        </p>
        <h2
          className="mx-auto max-w-3xl font-sans font-bold tracking-tightest text-white"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.05 }}
        >
          Conçu pour votre Royal Pop.
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-sans text-lg font-light text-fg-secondary">
          Chaque coloris STRAP correspond exactement à l&apos;identité
          chromatique d&apos;un modèle Royal Pop.
        </p>

        {/* Grille 2×4 mobile / 4×2 desktop */}
        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: product.braceletColor }}
              />
              <span className="text-left text-[13px] leading-tight text-fg">
                {product.compatibleWith}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/collection"
          className="mt-12 inline-flex min-h-[52px] items-center justify-center rounded-lg bg-white px-8 py-4 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Voir les 8 coloris
        </Link>
      </div>
    </section>
  )
}
