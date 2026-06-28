'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'

/**
 * Wrapper autour du store Zustand persistant qui évite les
 * mismatches d'hydratation : `hydrated` passe à true après le mount.
 */
export function useCart() {
  const store = useCartStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return {
    ...store,
    hydrated,
    // Valeurs sûres pour le SSR : 0 tant que non hydraté
    safeItemCount: hydrated ? store.itemCount() : 0,
    safeTotal: hydrated ? store.total() : 0,
  }
}
