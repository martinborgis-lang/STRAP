import type { Product } from '@/types'

export const products: Product[] = [
  {
    id: '1',
    slug: 'ocho-negro',
    name: 'Ocho Negro',
    description:
      'Bracelet biocéramique noir, conçu pour la Royal Pop Ocho Negro. Maillons noirs mat avec fermoir acier inoxydable.',
    price: 8900,
    material: 'ceramic',
    color: 'black',
    braceletColor: '#1C1C1C',
    caseColor: '#FFFFFF',
    accentColor: '#1C1C1C',
    images: ['/images/products/ocho-negro.png'],
    compatibleWith: 'Royal Pop Ocho Negro',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    slug: 'otto-rosso',
    name: 'Otto Rosso',
    description:
      'Bracelet biocéramique rose pâle, conçu pour la Royal Pop Otto Rosso. Maillons rose poudré avec fermoir acier.',
    price: 8900,
    material: 'ceramic',
    color: 'pink',
    braceletColor: '#F4B8C1',
    caseColor: '#E0144C',
    accentColor: '#E0144C',
    images: ['/images/products/otto-rosso.png'],
    compatibleWith: 'Royal Pop Otto Rosso',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    slug: 'huit-blanc',
    name: 'Huit Blanc',
    description:
      'Bracelet biocéramique blanc, conçu pour la Royal Pop Huit Blanc. Maillons blancs immaculés avec vis multicolores.',
    price: 8900,
    material: 'ceramic',
    color: 'white',
    braceletColor: '#FFFFFF',
    caseColor: '#FFFFFF',
    accentColor: '#FF6B6B',
    images: ['/images/products/huit-blanc.png'],
    compatibleWith: 'Royal Pop Huit Blanc',
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    slug: 'green-eight',
    name: 'Green Eight',
    description:
      'Bracelet biocéramique vert, conçu pour la Royal Pop Green Eight. Monochrome intégral vert électrique.',
    price: 8900,
    material: 'ceramic',
    color: 'green',
    braceletColor: '#00A550',
    caseColor: '#00A550',
    accentColor: '#00A550',
    images: ['/images/products/green-eight.png'],
    compatibleWith: 'Royal Pop Green Eight',
    inStock: true,
    featured: false,
  },
  {
    id: '5',
    slug: 'blaue-acht',
    name: 'Blaue Acht',
    description:
      'Bracelet biocéramique vert menthe, conçu pour la Royal Pop Blaue Acht. Contraste délicat menthe et bleu ciel.',
    price: 8900,
    material: 'ceramic',
    color: 'mint',
    braceletColor: '#C8E6C9',
    caseColor: '#81D4FA',
    accentColor: '#81D4FA',
    images: ['/images/products/blaue-acht.png'],
    compatibleWith: 'Royal Pop Blaue Acht',
    inStock: true,
    featured: false,
  },
  {
    id: '6',
    slug: 'lan-ba',
    name: 'Lan Ba',
    description:
      'Bracelet biocéramique bleu marine, conçu pour la Royal Pop Lan Ba. Bleu profond avec nuances bleu ciel.',
    price: 8900,
    material: 'ceramic',
    color: 'navy',
    braceletColor: '#1A237E',
    caseColor: '#42A5F5',
    accentColor: '#42A5F5',
    images: ['/images/products/lan-ba.png'],
    compatibleWith: 'Royal Pop Lan Ba',
    inStock: true,
    featured: false,
  },
  {
    id: '7',
    slug: 'orenji-hachi',
    name: 'Orenji Hachi',
    description:
      'Bracelet biocéramique bleu marine, conçu pour la Royal Pop Orenji Hachi. Bleu intense avec accents orange vif.',
    price: 8900,
    material: 'ceramic',
    color: 'blue-orange',
    braceletColor: '#0D47A1',
    caseColor: '#0D47A1',
    accentColor: '#FF6D00',
    images: ['/images/products/orenji-hachi.png'],
    compatibleWith: 'Royal Pop Orenji Hachi',
    inStock: true,
    featured: true,
  },
  {
    id: '8',
    slug: 'otg-roz',
    name: 'Otg Roz',
    description:
      'Bracelet biocéramique rose pâle, conçu pour la Royal Pop Otg Roz. Trio audacieux rose, jaune et turquoise.',
    price: 8900,
    material: 'ceramic',
    color: 'pink-yellow',
    braceletColor: '#F8BBD9',
    caseColor: '#FFD600',
    accentColor: '#00BCD4',
    images: ['/images/products/otg-roz.png'],
    compatibleWith: 'Royal Pop Otg Roz',
    inStock: true,
    featured: true,
  },
]

export function getAllProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products.filter((p) => p.id !== product.id).slice(0, limit)
}
