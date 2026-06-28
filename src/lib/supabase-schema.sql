-- STRAP — Schéma Supabase
-- À exécuter manuellement dans Supabase → SQL Editor.

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0
);

CREATE INDEX orders_email_idx ON orders(customer_email);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
