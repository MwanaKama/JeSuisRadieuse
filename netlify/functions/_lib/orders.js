import Stripe from 'stripe';

import { shippingOptions, storeProducts, toFrontendProduct, toFrontendShipping } from './catalog.js';
import { query, usingDatabase, withTransaction } from './db.js';

const ORDER_STATUSES = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

// Compatibilite avec les IDs historiques utilises par la page Boutique.
const LEGACY_PRODUCT_ID_MAP = {
  'tisane-grossesse': 'pregnancy-herbal-tea',
  'tisane-allaitement': 'women-secret-herbal-tea',
  'tisane-postpartum': 'cycle-herbal-tea',
  'tisane-feminin': 'menopause-herbal-tea'
};

const transitions = {
  pending: ['paid', 'cancelled'],
  paid: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

function randomRef(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

export function createOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `JSR-${y}${m}${day}-${randomRef(6)}`;
}

export function getShippingOption(code) {
  return shippingOptions.find((option) => option.code === code) || null;
}

export function getProductsFallback() {
  return storeProducts.map(toFrontendProduct);
}

export function getShippingFallback() {
  return shippingOptions.map(toFrontendShipping);
}

export async function getProducts() {
  if (!usingDatabase()) {
    return getProductsFallback();
  }

  const result = await query(
    `SELECT id, slug, name, description, price_cents, image, category, stock, benefits, usage_instructions, is_available
     FROM products
     WHERE is_active = TRUE
     ORDER BY category, name`
  );

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number((row.price_cents / 100).toFixed(2)),
    image: row.image,
    category: row.category,
    stock: row.stock,
    available: row.is_available !== false,
    benefits: row.benefits,
    usageInstructions: row.usage_instructions
  }));
}

function getCatalogMap() {
  const map = new Map();
  storeProducts.forEach((product) => {
    map.set(product.id, product);
  });
  return map;
}

function parseCarrier(serviceCode) {
  if (serviceCode.startsWith('colissimo')) return 'colissimo';
  if (serviceCode.startsWith('mondialrelay')) return 'mondialrelay';
  if (serviceCode.startsWith('chronopost')) return 'chronopost';
  return 'colissimo';
}

function parseService(serviceCode) {
  if (serviceCode === 'colissimo_home') return 'home';
  if (serviceCode === 'mondialrelay_point') return 'relay';
  if (serviceCode === 'chronopost_express') return 'express';
  return 'standard';
}

