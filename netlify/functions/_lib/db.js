import { Pool } from 'pg';

import { storeProducts } from './catalog.js';

let pool;
let schemaReady = false;

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!hasDatabase()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
}

export async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) {
    return;
  }

  await db.query(`
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
      provider_reference TEXT,
      tracking_number TEXT,
      tracking_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_number TEXT NOT NULL REFERENCES orders(order_number) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      line_total_cents INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id SERIAL PRIMARY KEY,
      order_number TEXT NOT NULL REFERENCES orders(order_number) ON DELETE CASCADE,
      previous_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS webhook_events (
      id SERIAL PRIMARY KEY,
      provider TEXT NOT NULL,
      event_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(provider, event_id)
    );
  `);

  for (const product of storeProducts) {
    await db.query(
      `INSERT INTO products (id, slug, name, description, price_cents, image, category, stock, benefits, usage_instructions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)
       ON CONFLICT (id) DO UPDATE SET
         slug=EXCLUDED.slug,
         name=EXCLUDED.name,
         description=EXCLUDED.description,
         price_cents=EXCLUDED.price_cents,
         image=EXCLUDED.image,
         category=EXCLUDED.category,
         stock=GREATEST(products.stock, EXCLUDED.stock),
         benefits=EXCLUDED.benefits,
         usage_instructions=EXCLUDED.usage_instructions,
         updated_at=NOW()`,
      [
        product.id,
        product.slug,
        product.name,
        product.description,
        product.priceCents,
        product.image,
        product.category,
        product.stock,
        JSON.stringify(product.benefits),
        product.usageInstructions
      ]
    );
  }

  schemaReady = true;
}

export async function query(text, params = []) {
  const db = getPool();
  if (!db) {
    throw new Error('DATABASE_URL is required for this endpoint.');
  }

  await ensureSchema();
  return db.query(text, params);
}

export async function withTransaction(run) {
  const db = getPool();
  if (!db) {
    throw new Error('DATABASE_URL is required for this endpoint.');
  }

  await ensureSchema();
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export function usingDatabase() {
  return hasDatabase();
}
