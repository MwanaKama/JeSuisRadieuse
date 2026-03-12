# Je Suis Radieuse - Backend Architecture

Documentation complète de l'architecture backend Netlify Functions.

## 📦 Structure du Projet

```
netlify/
├── functions/
│   ├── _lib/                          # Modules partagés
│   │   ├── catalog.js                 # 📦 Catalogue produits/shipping
│   │   ├── db.js                      # 🗄️  Connexion PostgreSQL + schema
│   │   ├── http.js                    # 📡 Helpers HTTP (responses, parsing)
│   │   ├── auth.js                    # 🔐 JWT admin authentication
│   │   └── orders.js                  # 🛒 Core business logic (orders FSM)
│   │
│   ├── products.js                    # 📝 GET /products - Catalogue
│   ├── shipping-options.js            # 📦 POST /shipping-options - Calcul frais
│   ├── pickup-points.js               # 📍 GET /pickup-points - Mondial Relay points
│   │
│   ├── create-stripe-session.js       # 💳 POST /create-stripe-session
│   ├── create-paypal-order.js         # 💳 POST /create-paypal-order
│   ├── track-order.js                 # 🔍 GET /track-order - Suivi client
│   │
│   ├── admin-login.js                 # 🔑 POST /admin-login - JWT emission
│   ├── admin-orders.js                # 📋 GET /admin-orders - Liste commandes
│   ├── admin-order-status.js          # ✏️  PATCH /admin-order-status - Changement statut
│   │
│   ├── stripe-webhook.js              # 🔔 POST /stripe-webhook
│   ├── paypal-webhook.js              # 🔔 POST /paypal-webhook
│   └── shipping-webhook.js            # 🔔 POST /shipping-webhook
│
└── functions.json                     # Configuration Netlify Functions (optionnel)

migrations/
├── 001-init.sql                       # 🗄️  DDL PostgreSQL (produits, commandes, webhooks)

src/
├── services/
│   └── storeApi.ts                    # 🔗 API client React (tous les endpoints)
├── types/
│   ├── shop.ts                        # 📋 Type definitions e-commerce
│   └── Order.ts                       # 📋 Types commande (legacy)
├── hooks/
│   └── useCart.ts                     # 🛒 Cart state management
└── components/
    ├── OrderForm.tsx                  # 🛍️  Checkout modal 3-steps
    ├── AdminOrderDashboard.tsx        # 📊 Admin dashboard (login + CRUD)
    └── ...

.env.example                           # 📝 Template variables environnement
DEPLOYMENT_CHECKLIST.md                # 📋 Guide déploiement Netlify
BACKEND_ARCHITECTURE.md                # 📖 Ce fichier
```

---

## 🔌 API Endpoints

Tous les endpoints sont accessibles via `/.netlify/functions/<endpoint>`.

### Catalogue (Public)