export async function createOrder(payload, providerReference) {
  const shipping = getShippingOption(payload.shippingMethodCode);
  if (!shipping) {
    throw new Error('Mode de livraison invalide.');
  }

  if (shipping.requiresPickupPoint && !payload.pickupPointId) {
    throw new Error('Un point relais est requis pour ce mode de livraison.');
  }

  if (!payload.items?.length) {
    throw new Error('Le panier est vide.');
  }

  const catalog = getCatalogMap();
  const orderItems = [];
  let subtotalCents = 0;

  for (const inputItem of payload.items) {
    const normalizedProductId = LEGACY_PRODUCT_ID_MAP[inputItem.productId] || inputItem.productId;
    const product = catalog.get(normalizedProductId);
    if (!product) {
      throw new Error(`Produit introuvable: ${inputItem.productId}`);
    }

    const quantity = Number(inputItem.quantity || 0);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantite invalide.');
    }

    if (quantity > product.stock) {
      throw new Error(`Stock insuffisant pour ${product.name}.`);
    }

    const lineTotalCents = product.priceCents * quantity;
    subtotalCents += lineTotalCents;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      unitPriceCents: product.priceCents,
      quantity,
      lineTotalCents
    });
  }

  const shippingCostCents = shipping.priceCents;
  const totalCents = subtotalCents + shippingCostCents;
  const orderNumber = createOrderNumber();

  const customerName = `${payload.customer.firstName} ${payload.customer.lastName}`.trim();
  const shippingCarrier = parseCarrier(payload.shippingMethodCode);
  const shippingService = parseService(payload.shippingMethodCode);

  if (!usingDatabase()) {
    return {
      orderNumber,
      subtotal: subtotalCents / 100,
      shipping: shippingCostCents / 100,
      total: totalCents / 100,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: payload.paymentMethod,
      shippingMethodCode: payload.shippingMethodCode,
      items: orderItems.map((item) => ({
        productId: item.productId,
        name: item.productName,
        unitPriceCents: item.unitPriceCents,
        quantity: item.quantity
      })),
      providerReference
    };
  }

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        address, city, postal_code, country, notes,
        subtotal_cents, shipping_cost_cents, total_cents,
        payment_method, payment_status, order_status,
        shipping_method_code, shipping_carrier, shipping_service,
        shipping_pickup_point_id, shipping_pickup_point_label,
        shipping_pickup_point_address, shipping_pickup_point_postal_code,
        shipping_pickup_point_city, shipping_pickup_point_country,
        provider_reference
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,
        $13,'pending','pending',
        $14,$15,$16,
        $17,$18,
        $19,$20,$21,$22,
        $23
      )`,
      [
        orderNumber,
        customerName,
        payload.customer.email,
        payload.customer.phone,
        payload.customer.address,
        payload.customer.city,
        payload.customer.postalCode,
        payload.customer.country,
        payload.customer.notes || null,
        subtotalCents,
        shippingCostCents,
        totalCents,
        payload.paymentMethod,
        payload.shippingMethodCode,
        shippingCarrier,
        shippingService,
        payload.pickupPointId || null,
        payload.pickupPointLabel || null,
        payload.pickupPointAddress || null,
        payload.pickupPointPostalCode || null,
        payload.pickupPointCity || null,
        payload.pickupPointCountry || null,
        providerReference || null
      ]
    );

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_number, product_id, product_name, unit_price_cents, quantity, line_total_cents)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orderNumber, item.productId, item.productName, item.unitPriceCents, item.quantity, item.lineTotalCents]
      );

      await client.query(`UPDATE products SET stock = GREATEST(stock - $1, 0), updated_at = NOW() WHERE id = $2`, [item.quantity, item.productId]);
    }

    await client.query(
      `INSERT INTO order_status_history (order_number, previous_status, new_status, changed_by)
       VALUES ($1, NULL, 'pending', 'system:checkout')`,
      [orderNumber]
    );
  });

  return {
    orderNumber,
    subtotal: subtotalCents / 100,
    shipping: shippingCostCents / 100,
    total: totalCents / 100,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: payload.paymentMethod,
    shippingMethodCode: payload.shippingMethodCode,
    items: orderItems.map((item) => ({
      productId: item.productId,
      name: item.productName,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity
    })),
    providerReference
  };
}

export async function getOrderForTracking(orderNumber, email) {
  if (!usingDatabase()) {
    throw new Error('Le suivi de commande necessite une base de donnees configuree.');
  }

  const orderResult = await query(
    `SELECT order_number, customer_email, order_status, payment_status, total_cents, shipping_method_code,
            tracking_number, tracking_url, created_at, updated_at
     FROM orders
     WHERE order_number = $1 AND LOWER(customer_email) = LOWER($2)
     LIMIT 1`,
    [orderNumber, email]
  );

  if (orderResult.rowCount === 0) {
    return null;
  }

  const row = orderResult.rows[0];
  return {
    orderNumber: row.order_number,
    customerEmail: row.customer_email,
    status: row.order_status,
    paymentStatus: row.payment_status,
    total: Number((row.total_cents / 100).toFixed(2)),
    shippingMethodCode: row.shipping_method_code,
    trackingNumber: row.tracking_number || undefined,
    trackingUrl: row.tracking_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listOrders(filters = {}) {
  if (!usingDatabase()) {
    return [];
  }

  const clauses = [];
  const values = [];

  if (filters.status && ORDER_STATUSES.includes(filters.status)) {
    values.push(filters.status);
    clauses.push(`order_status = $${values.length}`);
  }

  if (filters.paymentStatus && PAYMENT_STATUSES.includes(filters.paymentStatus)) {
    values.push(filters.paymentStatus);
    clauses.push(`payment_status = $${values.length}`);
  }

  if (filters.shippingMethodCode) {
    values.push(filters.shippingMethodCode);
    clauses.push(`shipping_method_code = $${values.length}`);
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const result = await query(
    `SELECT order_number, customer_name, customer_email, total_cents, payment_method, payment_status,
            order_status, shipping_method_code, tracking_number, tracking_url, created_at
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT 200`,
    values
  );

  return result.rows.map((row) => ({
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    total: Number((row.total_cents / 100).toFixed(2)),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.order_status,
    shippingMethodCode: row.shipping_method_code,
    trackingNumber: row.tracking_number || undefined,
    trackingUrl: row.tracking_url || undefined,
    createdAt: row.created_at
  }));
}

export async function updateOrderStatus(orderNumber, nextStatus, changedBy = 'admin') {
  if (!usingDatabase()) {
    throw new Error('La mise a jour des statuts necessite une base de donnees configuree.');
  }

  if (!ORDER_STATUSES.includes(nextStatus)) {
    throw new Error('Statut cible invalide.');
  }

  const currentResult = await query(
    `SELECT order_number, customer_email, order_status, payment_status, total_cents, payment_method,
            customer_name, shipping_method_code, tracking_number, tracking_url, created_at
     FROM orders
     WHERE order_number = $1
     LIMIT 1`,
    [orderNumber]
  );

  if (currentResult.rowCount === 0) {
    throw new Error('Commande introuvable.');
  }

  const current = currentResult.rows[0];
  const allowedNextStatuses = transitions[current.order_status] || [];
  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new Error('Transition de statut invalide.');
  }

  await query(
    `UPDATE orders
     SET order_status = $1, updated_at = NOW()
     WHERE order_number = $2`,
    [nextStatus, orderNumber]
  );

  await query(
    `INSERT INTO order_status_history (order_number, previous_status, new_status, changed_by)
     VALUES ($1, $2, $3, $4)`,
    [orderNumber, current.order_status, nextStatus, changedBy]
  );

  return {
    orderNumber: current.order_number,
    customerName: current.customer_name,
    customerEmail: current.customer_email,
    total: Number((current.total_cents / 100).toFixed(2)),
    paymentMethod: current.payment_method,
    paymentStatus: current.payment_status,
    status: nextStatus,
    shippingMethodCode: current.shipping_method_code,
    trackingNumber: current.tracking_number || undefined,
    trackingUrl: current.tracking_url || undefined,
    createdAt: current.created_at
  };
}

export async function markOrderPaidFromProvider(providerReference, providerName) {
  if (!usingDatabase()) {
    return null;
  }

  const result = await query(
    `SELECT order_number, order_status, payment_status
     FROM orders
     WHERE provider_reference = $1
     LIMIT 1`,
    [providerReference]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];
  if (row.payment_status === 'paid') {
    return row.order_number;
  }

  await query(
    `UPDATE orders
     SET payment_status = 'paid', order_status = CASE WHEN order_status = 'pending' THEN 'paid' ELSE order_status END, updated_at = NOW()
     WHERE order_number = $1`,
    [row.order_number]
  );

  await query(
    `INSERT INTO order_status_history (order_number, previous_status, new_status, changed_by)
     VALUES ($1, $2, 'paid', $3)`,
    [row.order_number, row.order_status, `webhook:${providerName}`]
  );

  return row.order_number;
}

const CARRIER_TRACKING_URLS = {
  colissimo: (num) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(num)}`,
  chronopost: (num) => `https://www.chronopost.fr/fr/particulier/suivi?listeNumerosLT=${encodeURIComponent(num)}`,
  mondialrelay: (num) => `https://www.mondialrelay.fr/suivi-de-colis?num=${encodeURIComponent(num)}`
};

