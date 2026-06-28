'use client'

import { useEffect, useRef } from 'react'
import { parallaxElement } from '@/lib/animations'
import { useAutoplayVideo } from '@/hooks/useAutoplayVideo'

export function VideoImmersive() {
  const textRef = useRef<HTMLDivElement>(null)
  const videoRef = useAutoplayVideo()

  useEffect(() => {
    if (typeof window === 'undefined' || !textRef.current) return
    parallaxElement(textRef.current, 0.4)
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.9 }}
      >
        <source src="/videos/immersive-loop.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-bg/40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Texte overlay */}
      <div
        ref={textRef}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2 md:left-16"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.1em] text-fg-secondary">
          Matière · Précision · Style
        </p>
        <h2
          className="font-sans font-bold tracking-tightest text-fg"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
        >
          Fait pour durer.
        </h2>
      </div>
    </section>
  )
}