#### `GET /products`
Retourne la liste complète des produits.

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "slug": "tisane-grossesse",
      "name": "Tisane bien-être grossesse",
      "priceCents": 1590,
      "stock": 24,
      "benefits": "Camomille, gingembre...",
      "usageInstructions": "Infuser 1 sachet..."
    }
  ]
}
```

---

#### `POST /shipping-options`
Calcule les options et frais de port selon le pays/code postal.

**Request:**
```json
{
  "country": "FR",
  "postalCode": "75001",
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 3, "quantity": 1}
  ]
}
```

**Response:**
```json
{
  "options": [
    {
      "code": "colissimo_home",
      "label": "Colissimo - Domicile",
      "priceCents": 690,
      "eta": "2-4 jours",
      "requiresPickupPoint": false
    },
    {
      "code": "mondialrelay_point",
      "label": "Point Mondial Relay",
      "priceCents": 490,
      "eta": "3-5 jours",
      "requiresPickupPoint": true
    }
  ]
}
```

---

#### `GET /pickup-points`
Retourne les points de retrait selon le code postal.

**Query params:**
- `carrier`: `mondialrelay` ou `chronopost`
- `postalCode`: Code postal client
- `country`: Code pays (défaut: FR)

**Response:**
```json
{
  "pickupPoints": [
    {
      "id": "MR123456",
      "name": "Tabac Lundi Journal",
      "address": "15 Rue de Rivoli",
      "city": "Paris",
      "postalCode": "75004",
      "openingHours": "09:00-19:00"
    }
  ]
}
```

---

### Checkout (Public → Private)

#### `POST /create-stripe-session`
Crée une session Stripe Checkout.

**Auth:** None (mais le montant est re-validé server-side)

**Request:**
```json
{
  "items": [
    {
      "productId": 1,
      "productSlug": "tisane-grossesse",
      "productName": "Tisane bien-être grossesse",
      "quantity": 1,
      "priceCents": 1590
    }
  ],
  "shippingMethodCode": "colissimo_home",
  "shippingCostCents": 690,
  "customer": {
    "firstName": "Marie",
    "lastName": "Dupont",
    "email": "marie@example.com"
  }
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

Client redirect to `url` for Stripe checkout.

---

#### `POST /create-paypal-order`
Crée une commande PayPal.

**Auth:** None

**Request:** Même structure que Stripe

**Response:**
```json
{
  "orderId": "3KX...",
  "approvalUrl": "https://sandbox.paypal.com/checkoutnow?token=..."
}
```

---

### Suivi Client (Public)

#### `GET /track-order`
Récupère les détails d'une commande pour le client.

**Query params:**
- `orderNumber`: `JSR-20250312-ABC123`
- `email`: Email associé à la commande

**Response:**
```json
{
  "orderNumber": "JSR-20250312-ABC123",
  "firstName": "Marie",
  "city": "Paris",
  "status": "shipped",
  "paymentStatus": "paid",
  "trackingNumber": "3S00012345678",
  "trackingUrl": "https://track.colissimo.io/...",
  "items": [
    {
      "productName": "Tisane bien-être grossesse",
      "quantity": 1,
      "unitPriceCents": 1590
    }
  ],
  "totalCents": 2280,
  "createdAt": "2025-03-12T10:30:00Z"
}
```

---

### Admin API (Private - JWT Required)

#### `POST /admin-login`
Authentifie un administrateur et émet un JWT.

**Request:**
```json
{
  "email": "admin@jesuisradieuse.fr",
  "password": "votre_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

Token valide 24h. À stocker dans `localStorage` avec clé `jsr-admin-token`.

---

#### `GET /admin-orders`
Liste les commandes avec filtrage.

**Auth:** Bearer `<token>` (from `/admin-login`)

**Query params:**
- `status`: `pending`, `paid`, `preparing`, `shipped`, `delivered`, `cancelled`
- `paymentStatus`: `pending`, `paid`, `failed`, `refunded`
- `carrier`: `colissimo`, `mondialrelay`, `chronopost`
- `search`: Texte libre (recherche nom/email)

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "orderNumber": "JSR-20250312-ABC123",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "status": "paid",
      "paymentStatus": "paid",
      "paymentProvider": "stripe",
      "totalCents": 2280,
      "trackingNumber": null,
      "createdAt": "2025-03-12T10:30:00Z"
    }
  ]
}
```

---

#### `PATCH /admin-order-status`
Modifie le statut d'une commande (avec machine à états).

**Auth:** Bearer token

**Request:**
```json
{
  "orderNumber": "JSR-20250312-ABC123",
  "newStatus": "preparing",
  "reason": "Produit emballé et prêt à expedier"
}
```

**Transitions valides:**
- `pending → [paid, cancelled]`
- `paid → [preparing, cancelled]`
- `preparing → [shipped, cancelled]`
- `shipped → [delivered]`
- `delivered → []` (terminal)
- `cancelled → []` (terminal)

**Response:**
```json
{
  "success": true,
  "orderNumber": "JSR-20250312-ABC123",
  "oldStatus": "paid",
  "newStatus": "preparing"
}
```

---

### Webhooks (Private - Signature Verified)

#### `POST /stripe-webhook`
Webhook reçu de Stripe pour les événements de paiement.

**Headers:**
- `stripe-signature`: Signature à vérifier

**Events handled:**
- `checkout.session.completed` → `markOrderPaidFromProvider()`

---

#### `POST /paypal-webhook`
Webhook reçu de PayPal pour les événements de paiement.

**Headers:**
- `paypal-transmission-id`: ID transmission
- `paypal-transmission-time`: Timestamp
- `paypal-transmission-sig`: Signature (verification en dev mode)
- `paypal-cert-url`: URL du certificat PayPal

**Events handled:**
- `PAYMENT.CAPTURE.COMPLETED` → `markOrderPaidFromProvider()`

---

#### `POST /shipping-webhook`
Webhook reçu des carriers pour les mises à jour de suivi.

**Body:**
```json
{
  "trackingNumber": "3S00012345678",
  "status": "in_transit | delivered | returned",
  "carrier": "colissimo | mondialrelay | chronopost"
}
```

---

## 🗄️  Data Models

### Product
```javascript
{
  id: 1,
  slug: "tisane-grossesse",              // Unique identifier
  name: "Tisane bien-être grossesse",
  priceCents: 1590,                      // Euros × 100 (précision)
  stock: 24,                             // Quantité disponible
  benefits: "Camomille, gingembre...",  // Description courte
  usageInstructions: "Infuser 1 sachet..." // Mode d'emploi
}
```

### Order
```javascript
{
  id: 1,
  orderNumber: "JSR-20250312-ABC123",    // Format: JSR-YYYYMMDD-RANDOM
  firstName: "Marie",
  lastName: "Dupont",
  email: "marie@example.com",
  phone: "+33612345678",
  address: "15 Rue de Rivoli",
  city: "Paris",
  postalCode: "75004",
  country: "FR",
  shippingMethodCode: "colissimo_home",
  pickupPointId: null,                   // Pour Mondial Relay
  totalCents: 2280,                      // Total TTC
  orderStatus: "shipped",                // FSM state
  paymentStatus: "paid",                 // pending|paid|failed|refunded
  paymentProvider: "stripe",             // stripe|paypal
  paymentProviderReference: "cs_test_...",
  trackingNumber: "3S00012345678",
  notes: null,
  createdAt: "2025-03-12T10:30:00Z",
  updatedAt: "2025-03-12T12:00:00Z"
}
```

### OrderItem
```javascript
{
  id: 1,
  orderId: 1,
  productId: 1,
  productSlug: "tisane-grossesse",
  productName: "Tisane bien-être grossesse",
  quantity: 1,
  unitPriceCents: 1590,                  // Prix à la vente
  subtotalCents: 1590                    // quantity × unitPrice
}
```

### OrderStatusHistory (Audit Trail)
```javascript
{
  id: 1,
  orderId: 1,
  oldStatus: "paid",
  newStatus: "preparing",
  changedBy: "admin@jesuisradieuse.fr",  // ou "stripe" pour webhooks
  reason: "Produit emballé",
  createdAt: "2025-03-12T12:00:00Z"
}
```

---

## 🔐 Authentication & Authorization

### JWT Admin Token

**Structure:**
```javascript
{
  aud: "admin.jesuisradieuse.fr",
  iss: "netlify-functions",
  sub: "admin@jesuisradieuse.fr",
  exp: 1234567890,                       // Unix timestamp (24h)
  iat: 1234481490
}
```

**Endpoints protégés:**
- `GET /admin-orders` → Bearer token requis
- `PATCH /admin-order-status` → Bearer token requis
- `POST /admin-login` → Pas de token (login endpoint)

**Stockage client-side:**
- Clé localStorage: `jsr-admin-token`
- À envoyer dans header: `Authorization: Bearer <token>`

---

## 💾 Database Schema

### PostgreSQL Tables

#### `products`
```sql
CREATE TABLE products (
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
```

#### `orders`
```sql
CREATE TABLE orders (
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
-- Indexes for performance
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(order_status);
```

#### `order_items`
```sql
CREATE TABLE order_items (
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
```

#### `order_status_history` (Audit Trail)
```sql
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) DEFAULT 'system',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `webhook_events` (Idempotency)
```sql
CREATE TABLE webhook_events (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,        -- 'stripe', 'paypal', 'sendcloud'
  event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, event_id)
);
```

---

## 🚀 Order Lifecycle (State Machine)

```
                pending
                  |
      ┌───────────┼───────────┐
      │           │           │
      ↓           ↓           ↓
    paid    cancelled (at any point)
      |
      |
      ↓
  preparing
      |
      ├─ cancelled ─→ CANCELLED
      |
      ↓
   shipped
      |
      ↓
  delivered
      |
      ↓
  [TERMINAL]
