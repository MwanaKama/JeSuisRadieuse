# Checklist Déploiement Netlify - Je Suis Radieuse

Ce document guide pas à pas le déploiement de l'application e-commerce sur Netlify.

## ✅ Pré-requis Complétés

- [x] Backend Netlify Functions entièrement implémenté (13 fonctions)
- [x] Frontend React intégré et connecté aux APIs
- [x] Production build validé (`npm run build` succès)
- [x] Types TypeScript unifiés et vérifiés
- [x] `.env.example` créé avec toutes les variables

## 📋 Checklist Déploiement

### Phase 1: Préparation Locale (AVANT de pousser sur GitHub)

#### 1.1 Copier le fichier d'environnement
```bash
cp .env.example .env.local
```

#### 1.2 Remplir les variables d'environnement sensibles dans `.env.local`
```env
ADMIN_JWT_SECRET=<générer avec: openssl rand -base64 32>
ADMIN_EMAIL=<votre email admin>
ADMIN_PASSWORD=<mot de passe fort>
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox (ou live)
PUBLIC_SITE_URL=https://www.jesuisradieuse.fr
DATABASE_URL=postgresql://user:password@host/db (optionnel)
```

#### 1.3 Vérifier que `.env.local` est dans `.gitignore`
```bash
# Vérifier:
cat .gitignore | grep -E "\.env|\.env\.local"
```

#### 1.4 Tester localement (optionnel avec Netlify CLI)
```bash
# Installer Netlify CLI si absent
npm install -g netlify-cli

# Démarer les functions localement
netlify dev

# Visiter http://localhost:8888
```

#### 1.5 Valider la compilation Vite
```bash
npm run build
# Doit générer dist/ sans erreurs
```

---

### Phase 2: Configuration Netlify Dashboard

#### 2.1 Connecter le repo à Netlify
1. Aller à https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Sélectionner GitHub repo `JeSuisRadieuse`
4. Brancher à `main` ou votre branche de production

#### 2.2 Configurer Build Settings
| Paramètre | Valeur |
|-----------|--------|
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Functions directory** | `netlify/functions` |
| **Node version** | 18.x ou 20.x |

#### 2.3 Ajouter les variables d'environnement
**Site Settings** → **Build & Deploy** → **Environment**

Click "Edit variables" et ajouter:

```
ADMIN_JWT_SECRET = <votre_secret>
ADMIN_EMAIL = admin@jesuisradieuse.fr
ADMIN_PASSWORD = <mot_de_passe_fort>
STRIPE_SECRET_KEY = sk_live_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
PAYPAL_CLIENT_ID = xxxxx
PAYPAL_CLIENT_SECRET = xxxxx
PAYPAL_MODE = live
PUBLIC_SITE_URL = https://jesuisradieuse.netlify.app (temporaire) ou https://www.jesuisradieuse.fr
DATABASE_URL = <optionnel - PostgreSQL connection string>
```

⚠️ **IMPORTANT**: Ne pas commit ces variables. Les entrer directement dans UI Netlify.

#### 2.4 Redéployer après variables
```bash
# Trigger redeploy from Netlify UI:
Site settings → Deploys → "Trigger deploy" → "Deploy site"
```

---

### Phase 3: Configuration des Webhooks Payments

#### 3.1 Stripe Webhook Endpoint

1. Aller à https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://jesuisradieuse.netlify.app/.netlify/functions/stripe-webhook`
   (Remplacer par votre domaine réel)
4. **Events to send**:
   - ✓ `checkout.session.completed`
   - ✓ `checkout.session.expired`
   - ✓ `payment_intent.succeeded`
   - ✓ `charge.refunded`
5. Click "Add endpoint"
6. Copier le **Signing secret** (`whsec_...`)
7. Ajouter à Netlify env variables:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_xxxxx
   ```
8. Redéployer

#### 3.2 PayPal Webhook Listener

1. Aller à https://www.paypal.com/signin
2. Business Account → Settings → Notifications
3. Click "Update" next to Webhook settings
4. Add Webhook
5. **Webhook URL**: `https://jesuisradieuse.netlify.app/.netlify/functions/paypal-webhook`
6. **Events**: Select
   - ✓ `PAYMENT.CAPTURE.COMPLETED`
   - ✓ `PAYMENT.CAPTURE.REFUNDED`
