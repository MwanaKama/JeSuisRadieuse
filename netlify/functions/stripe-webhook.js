import Stripe from 'stripe';

import { json, serverError } from './_lib/http.js';
import { markOrderPaidFromProvider } from './_lib/orders.js';
import { query, usingDatabase } from './_lib/db.js';

/**
 * Handlers Stripe par type d'evenement.
 * Tu peux en ajouter facilement pour tes futurs besoins.
 */
const stripeEventHandlers = {
  async 'checkout.session.completed'(stripeEvent) {
    const session = stripeEvent.data.object;
    const providerReference = session.metadata?.providerReference || session.metadata?.providerreference || session.id;
    await markOrderPaidFromProvider(providerReference, 'stripe');
  },

  async 'checkout.session.async_payment_succeeded'(stripeEvent) {
    const session = stripeEvent.data.object;
    const providerReference = session.metadata?.providerReference || session.metadata?.providerreference || session.id;
    await markOrderPaidFromProvider(providerReference, 'stripe');
  },
};

function getStripeSignature(headers = {}) {
  return headers['stripe-signature'] || headers['Stripe-Signature'] || '';
}

export async function handler(event) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!secret || !stripeKey) {
      return json(200, { received: true, skipped: true });
    }

    const stripe = new Stripe(stripeKey);
    const signature = getStripeSignature(event.headers);
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

    const handlerByType = stripeEventHandlers[stripeEvent.type];
    if (handlerByType) {
      await handlerByType(stripeEvent);
    }

    return json(200, { received: true, handled: Boolean(handlerByType), type: stripeEvent.type });
  } catch (error) {
    return serverError(error, 'Webhook Stripe invalide.');
  }
}
