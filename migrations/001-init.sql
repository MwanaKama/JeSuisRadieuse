-- ============================================================================
-- Je Suis Radieuse - Database Schema Initialization
-- ============================================================================
-- This migration file initializes the PostgreSQL database schema.
-- Run this manually before deploying to production:
--   psql -U username -d database_name -f migrations/001-init.sql
--
-- Or use the automatic bootstrap in netlify/functions/_lib/db.js
-- ============================================================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  benefits TEXT,
  usage_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(500) NOT NULL,
  city VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  shipping_method_code VARCHAR(50) NOT NULL,
  pickup_point_id VARCHAR(255),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_provider VARCHAR(50),
  payment_provider_reference VARCHAR(255),
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_slug VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_status_history table (audit trail)
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) DEFAULT 'system',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create webhook_events table (idempotency & audit)
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, event_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_id ON webhook_events(provider, event_id);

-- Add trigger to update order.updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS order_update_timestamp ON orders;
CREATE TRIGGER order_update_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_timestamp();

-- Seed initial products (optional - can be done via API instead)
INSERT INTO products (slug, name, price_cents, stock, benefits, usage_instructions)
VALUES
  (
    'tisane-grossesse',
    'Tisane bien-être grossesse',
    1590,
    24,
    'Camomille, gingembre, feuille de framboisier - Favorise le bien-être pendant la grossesse',
    'Infuser 1 sachet dans 250ml d''eau chaude pendant 5-7 minutes. Boire 1 à 2 tasses par jour.'
  ),
  (
    'tisane-cycles',
    'Tisane secret des femmes',
    1650,
    18,
    'Mélange harmonisant pour la régulation du cycle - Herbes traditionnelles',
    'Infuser 1 sachet dans 250ml d''eau chaude pendant 5-7 minutes. Boire régulièrement.'
  ),
  (
    'tisane-cycle-feminin',
    'Tisane cycle féminin',
    1590,
    20,
    'Sauge, achillée millefeuille, gattilier - Support naturel du cycle menstruel',
    'Infuser 1 sachet dans 250ml d''eau chaude. À adapter selon la phase du cycle.'
  ),
  (
    'tisane-menopause',
    'Tisane ménopause',
    1750,
    16,
    'Sauge, trèfle rouge, maca - Facilite la transition de la ménopause',
    'Infuser 1 sachet dans 250ml d''eau chaude pendant 5-7 minutes. Boire 1 à 2 tasses quotidiennement.'
  ),
  (
    'yoni-steam-postpartum',
    'Yoni steam post-partum',
    2490,
    12,
    'Mélange spécialisé pour la récupération post-natale - Roses, calendula, lavande',
    'Verser le contenu dans un bol d''eau chaude. Utiliser en séance de 15-20 minutes, 2-3 fois par semaine.'
  ),
  (
    'yoni-steam-cleansing',
    'Yoni steam nettoyant-hydratant',
    2390,
    14,
    'Calendula, lavande, rose - Nettoyage doux et hydratation naturelle',
    'Pour usage régulier ou occasionnel. Verser dans eau chaude et pratiquer seance de 15-20 minutes.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Display confirmation
\echo 'Database schema initialized successfully!'
\echo 'Products seeded:' (SELECT COUNT(*) FROM products)
