'use client'

import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { useAutoplayVideo } from '@/hooks/useAutoplayVideo'

const TIMELINE = [
  {
    date: 'Mars 2022',
    title: 'Le précédent MoonSwatch',
    text: 'Omega × Swatch déclenche une hystérie mondiale. Des files de 12h, des reventes à 2000$. Swatch prouve qu’il peut créer le phénomène culturel de l’année.',
  },
  {
    date: '2023',
    title: 'La graine est plantée',
    text: 'AP commente le post Instagram du MoonSwatch Fifty Fathoms : "when do we launch ?" Un commentaire anodin. Le monde de la montre ne l’oubliera pas.',
  },
  {
    date: '12 mai 2026',
    title: 'Le monde découvre la Royal Pop',
    text: 'Après des teasers cryptiques dans The Guardian et Instagram, AP × Swatch révèle l’impensable : 8 montres de gousset biocéramique. Jamais une maison indépendante du calibre d’AP n’avait collaboré avec Swatch.',
  },
  {
    date: '16 mai 2026',
    title: 'Le drop',
    text: '200 boutiques Swatch dans le monde. Une pièce par personne par jour. Des files d’attente dès la veille à Londres, New York, Tokyo. STRAP naît de ce moment — pour habiller cette montre d’exception comme elle le mérite.',
  },
]

export function StorySection() {
  const videoRef = useAutoplayVideo()

  return (
    <section id="histoire" className="container-luxe py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Vidéo */}
        <ScrollReveal animation="fade-up" className="lg:sticky lg:top-28 lg:h-fit">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bg-surface">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0.9 }}
            >
              <source src="/videos/story-loop.mp4" type="video/mp4" />
            </video>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-secondary">
            Notre histoire
          </p>
          <h2
            className="font-serif font-medium"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
          >
            Née d’une montre devenue légende
          </h2>
          <div className="mt-5">
            <GoldDivider width="100px" />
          </div>

          <ol className="mt-12 space-y-10 border-l border-border pl-8">
            {TIMELINE.map((item, i) => (
              <ScrollReveal as="li" key={item.date} delay={i * 80} className="relative">
                <span className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-bg" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-secondary">
                  {item.date}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-medium">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-text-secondary">
                  {item.text}
                </p>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
