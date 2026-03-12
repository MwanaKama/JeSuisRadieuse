import { parseBody, ok, serverError, unauthorized, badRequest } from './_lib/http.js';
import { readBearerToken, verifyAdminToken } from './_lib/auth.js';
import { updateOrderStatus } from './_lib/orders.js';

export async function handler(event) {
  try {
    if (event.httpMethod !== 'PATCH') {
      return badRequest('Methode non autorisee.');
    }

    const token = readBearerToken(event);
    if (!token) {
      return unauthorized();
    }

    const decoded = verifyAdminToken(token);
    const body = parseBody(event);

    const orderNumber = (body.orderNumber || '').trim();
    const status = (body.status || '').trim();

    if (!orderNumber || !status) {
      return badRequest('orderNumber et status sont requis.');
    }

    const order = await updateOrderStatus(orderNumber, status, `admin:${decoded.sub}`);
    return ok({ order });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('jwt')) {
      return unauthorized('Session admin invalide.');
    }
    if (String(error.message || '').includes('invalide') || String(error.message || '').includes('introuvable')) {
      return badRequest(error.message);
    }
    return serverError(error, 'Impossible de mettre a jour cette commande.');
  }
}
