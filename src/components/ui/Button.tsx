'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  // alias rétro-compat
  | 'gold'
  | 'dark'
  | 'outline'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] focus-visible:outline-offset-4'

const variants: Record<Variant, string> = {
  primary: 'bg-white text-black hover:bg-accent-hover',
  secondary:
    'border border-border-strong bg-transparent text-fg hover:border-white/50',
  ghost: 'text-fg-secondary hover:text-fg',
  // aliases
  gold: 'bg-white text-black hover:bg-accent-hover',
  dark: 'border border-border bg-bg-elevated text-fg hover:border-white/50',
  outline:
    'border border-border-strong bg-transparent text-fg hover:border-white/50',
}

const sizes: Record<Size, string> = {
  sm: 'text-[12px] px-4 py-2.5 min-h-[40px]',
  md: 'text-[13px] px-6 py-3 min-h-[44px]',
  lg: 'text-sm px-8 py-4 min-h-[52px]',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...rest}
      >
        {children}
      </Link>
    )
  }

  const { disabled, ...rest } = props as ButtonAsButton
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
})

/** Lien fléché style Wolverine : "→ Texte →" avec flèche animée au hover. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-sans text-sm font-medium text-fg-secondary transition-colors hover:text-fg',
        className,
      )}
    >
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
      {children}
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}
