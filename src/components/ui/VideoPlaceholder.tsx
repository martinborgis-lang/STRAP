'use client'

import { cn } from '@/lib/utils'

interface VideoPlaceholderProps {
  label: string
  aspectRatio?: '16/9' | '9/16' | '4/5' | '1/1'
  src?: string
  className?: string
  /** Overlay dégradé bas pour lisibilité du texte */
  overlay?: boolean
  poster?: string
}

export function VideoPlaceholder({
  label,
  aspectRatio = '16/9',
  src,
  className,
  overlay,
  poster,
}: VideoPlaceholderProps) {
  if (src) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden bg-bg-surface', className)}
      style={{ aspectRatio: aspectRatio.replace('/', ' / ') }}
    >
      {/* Gradient de fond animé — noir pur */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #141414 100%)',
        }}
      />

      {/* Grille de points — pattern tech */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Orbe blanc animé */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            paddingBottom: '40%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            animation: 'pulse-orb 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Lignes de scan — effet tech */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)',
          animation: 'scan-lines 8s linear infinite',
        }}
      />

      {/* Badge label */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <span
          className="block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: '#A0A0A0',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-secondary">
          {label} — Vidéo IA
        </span>
      </div>

      {/* Overlay gradient */}
      {overlay && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 50%)',
          }}
        />
      )}
    </div>
  )
}
