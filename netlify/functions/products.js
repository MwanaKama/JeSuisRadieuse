import { getProducts } from './_lib/orders.js';
import { ok, serverError } from './_lib/http.js';

export async function handler() {
  try {
    const products = await getProducts();
    return ok({ products });
  } catch (error) {
    return serverError(error, 'Impossible de charger le catalogue.');
  }
}
