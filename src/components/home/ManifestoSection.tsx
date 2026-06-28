'use client'

import { useEffect, useRef } from 'react'
import { animateTextReveal, accentLineSlide } from '@/lib/animations'

export function ManifestoSection() {
  const headingRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cleanups: Array<(() => void) | void> = []
    if (headingRef.current) {
      cleanups.push(animateTextReveal(headingRef.current))
    }
    if (lineRef.current) {
      accentLineSlide(lineRef.current)
    }
    return () => cleanups.forEach((c) => c?.())
  }, [])

  return (
    <section className="flex min-h-[60vh] items-center bg-bg px-6 md:px-16">
      <div className="container-luxe">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-fg-secondary">
          — Notre philosophie
        </p>

        <p
          ref={headingRef}
          className="max-w-4xl font-sans font-semibold leading-[1.1] tracking-tighter2 text-fg"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          Un bracelet ne se porte pas. Il se vit.
        </p>

        <div
          ref={lineRef}
          className="mt-10 h-0.5 w-[120px] bg-accent"
          style={{ transformOrigin: 'left center' }}
        />

        <p
          className="mt-8 max-w-xl font-sans text-lg font-light leading-relaxed text-fg-secondary"
          style={{ animation: 'fadeInUp 0.9s ease 0.8s both' }}
        >
          Conçu pour la Royal Pop. Taillé pour l&apos;exception.
        </p>
      </div>
    </section>
  )
}
