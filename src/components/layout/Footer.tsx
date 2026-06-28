import Link from 'next/link'
import { Instagram, Twitter, Youtube } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Boutique',
    links: [
      { label: 'Les 8 coloris', href: '/collection' },
      { label: 'Ocho Negro', href: '/produit/ocho-negro' },
      { label: 'Otto Rosso', href: '/produit/otto-rosso' },
      { label: 'Huit Blanc', href: '/produit/huit-blanc' },
      { label: 'Orenji Hachi', href: '/produit/orenji-hachi' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { label: 'Notre histoire', href: '/#histoire' },
      { label: 'Compatibilité', href: '/#guide' },
      { label: 'Savoir-faire', href: '/#materiaux' },
    ],
  },
  {
    title: 'Service',
    links: [
      { label: 'Livraison 48h', href: '/#' },
      { label: 'Retours 30 jours', href: '/#' },
      { label: 'Paiement sécurisé', href: '/#' },
      { label: 'Nous contacter', href: '/#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-luxe py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.3em]">
              STRAP
            </p>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-white/60">
              Bracelets adaptables d&apos;exception pour la montre de la
              collaboration Swatch × Audemars Piguet. Taillé pour la plus rare
              des montres.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/60 transition-colors hover:text-accent-light"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-white/60 transition-colors hover:text-accent-light"
              >
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-white/60 transition-colors hover:text-accent-light"
              >
                <Youtube className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-accent-light">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-light text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {2026} STRAP. Tous droits réservés.</p>
          <p className="font-light">
            STRAP n&apos;est pas affilié à Swatch Group ni à Audemars Piguet.
          </p>
        </div>
      </div>
    </footer>
  )
}
