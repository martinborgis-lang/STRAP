'use client'

import { useAutoplayVideo } from '@/hooks/useAutoplayVideo'

export function VideoSection2() {
  const videoRef = useAutoplayVideo()

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.9 }}
      >
        <source src="/videos/exploded-view.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient noir en bas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 35%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Texte centré */}
      <div className="relative z-10 px-6 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.1em] text-fg-secondary">
          — Ingénierie
        </p>
        <h2
          className="mx-auto max-w-3xl font-sans font-bold tracking-tightest text-white"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}
        >
          Chaque maillon. Chaque détail.
        </h2>
        <p className="mx-auto mt-5 max-w-md font-sans text-lg font-light text-fg-secondary">
          Biocéramique de précision, conçu pour durer.
        </p>
      </div>
    </section>
  )
}
