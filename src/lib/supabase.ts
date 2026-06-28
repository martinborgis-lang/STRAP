import { createClient } from '@supabase/supabase-js'

// Fallbacks « placeholder » pour que le build n'échoue pas si les variables
// d'environnement ne sont pas définies (createClient exige une URL valide).
// En production, renseignez les vraies valeurs dans Vercel.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

/** Indique si Supabase est réellement configuré (clés présentes). */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
)

/** Client public (clé anon) — utilisable côté navigateur. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/** Client admin (service role) — UNIQUEMENT côté serveur. */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

export interface Order {
  id: string
  created_at: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  stripe_payment_intent_id: string
  customer_email: string
  customer_name: string
  shipping_address: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    country: string
  }
  items: {
    product_id: string
    product_name: string
    color: string
    compatible_with: string
    quantity: number
    price: number
  }[]
  total: number
  shipping_cost: number
}
