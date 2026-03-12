import { getShippingFallback } from './_lib/orders.js';
import { badRequest, ok, parseBody, serverError } from './_lib/http.js';

export async function handler(event) {
  try {
    const body = parseBody(event);

    if (!body.country || !body.postalCode) {
      return badRequest('Pays et code postal requis.');
    }

    const shippingOptions = getShippingFallback();
    return ok({ shippingOptions });
  } catch (error) {
    return serverError(error, 'Impossible de calculer les frais de livraison.');
  }
}
