import { getStockList, updateProductAvailability, updateProductPrice, updateStock } from './_lib/orders.js';
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

      if (!productId) {
        return badRequest('productId est requis.');
      }

      let product;
      if (body.available !== undefined && body.available !== null) {
        product = await updateProductAvailability(productId, body.available);
      } else if (body.price !== undefined && body.price !== null) {
        // Le prix est envoyé en euros (ex: 15.9) et converti en centimes.
        product = await updateProductPrice(productId, Math.round(Number(body.price) * 100));
      } else if (body.stock !== undefined && body.stock !== null) {
        product = await updateStock(productId, body.stock);
      } else {
        return badRequest('stock, price ou available est requis.');
      }

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
