'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  /** Ne se déclenche qu'une fois (défaut: true) */
  once?: boolean
}

/**
 * Hook basé sur IntersectionObserver.
 * Retourne une ref à attacher et un booléen isVisible.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: ScrollAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
