import { getStockList, updateStock } from './_lib/orders.js';
import { badRequest, ok, parseBody, serverError, unauthorized } from './_lib/http.js';
import { readBearerToken, verifyAdminToken } from './_lib/auth.js';

export async function handler(event) {
  try {
    const token = readBearerToken(event);
    if (!token) {
      return unauthorized();
    }

    verifyAdminToken(token);

    if (event.httpMethod === 'GET') {
      const products = await getStockList();
      return ok({ products });
    }

    if (event.httpMethod === 'PATCH') {
      const body = parseBody(event);
      const productId = (body.productId || '').trim();
      const stock = body.stock;

      if (!productId || stock === undefined || stock === null) {
        return badRequest('productId et stock sont requis.');
      }

      const product = await updateStock(productId, stock);
      return ok({ product });
    }

    return badRequest('Methode non autorisee.');
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('jwt')) {
      return unauthorized('Session admin invalide.');
    }
    if (
      String(error.message || '').includes('invalide') ||
      String(error.message || '').includes('introuvable') ||
      String(error.message || '').includes('necessite')
    ) {
      return badRequest(error.message);
    }
    return serverError(error, 'Impossible de mettre a jour le stock.');
  }
}
