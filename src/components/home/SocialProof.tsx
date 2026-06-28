'use client'

import { Star } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder'

const REVIEWS = [
  {
    name: 'Camille R.',
    location: 'Paris',
    text: 'Le biocéramique Ocho Negro est sublime, ajustement parfait sur ma Royal Pop. Une toute autre allure.',
    product: 'Ocho Negro',
  },
  {
    name: 'Thomas L.',
    location: 'Lyon',
    text: 'Qualité bluffante pour le prix. Les maillons de l’Orenji Hachi sont d’une finesse rare. Montage en 30 secondes.',
    product: 'Orenji Hachi',
  },
  {
    name: 'Sofia M.',
    location: 'Genève',
    text: 'Service impeccable, livraison ultra rapide. Le Huit Blanc est exactement la teinte de ma montre.',
    product: 'Huit Blanc',
  },
  {
    name: 'Julien P.',
    location: 'Bordeaux',
    text: 'J’ai pris deux coloris, je les change selon l’humeur. Addictif. La finition est au rendez-vous.',
    product: 'Green Eight',
  },
  {
    name: 'Inès B.',
    location: 'Marseille',
    text: 'Enfin un bracelet à la hauteur de la Royal Pop. L’emballage à lui seul est une expérience.',
    product: 'Otg Roz',
  },
]

export function SocialProof() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="mb-14 text-center">
        <ScrollReveal>
          <div className="mb-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-accent text-accent"
                strokeWidth={0}
              />
            ))}
          </div>
          <h2
            className="font-serif font-medium"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Ils ont adopté STRAP
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-text-secondary">
            4,9 / 5 · plus de 1 200 avis vérifiés
          </p>
        </ScrollReveal>
      </div>

      {/* Avis */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <ScrollReveal
            key={review.name}
            delay={(i % 3) * 80}
            threshold={0.1}
            className="flex h-full flex-col border border-border/70 bg-surface p-7"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className="h-3.5 w-3.5 fill-accent text-accent"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="flex-1 font-serif text-lg font-light italic leading-relaxed text-foreground/90">
              « {review.text} »
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-medium">
                {review.name}{' '}
                <span className="font-light text-text-secondary">
                  · {review.location}
                </span>
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-fg-secondary">
                {review.product}
              </p>
            </div>
          </ScrollReveal>
        ))}

        {/* Slot UGC vidéo */}
        <ScrollReveal delay={160} threshold={0.1} className="min-h-[220px]">
          <VideoPlaceholder
            label="UGC — Avis client"
            aspectRatio="1/1"
            className="h-full"
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