```

**Transitions valides:**
- `pending → [paid, cancelled]` (Admin ou Webhook Stripe/PayPal)
- `paid → [preparing, cancelled]` (Admin)
- `preparing → [shipped, cancelled]` (Admin après Sendcloud label)
- `shipped → [delivered]` (Webhook Sendcloud/Colissimo)
- `delivered → []` (FINAL)
- `cancelled → []` (FINAL)

---

## 📝 Implementation Notes

### Graceful Degradation
- Si `DATABASE_URL` n'est pas configuré → Système fonctionne en RAM (demo/dev mode)
- Si `STRIPE_WEBHOOK_SECRET` absent → Webhooks skippés
- Si `PAYPAL_CLIENT_ID/SECRET` absent → PayPal fonctionne sans vérification signature (dev)

### Idempotency
- Les webhooks sont stockés avec `UNIQUE(provider, event_id)`
- Si même webhook reçu 2x → Retour 200 + `duplicate: true` sans traiter
- Garantit qu'une commande n'est jamais marquée "paid" 2x

### Stock Management
- Stock décrémenté **atomiquement** au moment de la création de commande
- Transactions PostgreSQL garantissent cohérence
- En RAM mode: Décrémentation en mémoire (reinit au redeploy)

### Security
- Admin credentials: Env variables + hardcoded comparison (MVP)
- Production: Migrer vers Cognito/Auth0/Supabase
- Webhooks: Stripe signature verified; PayPal en dev mode (à implémenter)
- CORS: Netlify Functions inheritance (same-origin by default)

---

## 🔧 Development Tips

### Local Testing
```bash
# With Netlify CLI
netlify dev

# Testing with curl
curl http://localhost:8888/.netlify/functions/products

# Testing POST
curl -X POST http://localhost:8888/.netlify/functions/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@...","password":"..."}'
```

### Adding a New Function
1. Créer `netlify/functions/new-endpoint.js`
2. Exporter `async function handler(event)` qui retourne `{statusCode, headers, body}`
3. Utiliser les helpers de `_lib/`:
   ```javascript
   import { json, badRequest } from './_lib/http.js';
   import { query } from './_lib/db.js';
   
   export async function handler(event) {
     const data = parseBody(event);
     // ...
     return json(200, { result: data });
   }
   ```

### Debugging
- Vérifier Netlify Function logs: `netlify logs --functions --tail`
- Vérifier variables env: `netlify env:list`
- Test en mode local d'abord: `netlify dev`

---

## 📚 Next Steps

1. **Sendcloud Integration** - Remplacer mock par vraie API
2. **Email Notifications** - Impléémenter SMTP (SendGrid, AWS SES)
3. **Rate Limiting** - Ajouter middleware rate limit sur admin + checkout
4. **Advanced Logging** - Structured logging (JSON to CloudWatch/Datadog)
5. **Admin Credential Management** - Migrer vers service d'auth (Cognito, Auth0)

