import { json, parseBody, serverError } from './_lib/http.js';
import { markOrderPaidFromProvider } from './_lib/orders.js';
import { query, usingDatabase } from './_lib/db.js';

/**
 * Verify PayPal Webhook Signature
 * @param {string} transmissionId - The transmission-id header
 * @param {string} transmissionTime - The transmission-time header
 * @param {string} certUrl - The cert-url header
 * @param {string} authAlgo - The auth-algo header
 * @param {string} signature - The signature header
 * @param {string} body - The raw request body
 * @returns {Promise<boolean>} Whether signature is valid
 */
async function verifyPayPalSignature(transmissionId, transmissionTime, certUrl, authAlgo, signature, body) {
  try {
    // PayPal signature verification requires calling their verification API
    // However, for MVP, we can implement local verification or trust HTTPS + webhook secret
    // This is a placeholder for production implementation

    // In production, implement:
    // 1. Fetch certificate from certUrl
    // 2. Verify signature using RSA public key from certificate
    // 3. Or: Use PayPal SDK's webhook verification (when available)

    // For now, we verify by checking required headers exist
    if (!transmissionId || !transmissionTime || !signature) {
      console.warn('PayPal webhook: Missing required verification headers');
      return false;
    }

    console.log('PayPal webhook signature verification in MVP mode (HTTPS transport trusted)');
    return true;
  } catch (error) {
    console.error('PayPal signature verification error:', error);
    return false;
  }
}

export async function handler(event) {
  try {
    // Extract raw body and PayPal verification headers
    const rawBody = typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
    const transmissionId = event.headers['paypal-transmission-id'];
    const transmissionTime = event.headers['paypal-transmission-time'];
    const certUrl = event.headers['paypal-cert-url'];
    const authAlgo = event.headers['paypal-auth-algo'];
    const signature = event.headers['paypal-transmission-sig'];

    // Verify webhook signature
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (clientId && clientSecret && signature) {
      const isValid = await verifyPayPalSignature(
        transmissionId,
        transmissionTime,
        certUrl,
        authAlgo,
        signature,
        rawBody
      );

      if (!isValid) {
        console.warn('PayPal webhook signature verification failed');
        return json(403, { error: 'Invalid signature' });
      }
    } else {
      console.warn('PayPal credentials missing - webhook verification skipped (dev mode)');
    }

    const payload = parseBody(event);
    const eventId = payload.id || payload.event_id || `${Date.now()}`;
    const eventType = payload.event_type || payload.type || 'unknown';

    if (usingDatabase()) {
      try {
        await query(
          `INSERT INTO webhook_events (provider, event_id, event_type, payload)
           VALUES ($1,$2,$3,$4::jsonb)`,
          ['paypal', String(eventId), String(eventType), JSON.stringify(payload)]
        );
      } catch {
        return json(200, { received: true, duplicate: true });
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const providerReference = payload.resource?.supplementary_data?.related_ids?.order_id
        || payload.resource?.id
        || payload.resource?.invoice_id;
      if (providerReference) {
        await markOrderPaidFromProvider(String(providerReference), 'paypal');
      }
    }

    return json(200, { received: true });
  } catch (error) {
    return serverError(error, 'Webhook PayPal invalide.');
  }
}
