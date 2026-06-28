import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark Indigo ──
        bg: {
          DEFAULT: 'var(--color-bg)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          glow: 'var(--color-accent-glow)',
          dim: 'var(--color-accent-dim)',
          light: 'var(--color-accent-hover)', // alias rétro-compat
        },
        fg: {
          DEFAULT: 'var(--color-fg)',
          secondary: 'var(--color-fg-secondary)',
          muted: 'var(--color-fg-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        // ── Alias anciens tokens (mappés sur le thème dark) ──
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        foreground: 'var(--color-foreground)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sans)', 'system-ui', 'sans-serif'], // alias → Space Grotesk
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'DM Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter2: '-0.02em',
        luxe: '0.25em',
        wider2: '0.1em',
      },
      backgroundImage: {
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-glow': 'var(--gradient-glow)',
      },
      boxShadow: {
        glow: '0 12px 40px -12px rgba(255, 255, 255, 0.25)',
        'glow-sm': '0 6px 20px -10px rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'marquee-left': 'marquee-left 35s linear infinite',
        'marquee-right': 'marquee-right 40s linear infinite',
        'pulse-orb': 'pulse-orb 4s ease-in-out infinite',
        'scan-lines': 'scan-lines 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'accent-pulse': 'accent-pulse 2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
