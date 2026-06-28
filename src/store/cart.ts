'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartStore, Product } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAdded: null,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
              isOpen: true,
              lastAdded: product,
            }
          }
          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
            lastAdded: product,
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0,
        ),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'strap-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
