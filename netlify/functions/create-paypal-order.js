import { createOrder } from './_lib/orders.js';
import { badRequest, ok, parseBody, serverError } from './_lib/http.js';

function validatePayload(payload) {
  if (!payload?.customer?.email || !payload?.customer?.firstName || !payload?.customer?.lastName) {
    return 'Informations client incompletes.';
  }
  if (!Array.isArray(payload?.items) || payload.items.length === 0) {
    return 'Le panier est vide.';
  }
  if (!payload?.shippingMethodCode) {
    return 'Mode de livraison requis.';
  }
  return null;
}

export async function handler(event) {
  try {
    const payload = parseBody(event);
    const validationError = validatePayload(payload);
    if (validationError) {
      return badRequest(validationError);
    }

    const providerReference = `paypal_${Date.now()}`;
    const order = await createOrder(payload, providerReference);

    const origin = process.env.PUBLIC_SITE_URL || process.env.URL || 'http://localhost:8888';
    const checkoutUrl = `${origin}/commande/confirmation?order=${encodeURIComponent(order.orderNumber)}`;

    return ok({
      orderNumber: order.orderNumber,
      checkoutUrl,
      providerReference
    });
  } catch (error) {
    return serverError(error, 'Impossible de creer la commande PayPal.');
  }
}