7. Click "Create Webhook"
8. Test the webhook (PayPal provides test button)

---

### Phase 4: Configuration Base de Données (Optionnel)

#### 4.1 Créer une base de données PostgreSQL

**Option A: Heroku Postgres** (recommandé pour MVP)
```bash
# Créer app Heroku
heroku create jesuisradieuse-db

# Ajouter Postgres addon
heroku addons:create heroku-postgresql:hobby-dev -a jesuisradieuse-db

# Récupérer la connection string
heroku config -a jesuisradieuse-db
# Copier la valeur DATABASE_URL
```

**Option B: Self-hosted PostgreSQL**
```bash
# Votre provider cloud (AWS RDS, DigitalOcean, Azure, etc.)
# Créer base de données et obtenir connection string
postgresql://user:password@host:5432/jesuisradieuse_db
```

**Option C: Vercel Postgres** (si vous utiliserez Vercel plus tard)
- https://vercel.com/docs/storage/vercel-postgres/quickstart

#### 4.2 Exécuter la migration
```bash
# Via psql si accès direct:
psql -h <host> -U <user> -d <database> -f migrations/001-init.sql

# Ou insérer les commandes SQL directement via pgAdmin
```

#### 4.3 Ajouter DATABASE_URL à Netlify
```
DATABASE_URL = postgresql://user:password@host:5432/db
```

#### 4.4 Redéployer
Redéployer pour que les Netlify Functions connectent à la DB.

---

### Phase 5: Configuration DNS et Domaine

#### 5.1 Configurer votre domaine
**Netlify Dashboard** → **Domain settings**

**Option A: Netlify Nameservers** (recommandé - simple)
1. Click "Add or register domain"
2. Entrer `jesuisradieuse.fr`
3. Netlify vous donne 4 nameservers
4. Aller à votre registrar DNS (Namecheap, OVH, Gandi, etc.)
5. Chang les nameservers vers ceux de Netlify

**Option B: CNAME Records** (si vous gardez votre registrar)
1. Créer un CNAME:
   ```
   www.jesuisradieuse.fr → jesuisradieuse.netlify.app
   ```
2. Créer un ALIAS/ANAME pour le root:
   ```
   jesuisradieuse.fr → jesuisradieuse.netlify.app
   ```

#### 5.2 Activer HTTPS (Automatic via Netlify)
- Par défaut: Netlify fourni un certificat SSL Let's Encrypt
- Vérifier: **Domain settings** → Certificat devrait être "Active"

#### 5.3 Attendre propagation DNS (15 min à 24h)
```bash
# Vérifier la propagation:
nslookup jesuisradieuse.fr
dig jesuisradieuse.fr
```

---

### Phase 6: Tests Post-Déploiement

#### 6.1 Tester les endpoints API

```bash
# Récupérer les produits
curl https://jesuisradieuse.fr/.netlify/functions/products

# Calculer frais de shipping
curl -X POST https://jesuisradieuse.fr/.netlify/functions/shipping-options \
  -H "Content-Type: application/json" \
  -d '{
    "country": "FR",
    "postalCode": "75001",
    "items": [{"productId": 1, "quantity": 1}]
  }'

# Test login admin
curl -X POST https://jesuisradieuse.fr/.netlify/functions/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jesuisradieuse.fr",
    "password": "votre_password"
  }'
```

#### 6.2 Tester le flux checkout complet

1. Aller à https://jesuisradieuse.fr/boutique
2. Ajouter un produit au panier
3. Click "Finaliser la commande"
4. Remplir le formulaire checkout
5. Tester le paiement:
   - **Stripe Test**: Carte `4242 4242 4242 4242`, date 12/25, CVC 123
   - **PayPal**: Utiliser compte de sandbox PayPal
6. Vérifier que la commande est créée
7. Vérifier le webhook est reçu (Stripe/PayPal dashboard → Recent events)

