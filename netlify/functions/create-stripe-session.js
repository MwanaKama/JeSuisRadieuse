import { createOrder, getStripeClient } from './_lib/orders.js';
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

function buildUrls(orderNumber) {
  const origin = process.env.PUBLIC_SITE_URL || process.env.URL || 'http://localhost:8888';
  return {
    successUrl: `${origin}/commande/confirmation?order=${encodeURIComponent(orderNumber)}`,
    cancelUrl: `${origin}/commande/annulee?order=${encodeURIComponent(orderNumber)}`
  };
}

export async function handler(event) {
  try {
    const payload = parseBody(event);
    const validationError = validatePayload(payload);
    if (validationError) {
      return badRequest(validationError);
    }

    const providerReference = `stripe_${Date.now()}`;
    const order = await createOrder(payload, providerReference);

    const stripe = getStripeClient();
    if (!stripe) {
      const urls = buildUrls(order.orderNumber);
      return ok({
        orderNumber: order.orderNumber,
        checkoutUrl: urls.successUrl,
        providerReference
      });
    }

    const urls = buildUrls(order.orderNumber);

    const lineItems = (order.items || []).map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: item.unitPriceCents,
        product_data: { name: item.name }
      }
    }));

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(order.shipping * 100),
        product_data: { name: 'Livraison' }
      }
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: payload.customer.email,
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
      metadata: {
        orderNumber: order.orderNumber,
        providerReference
      },
      line_items: lineItems
    });

    return ok({
      orderNumber: order.orderNumber,
      checkoutUrl: session.url,
      providerReference: session.id
    });
  } catch (error) {
    return serverError(error, 'Impossible de creer la session Stripe.');
  }
}
