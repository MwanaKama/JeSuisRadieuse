import Stripe from 'stripe';

import { json, serverError } from './_lib/http.js';
import { markOrderPaidFromProvider } from './_lib/orders.js';
import { query, usingDatabase } from './_lib/db.js';

export async function handler(event) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!secret || !stripeKey) {
      return json(200, { received: true, skipped: true });
    }

    const stripe = new Stripe(stripeKey);
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    if (!signature) {
      return json(400, { message: 'Signature Stripe manquante.' });
    }

    const stripeEvent = stripe.webhooks.constructEvent(event.body, signature, secret);

    if (usingDatabase()) {
      const eventId = stripeEvent.id;
      try {
        await query(
          `INSERT INTO webhook_events (provider, event_id, event_type, payload)
           VALUES ($1,$2,$3,$4::jsonb)`,
          ['stripe', eventId, stripeEvent.type, JSON.stringify(stripeEvent)]
        );
      } catch {
        return json(200, { received: true, duplicate: true });
      }
    }

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const providerReference = session.metadata?.providerReference || session.metadata?.providerreference || session.id;
      await markOrderPaidFromProvider(providerReference, 'stripe');
    }

    return json(200, { received: true });
  } catch (error) {
    return serverError(error, 'Webhook Stripe invalide.');
  }
}
