'use client'

import { useEffect, useRef, type DependencyList } from 'react'
import gsap from 'gsap'

/**
 * Exécute une fonction GSAP dans un gsap.context() scoppé à `scope`,
 * avec cleanup automatique (SSR-safe).
 */
export function useGSAP(
  callback: (ctx: { self: gsap.Context }) => void,
  deps: DependencyList = [],
) {
  const scope = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context((self) => {
      callback({ self })
    }, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
