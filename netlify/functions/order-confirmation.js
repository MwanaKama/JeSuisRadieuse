import { getOrderSummary } from './_lib/orders.js';
import { badRequest, getQuery, ok, serverError } from './_lib/http.js';

export async function handler(event) {
  try {
    const query = getQuery(event);
    const orderNumber = (query.orderNumber || '').trim();

    if (!orderNumber) {
      return badRequest('Numero de commande requis.');
    }

    const order = await getOrderSummary(orderNumber);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Commande introuvable.' }) };
    }

    return ok({ order });
  } catch (error) {
    return serverError(error, 'Impossible de charger la commande.');
  }
}
