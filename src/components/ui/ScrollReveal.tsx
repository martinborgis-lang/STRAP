'use client'

import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

type Animation = 'fade-up' | 'slide-left' | 'scale'

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: Animation
  delay?: number
  threshold?: number
  className?: string
  as?: React.ElementType
}

const animClasses: Record<Animation, string> = {
  'fade-up': 'reveal-fade-up',
  'slide-left': 'reveal-slide-left',
  scale: 'reveal-scale',
}

/**
 * Wrapper d'animation au scroll. L'enfant est masqué (opacity 0)
 * jusqu'à ce qu'il entre dans le viewport, puis joue l'animation CSS.
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.2,
  className,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold })

  return (
    <Tag
      ref={ref}
      className={cn(isVisible ? animClasses[animation] : 'opacity-0', className)}
      style={{ animationDelay: isVisible ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
