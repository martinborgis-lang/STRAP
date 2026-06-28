'use client'

import { Watch, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import type { Product } from '@/types'
import { AddToCartButton } from './AddToCartButton'

const GUARANTEES = [
  { icon: Truck, label: 'Livraison 48h' },
  { icon: RotateCcw, label: 'Retours 30 jours' },
  { icon: ShieldCheck, label: 'Paiement sécurisé' },
]

export function ProductPurchasePanel({ product }: { product: Product }) {
  return (
    <div>
      {/* Ce bracelet est conçu pour */}
      <div className="rounded-lg border border-border bg-bg-surface p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-muted">
          Ce bracelet est conçu pour
        </p>
        <div className="flex items-center gap-3">
          <span
            className="h-9 w-9 shrink-0 rounded-full ring-1 ring-white/15"
            style={{ backgroundColor: product.braceletColor }}
            aria-hidden
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-dim px-4 py-2 font-sans text-sm font-medium text-accent">
            <Watch className="h-4 w-4" strokeWidth={1.75} />
            {product.compatibleWith}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <AddToCartButton product={product} />
      </div>

      {/* Garanties */}
      <ul className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
        {GUARANTEES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
