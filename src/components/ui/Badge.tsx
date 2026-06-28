import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'dark' | 'soft' | 'outline'
  className?: string
}

const variants = {
  gold: 'bg-accent text-white',
  dark: 'bg-primary text-white',
  soft: 'bg-muted text-secondary',
  outline: 'border border-border text-text-secondary',
}

export function Badge({ children, variant = 'soft', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
