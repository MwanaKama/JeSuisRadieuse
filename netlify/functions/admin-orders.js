import { listOrders } from './_lib/orders.js';
import { getQuery, ok, serverError, unauthorized } from './_lib/http.js';
import { readBearerToken, verifyAdminToken } from './_lib/auth.js';

export async function handler(event) {
  try {
    const token = readBearerToken(event);
    if (!token) {
      return unauthorized();
    }

    verifyAdminToken(token);

    const query = getQuery(event);
    const orders = await listOrders({
      status: query.status,
      paymentStatus: query.paymentStatus,
      shippingMethodCode: query.shippingMethodCode
    });

    return ok({ orders });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('jwt')) {
      return unauthorized('Session admin invalide.');
    }
    return serverError(error, 'Impossible de charger les commandes.');
  }
}
