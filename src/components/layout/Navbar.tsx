'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

const NAV_LINKS = [
  { href: '/collection', label: 'Collection' },
  { href: '/#histoire', label: 'Histoire' },
  { href: '/#guide', label: 'Guide' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { toggleCart, openCart, safeItemCount } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
          scrolled
            ? 'border-b border-border bg-bg/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="container-luxe relative flex h-16 items-center justify-between md:h-20">
          {/* Logo — centré sur mobile, à gauche sur desktop */}
          <Link
            href="/"
            aria-label="STRAP — accueil"
            className="absolute left-1/2 -translate-x-1/2 font-sans text-lg font-bold tracking-[0.25em] text-fg md:static md:translate-x-0"
          >
            STRAP
          </Link>

          {/* Liens centre (desktop) */}
          <ul className="hidden items-center gap-10 md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-normal text-fg-secondary underline-offset-8 transition-colors hover:text-fg hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Spacer gauche mobile (équilibre le burger) */}
          <span className="h-5 w-6 md:hidden" aria-hidden />

          {/* Droite : panier (desktop) + burger (mobile) */}
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={toggleCart}
              aria-label="Ouvrir le panier"
              className="relative hidden p-1 text-fg transition-colors hover:text-fg-secondary md:block"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {safeItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[9px] font-medium text-black">
                  {safeItemCount}
                </span>
              )}
            </button>

            {/* Burger animé (mobile) */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="relative z-[110] flex h-6 w-6 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-6 bg-fg"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-6 bg-fg"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="block h-0.5 w-6 bg-fg"
              />
            </button>
          </div>
        </nav>

        {/* Menu mobile plein écran */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[100] flex flex-col justify-center bg-bg px-8 md:hidden"
            >
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 font-sans text-[2.5rem] font-semibold leading-tight text-fg"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="absolute bottom-12 left-8 font-mono text-xs uppercase tracking-[0.2em] text-fg-secondary"
              >
                STRAP · 2024
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Bouton panier flottant (mobile uniquement) */}
      {!mobileOpen && (
        <button
          onClick={openCart}
          aria-label="Ouvrir le panier"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-glow md:hidden"
        >
          <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
          {safeItemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 font-mono text-[10px] font-medium text-white ring-2 ring-white">
              {safeItemCount}
            </span>
          )}
        </button>
      )}
    </>
  )
}
