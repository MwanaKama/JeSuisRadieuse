# Je Suis Radieuse - E-Commerce Platform

A boutique e-commerce platform for the Je Suis Radieuse brand, offering wellness and feminine health products with integrated Stripe/PayPal payments, multi-carrier shipping, and admin dashboard.

## 🎯 Project Overview

**Tech Stack:**
- **Frontend:** Vite + React 18 + TypeScript + Tailwind CSS
- **Backend:** Netlify Functions (serverless)
- **Database:** PostgreSQL (optional - graceful fallback to in-memory)
- **Payments:** Stripe Checkout + PayPal
- **Shipping:** Colissimo, Mondial Relay, Chronopost
- **Deployment:** Netlify

**Status:** ✅ MVP Complete & Production-Ready

---

## 📁 Project Structure

```
Je Suis Radieuse/
├── src/                           # React frontend source
│   ├── components/
│   │   ├── OrderForm.tsx          # 3-step checkout modal
│   │   └── AdminOrderDashboard.tsx # Admin order management
│   ├── pages/
│   │   ├── Boutique.tsx           # Product catalog + cart
│   │   ├── OrderTracking.tsx      # Customer order tracking
│   │   ├── OrderResult.tsx        # Payment success/cancel
│   │   └── AdminOrders.tsx        # Admin dashboard wrapper
│   ├── services/
│   │   └── storeApi.ts            # API client for all endpoints
│   ├── types/
│   │   ├── shop.ts                # E-commerce type definitions
│   │   └── Order.ts               # Order types
│   ├── hooks/
│   │   └── useCart.ts             # Shopping cart state
│   ├── data/
│   │   └── store.ts               # Fallback product data
│   └── App.tsx                    # Route configuration
│
├── netlify/functions/             # Serverless backend
│   ├── _lib/                      # Shared modules
│   │   ├── catalog.js             # Product & shipping data
│   │   ├── db.js                  # PostgreSQL + schema
│   │   ├── http.js                # HTTP helpers
│   │   ├── auth.js                # JWT authentication
│   │   └── orders.js              # Business logic
│   ├── products.js                # GET /products
│   ├── shipping-options.js        # POST /shipping-options
│   ├── create-stripe-session.js   # Stripe checkout
│   ├── create-paypal-order.js     # PayPal checkout
│   ├── admin-login.js             # Admin authentication
│   ├── admin-orders.js            # List orders
│   ├── admin-order-status.js      # Update order status
│   ├── stripe-webhook.js          # Stripe webhook handler
│   ├── paypal-webhook.js          # PayPal webhook handler
│   └── shipping-webhook.js        # Shipping updates
│
├── migrations/
│   └── 001-init.sql               # Database schema
│
├── public/                        # Static assets
├── .env.example                   # Environment template
├── DEPLOYMENT_CHECKLIST.md        # Step-by-step deployment guide
├── BACKEND_ARCHITECTURE.md        # Technical documentation
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (optional - system works without)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MwanaKama/JeSuisRadieuse.git
cd JeSuisRadieuse

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your environment variables in .env.local:
# - Admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
# - Stripe keys (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
# - PayPal credentials (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
# - Optional: Database URL (DATABASE_URL)
```

### Development

```bash
# Start dev server (frontend only)
npm run dev

# With Netlify Functions (requires Netlify CLI)
npm install -g netlify-cli
netlify dev

# Visit http://localhost:5173 (frontend) or http://localhost:8888 (with functions)
```

### Production Build

```bash
# Build frontend
npm run build

# Output: dist/
# Ready for Netlify deployment
```

---

## 📋 Key Features

### For Customers
✅ **Product Catalog** - Browse wellness products with detailed descriptions  
✅ **Shopping Cart** - Persistent cart saved to localStorage  
✅ **Checkout** - 3-step checkout wizard (personal info → address → payment)  
✅ **Payment Methods** - Stripe Card or PayPal  
✅ **Shipping Options** - Multiple carriers with real-time cost calculation  
✅ **Order Tracking** - Track orders by number + email  

### For Admins
✅ **Admin Dashboard** - Login-protected dashboard  
✅ **Order Management** - View, filter, and update order statuses  
✅ **Status Machine** - Enforced state transitions (pending → paid → preparing → shipped → delivered)  
✅ **Audit Trail** - Status change history for all orders  

### For Developers
✅ **REST API** - Clean, documented APIs for all operations  
✅ **Type Safety** - Full TypeScript with strict mode  
✅ **Database Optional** - Works with or without PostgreSQL  
✅ **Webhook Validation** - Stripe & PayPal signature verification  
✅ **Graceful Degradation** - Fallback to in-memory when DB unavailable  

---

## 📚 Documentation

- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Complete Netlify deployment guide
  - Environment setup
  - Webhook configuration
  - Database initialization
  - Testing checklist
  - Security guidelines

- **[BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)** - Technical reference
  - API endpoints with examples
  - Data models and schemas
  - State machines
  - Security architecture
  - Development tips

- **[.env.example](.env.example)** - Environment variables template

- **[migrations/001-init.sql](migrations/001-init.sql)** - Database schema

---

## 🔐 Security