#### 6.3 Tester le suivi de commande

1. Aller à https://jesuisradieuse.fr/suivi-commande
2. Entrer le numéro de commande (format: JSR-YYYYMMDD-XXXXX)
3. Entrer l'email utilisé
4. Vérifier que l'ordre s'affiche avec le statut

#### 6.4 Tester le dashboard admin

1. Aller à https://jesuisradieuse.fr/admin/commandes
2. Email: `admin@jesuisradieuse.fr`
3. Password: Votre mot de passe configuré
4. Vérifier que les commandes de test s'affichent
5. Tester le changement de statut (pending → paid → preparing)

---

### Phase 7: Monitoring & Maintenance

#### 7.1 Configurer Netlify Monitoring
- **Netlify Dashboard** → **Analytics**
- Voir les deployments, build logs, function calls

#### 7.2 Configurer les logs
```bash
# Voir les logs Netlify en temps réel:
netlify logs --functions --tail
```

#### 7.3 Sauvegardes base de données
Si vous utilisez PostgreSQL:
```bash
# Backup automatique avec pg_dump (planifier via cron)
pg_dump postgresql://user:pass@host/db > backup-$(date +%Y%m%d).sql
```

#### 7.4 Monitoring des webhooks
- Stripe Dashboard: Check webhook delivery in Settings
- PayPal Dashboard: Check IPN History
- Check Netlify Function logs for errors

---

## 🔒 Checklist Sécurité

**AVANT production:**

- [ ] STRIPE_WEBHOOK_SECRET est configuré (webhook verification activé)
- [ ] PAYPAL_CLIENT_SECRET n'est JAMAIS en frontend (env var backend only)
- [ ] ADMIN_PASSWORD est fort (min 12 caractères, random)
- [ ] DATABASE_URL est une connection string sécurisée avec mot de passe fort
- [ ] Tous les secrets sont dans Netlify env, JAMAIS dans code
- [ ] `.env` et `.env.local` sont dans `.gitignore`
- [ ] HTTPS/SSL est activé (Netlify automatic)
- [ ] Les webhooks ne sont accessibles que via HTTPS
- [ ] Rate limiting est configuré (optionnel mais recommandé)

---

## 📞 Dépannage Courant

### Le site ne se déploie pas

**Vérifier les logs Netlify:**
```bash
netlify deploy --prod --logs
```

**Issues courantes:**
- ❌ `npm run build` échoue → Vérifier package.json, dépendances
- ❌ Variables env manquantes → Ajouter dans Netlify dashboard → Redéployer
- ❌ Node version incompatible → Spécifier `NODE_VERSION=18` dans Netlify env

### Les paiements Stripe ne fonctionnent pas

- ❌ Vérifier que STRIPE_WEBHOOK_SECRET est présent
- ❌ Vérifier que l'endpoint webhook est correct dans Stripe dashboard
- ❌ Tester avec carte de test Stripe (4242...)
- ❌ Vérifier les logs du webhook dans Stripe dashboard

### Admin login échoue

- ❌ Vérifier les credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
- ❌ Vérifier ADMIN_JWT_SECRET est configuré
- ❌ Vérifier les logs Netlify Function: `/admin-login`

### Commandes ne sont pas sauvegardées

- ❌ DATABASE_URL n'est pas configuré → Les commandes sont en mémoire (perdues au redeploy)
- ❌ Configurer DATABASE_URL → Redéployer

---

## 📚 Ressources Utiles

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [PayPal Webhooks](https://developer.paypal.com/docs/api/webhooks/v1/)
- [PostgreSQL Hosting](https://www.heroku.com/postgres)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

---

## ✨ Après le déploiement

1. Configurer l'email transactionnel (optional - actuellement les templates sont placeholders)
2. Activer Sendcloud pour la vraie génération d'étiquettes de transport
3. Configurer Google Analytics / Hotjar pour le suivi utilisateur
4. Implémenter rate limiting pour les endpoints sensibles
5. Ajouter monitoring/alertes pour les erreurs webhooks