export function buildTrackingUrl(carrier, trackingNumber) {
  if (!trackingNumber) {
    return null;
  }
  const builder = CARRIER_TRACKING_URLS[carrier];
  return builder ? builder(trackingNumber) : null;
}

export async function getStockList() {
  if (!usingDatabase()) {
    return getProductsFallback();
  }

  const result = await query(
    `SELECT id, slug, name, price_cents, image, category, stock, is_active
     FROM products
     ORDER BY category, name`
  );

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number((row.price_cents / 100).toFixed(2)),
    image: row.image,
    category: row.category,
    stock: row.stock,
    isActive: row.is_active
  }));
}

export async function updateStock(productId, stock) {
  if (!usingDatabase()) {
    throw new Error('La gestion du stock necessite une base de donnees configuree.');
  }

  const parsed = Number(stock);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('Quantite de stock invalide.');
  }

  const result = await query(
    `UPDATE products
     SET stock = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, slug, name, price_cents, image, category, stock, is_active`,
    [parsed, productId]
  );

  if (result.rowCount === 0) {
    throw new Error('Produit introuvable.');
  }

  const row = result.rows[0];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number((row.price_cents / 100).toFixed(2)),
    image: row.image,
    category: row.category,
    stock: row.stock,
    isActive: row.is_active
  };
}

export async function setOrderTracking(orderNumber, trackingNumber, trackingUrl) {
  if (!usingDatabase()) {
    throw new Error('Le suivi necessite une base de donnees configuree.');
  }

  const result = await query(
    `UPDATE orders
     SET tracking_number = $1, tracking_url = $2, updated_at = NOW()
     WHERE order_number = $3
     RETURNING order_number`,
    [trackingNumber || null, trackingUrl || null, orderNumber]
  );

  if (result.rowCount === 0) {
    throw new Error('Commande introuvable.');
  }

  return result.rows[0].order_number;
}

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