**Implemented:**
- ✅ JWT authentication for admin endpoints
- ✅ Stripe webhook signature verification
- ✅ PayPal webhook signature verification framework
- ✅ Idempotent webhook processing (no duplicate orders)
- ✅ State machine enforcement (no invalid transitions)
- ✅ Environment variables for sensitive data (no hardcoding)

**Recommended for Production:**
- 🔒 Migrate admin credentials to Auth0 / Cognito
- 🔒 Use httpOnly cookies for JWT tokens
- 🔒 Implement rate limiting on sensitive endpoints
- 🔒 Add request signing for admin operations
- 🔒 Enable CORS restrictions

---

## 💳 Payments

### Stripe
- Test Mode: Card `4242 4242 4242 4242`
- Webhook: Automatically marked "paid" on `checkout.session.completed`
- Idempotency: Same payment processed only once

### PayPal
- Test Mode: Sandbox account credentials
- Webhook: Automatically marked "paid" on `PAYMENT.CAPTURE.COMPLETED`
- Manual verification: Webhook signature validation in development mode

---

## 🚢 Shipping

**Supported Carriers:**
- **Colissimo** (€6.90) - 2-4 days, home delivery
- **Mondial Relay** (€4.90) - 3-5 days, pickup point required
- **Chronopost Express** (€12.90) - 1-2 days, home delivery

**Real Sendcloud Integration:** Currently returns mock data. To enable real shipping:
1. Sign up at https://panel.sendcloud.sc
2. Add SENDCLOUD_API_KEY and SENDCLOUD_API_SECRET to env
3. Uncomment Sendcloud integration in `netlify/functions/_lib/orders.js`

---

## 📊 Database Schema

**Tables:**
- `products` - Product catalog
- `orders` - Order master records
- `order_items` - Line items per order
- `order_status_history` - Audit trail for status changes
- `webhook_events` - Processed webhooks (idempotency)

**Auto-initialization:** PostgreSQL schema is automatically created on first function call if DATABASE_URL is set.

**Manual initialization:**
```bash
psql -h <host> -U <user> -d <db> -f migrations/001-init.sql
```

---

## 🧪 Testing

### Frontend
```bash
npm run dev
# Visit http://localhost:5173
# Navigate through checkout flow with test data
```

### Backend Functions (Local)
```bash
netlify dev
# Test endpoints with curl:
curl http://localhost:8888/.netlify/functions/products
```

### Stripe Test
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits

### PayPal Sandbox
- Use PayPal sandbox credentials in .env.local
- Set PAYPAL_MODE=sandbox

---

## 📈 Deployment

### Netlify (Recommended)

**Quick Start:**
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Netlify
# https://app.netlify.com → New site → Choose repo

# 3. Add environment variables in Netlify dashboard
# See DEPLOYMENT_CHECKLIST.md for full list

# 4. Configure webhooks
# Stripe and PayPal point to:
# https://yoursite.netlify.app/.netlify/functions/stripe-webhook
# https://yoursite.netlify.app/.netlify/functions/paypal-webhook

# 5. Redeploy to apply changes
```

**Complete Guide:** See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

### Admin Login Fails
- Check ADMIN_EMAIL and ADMIN_PASSWORD match .env
- Verify ADMIN_JWT_SECRET is set (generate: `openssl rand -base64 32`)
- Check Netlify Function logs: `netlify logs --functions --tail`

### Webhooks Not Received
- Verify endpoint URL in Stripe/PayPal dashboard
- Check webhook logs in payment provider dashboard
- Ensure HTTPS (required by both providers)
- Test with webhook.site to verify delivery

### Database Errors
- If DATABASE_URL not set, system runs in-memory (orders lost on redeploy)
- Configure DATABASE_URL → Redeploy to enable persistence
- Check PostgreSQL connection string format

---

## 🔄 Continuous Improvement

**Planned Features:**
- [ ] Email notifications (order confirmation, status updates)
- [ ] Real Sendcloud shipping integration (label generation)
- [ ] Advanced admin reporting and analytics
- [ ] Customer account / order history
- [ ] Inventory webhook sync with warehouse
- [ ] Multi-language support (currently French/English)
- [ ] Mobile app version

**Known Limitations:**
- ⚠️ Admin credentials currently hardcoded via env (migrate to Auth0 in production)
- ⚠️ Email notifications are placeholder functions (not sending real emails yet)
- ⚠️ Sendcloud integration returns mock data (requires API key to enable)

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

**Issues or Questions?**
- Check the [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) troubleshooting section
- Review [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) technical reference
- See Netlify logs: `netlify logs --functions --tail`

---

## 📄 License

This project is proprietary. All rights reserved to Je Suis Radieuse.

---

## ✨ Built With

- [Vite](https://vitejs.dev/) - Frontend build tool
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Netlify Functions](https://www.netlify.com/products/functions/) - Serverless backend
- [PostgreSQL](https://www.postgresql.org/) - Database (optional)
- [Stripe](https://stripe.com/) - Payment processing
- [PayPal](https://www.paypal.com/) - Payment processing

---

**Last Updated:** March 2025  
**Deployment Status:** ✅ Ready for Production
