-- ============================================================================
-- Je Suis Radieuse - Database Schema Initialization
-- ============================================================================
-- ATTENTION : ce fichier est fourni à titre de référence / d'initialisation
-- manuelle. En production (Netlify Functions), le schéma est créé et mis à jour
-- automatiquement par `netlify/functions/_lib/db.js` (ensureSchema) dès que la
-- variable d'environnement DATABASE_URL est définie.
--
-- Le schéma ci-dessous est aligné sur db.js. Si vous l'exécutez manuellement,
-- utilisez-le sur une base vide (les tables sont créées avec IF NOT EXISTS).
-- ============================================================================

-- Produits (catalogue + stock)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL,
  benefits JSONB NOT NULL,
  usage_instructions TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Commandes
CREATE TABLE IF NOT EXISTS orders (
  order_number TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  notes TEXT,
  subtotal_cents INTEGER NOT NULL,
  shipping_cost_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT NOT NULL,
  shipping_method_code TEXT NOT NULL,
  shipping_carrier TEXT NOT NULL,
  shipping_service TEXT NOT NULL,
  shipping_pickup_point_id TEXT,
  shipping_pickup_point_label TEXT,
  shipping_pickup_point_address TEXT,
  shipping_pickup_point_postal_code TEXT,
  shipping_pickup_point_city TEXT,
  shipping_pickup_point_country TEXT,
  provider_reference TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL REFERENCES orders(order_number) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  line_total_cents INTEGER NOT NULL
);

-- Historique des statuts (audit)
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL REFERENCES orders(order_number) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Événements webhook (idempotence)
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, event_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_number ON order_items(order_number);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_number ON order_status_history(order_number);

-- Note : les 6 produits initiaux sont insérés automatiquement par db.js
-- (ON CONFLICT (id) DO UPDATE) sans écraser le stock existant.
