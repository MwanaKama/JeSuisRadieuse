import { getOrderForTracking } from './_lib/orders.js';
import { badRequest, getQuery, ok, serverError } from './_lib/http.js';

export async function handler(event) {
  try {
    const query = getQuery(event);
    const orderNumber = (query.orderNumber || '').trim();
    const email = (query.email || '').trim();

    if (!orderNumber || !email) {
      return badRequest('Numero de commande et email requis.');
    }

    const order = await getOrderForTracking(orderNumber, email);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Commande introuvable.' }) };
    }

    return ok(order);
  } catch (error) {
    return serverError(error, 'Impossible de recuperer cette commande.');
  }
}
