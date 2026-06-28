# STRAP

Boutique e-commerce premium pour bracelets adaptables — montre de la collaboration **Swatch × Audemars Piguet** (MoonSwatch / Bioceramic).

Site cinématique et animé, conçu pour accueillir des **vidéos IA** dans des placeholders dédiés, avec un checkout **Stripe** fonctionnel en mode test.

---

## Stack

| Domaine        | Choix                                                |
| -------------- | ---------------------------------------------------- |
| Framework      | Next.js **14** (App Router) — TypeScript strict      |
| Styles         | Tailwind CSS **v3** + CSS Variables (palette)        |
| Animations     | GSAP 3 + ScrollTrigger + SplitText · Framer Motion   |
| E-commerce     | Stripe (stripe-node + Stripe.js + React Stripe.js)   |
| State (panier) | Zustand + persistance `localStorage`                 |
| Fonts          | Space Grotesk · DM Mono                              |
| Icônes         | lucide-react                                         |
| Design system  | **Dark Indigo** (fond `#050510`, accent `#6C63FF`)   |

> ℹ️ Le scaffold `create-next-app` installe désormais Next 16 + Tailwind v4.
> Le projet a été volontairement **épinglé à Next 14 + Tailwind v3** pour coller
> au design system basé sur `tailwind.config.ts` et garantir une compatibilité
> maximale avec GSAP / Framer Motion / Stripe.

---

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseignez vos clés Stripe (optionnel)
npm run dev                  # http://localhost:3000
```

Scripts : `dev` · `build` · `start` · `lint` · `format`

---

## Configuration Stripe (mode test)

1. Récupérez vos clés sur https://dashboard.stripe.com/test/apikeys
2. Renseignez `.env.local` :
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Redémarrez `npm run dev`.
4. Webhook en local :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
5. Carte de test : `4242 4242 4242 4242`, date future, CVC quelconque.

> Tant que les clés sont vides, le site fonctionne normalement ; seule la page
> `/checkout` affiche un message « paiement indisponible » (aucune erreur bloquante).
> Le total est **toujours recalculé côté serveur** dans `create-payment-intent`.

### Passage en production

- Remplacez les clés `pk_test_` / `sk_test_` par les clés `pk_live_` / `sk_live_`.
- Configurez un endpoint webhook de production dans le dashboard Stripe et
  reportez son `whsec_` dans les variables d'environnement de l'hébergeur.

---

## Architecture

```
src/
├── app/                  # Pages (App Router) + routes API Stripe + sitemap/robots
│   ├── page.tsx          # Homepage (8 sections)
│   ├── collection/       # Grille filtrable (filtres via URL params)
│   ├── produit/[slug]/   # Page produit dynamique (SSG + JSON-LD)
│   ├── panier/ checkout/ confirmation/
│   └── api/create-payment-intent · api/webhook
├── components/
│   ├── layout/  (Navbar, Footer, CartDrawer)
│   ├── home/    (Hero, Manifesto, VideoImmersive, CollectionPreview,
│   │            Materials, Story, CompatibilityGuide, SocialProof)
│   ├── product/ (Card, Grid, Filter, Gallery, VariantSelector, AddToCart, PurchasePanel)
│   ├── cart/    (CheckoutForm)
│   └── ui/      (VideoPlaceholder, GoldDivider, ScrollReveal, Button, Badge)
├── lib/    (products, stripe, stripe-client, animations, utils)
├── store/  (cart — Zustand persistant)
├── hooks/  (useCart, useScrollAnimation, useGSAP)
└── types/  (index.ts)
```

---

## Vidéos IA — emplacements à intégrer

Chaque `<VideoPlaceholder label="…" />` est un slot prêt à recevoir une vidéo.
Passez simplement une `src` (ou renseignez `videoPlaceholder` sur le produit) :

| Slot                          | Ratio | Emplacement                     |
| ----------------------------- | ----- | ------------------------------- |
| Hero Loop                     | 16/9  | Hero plein écran                |
| Immersif — Atelier            | 16/9  | Section immersive               |
| Matière — Cuir/Acier/NATO/... | 16/9  | Section matières (scroll pinné) |
| Story — Collab AP × Swatch    | 4/5   | Section histoire                |
| Hover {produit}               | 4/5   | Survol des cartes produit       |
| Produit {nom}                 | 4/5   | Galerie page produit            |
| UGC — Avis client             | 1/1   | Preuve sociale                  |

Les fichiers attendus pointent vers `/public/videos/*.mp4` (cf. `lib/products.ts`).

---

## État du projet

**Fait ✅**

- Build production OK (18 routes), lint sans erreur, TypeScript strict
- Homepage cinématique style Wolverine : 9 sections (Hero « Wear. Every. Second. »,
  marquee défilant, manifeste SplitText, vidéo immersive, collection, matières en
  scroll horizontal pinné, histoire, guide, preuve sociale) + placeholders vidéo « tech » animés
- Navbar sticky + menu burger mobile animé · badge panier réactif
- Panier complet : drawer latéral, page panier, persistance, recalcul du total,
  barre « livraison offerte »
- Collection filtrable (matière / couleur / taille via URL)
- Pages produit dynamiques (SSG, JSON-LD, galerie + vidéo, variantes, garanties)
- Checkout Stripe (PaymentElement + AddressElement) + confirmation animée
- API : `create-payment-intent` (total serveur) · `webhook` (raw body)
- SEO : metadata par page, Open Graph, sitemap.xml, robots.txt
- Accessibilité : focus rings, aria-labels, alt, `prefers-reduced-motion`

**Reste à faire 🔜**

- Intégrer les **vidéos IA** dans les placeholders (voir tableau ci-dessus)
- Remplacer les **images Unsplash** par les photos réelles des produits
- Renseigner les **clés Stripe** (test puis production) et brancher le webhook
- Persistance des commandes en base + e-mails (TODO marqué dans `api/webhook`)
