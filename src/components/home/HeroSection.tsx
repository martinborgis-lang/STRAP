'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowLink } from '@/components/ui/Button'

const LINES = [
  { text: 'Wear.', className: 'text-fg' },
  { text: 'Every.', className: 'text-fg pl-[8vw]' },
  { text: 'Second.', className: 'text-accent' },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-end overflow-hidden bg-bg"
    >
      {/* Vidéo de fond */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ opacity: 0.85, objectPosition: 'center center' }}
      >
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Contenu bas-gauche */}
      <div className="container-luxe relative z-10 pb-20 md:pb-28">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-fg-secondary"
        >
          — Nouvelle Collection 2024
        </motion.p>

        <h1
          className="font-sans font-bold leading-[0.95] tracking-tightest"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
        >
          {LINES.map((line) => (
            <span
              key={line.text}
              className={`hero-line block ${line.className}`}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10"
        >
          <ArrowLink
            href="/collection"
            className="min-h-[44px] items-center text-base text-fg"
          >
            Découvrir la collection
          </ArrowLink>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <motion.span
          initial={{ height: 0 }}
          animate={{ height: 60 }}
          transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
          className="block w-px bg-gradient-to-b from-white to-transparent"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          scroll
        </span>
      </div>
    </section>
  )
}
