'use client'

import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface GoldDividerProps {
  className?: string
  align?: 'left' | 'center'
  width?: string
}

/** Ligne dorée qui slide-in (scaleX) lorsqu'elle entre dans le viewport. */
export function GoldDivider({
  className,
  align = 'left',
  width = '120px',
}: GoldDividerProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.6,
  })

  return (
    <div
      ref={ref}
      className={cn('h-px', align === 'center' && 'mx-auto', className)}
      style={{ width }}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-white via-white/50 to-transparent transition-transform duration-[1100ms] ease-luxe"
        style={{ transform: isVisible ? 'scaleX(1)' : 'scaleX(0)' }}
      />
    </div>
  )
}
