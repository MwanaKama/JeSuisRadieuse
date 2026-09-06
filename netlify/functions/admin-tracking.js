import { buildTrackingUrl, setOrderTracking } from './_lib/orders.js';
import { badRequest, ok, parseBody, serverError, unauthorized } from './_lib/http.js';
import { readBearerToken, verifyAdminToken } from './_lib/auth.js';

function carrierFromMethod(shippingMethodCode) {
  if (String(shippingMethodCode || '').startsWith('colissimo')) return 'colissimo';
  if (String(shippingMethodCode || '').startsWith('mondialrelay')) return 'mondialrelay';
  if (String(shippingMethodCode || '').startsWith('chronopost')) return 'chronopost';
  return 'colissimo';
}

export async function handler(event) {
  try {
    if (event.httpMethod !== 'PATCH') {
      return badRequest('Methode non autorisee.');
    }

    const token = readBearerToken(event);
    if (!token) {
      return unauthorized();
    }

    verifyAdminToken(token);

    const body = parseBody(event);
    const orderNumber = (body.orderNumber || '').trim();
    const trackingNumber = (body.trackingNumber || '').trim();
    const carrier = body.carrier || carrierFromMethod(body.shippingMethodCode);

    if (!orderNumber || !trackingNumber) {
      return badRequest('orderNumber et trackingNumber sont requis.');
    }

    const trackingUrl = body.trackingUrl || buildTrackingUrl(carrier, trackingNumber) || null;
    await setOrderTracking(orderNumber, trackingNumber, trackingUrl);

    return ok({ orderNumber, trackingNumber, trackingUrl });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('jwt')) {
      return unauthorized('Session admin invalide.');
    }
    if (
      String(error.message || '').includes('introuvable') ||
      String(error.message || '').includes('necessite')
    ) {
      return badRequest(error.message);
    }
    return serverError(error, 'Impossible de mettre a jour le suivi.');
  }
}
