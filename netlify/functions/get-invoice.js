import { getOrderSummary } from './_lib/orders.js';
import { generateInvoicePdf } from './_lib/invoice.js';
import { getQuery, serverError, unauthorized } from './_lib/http.js';
import { readBearerToken, verifyAdminToken } from './_lib/auth.js';

export async function handler(event) {
  try {
    const token = readBearerToken(event);
    if (!token) {
      return unauthorized();
    }

    verifyAdminToken(token);

    const query = getQuery(event);
    const orderNumber = (query.orderNumber || '').trim();
    if (!orderNumber) {
      return { statusCode: 400, body: JSON.stringify({ message: 'orderNumber requis.' }) };
    }

    const order = await getOrderSummary(orderNumber);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Commande introuvable.' }) };
    }

    const pdfBase64 = await generateInvoicePdf(order);
    const filename = `facture-${order.invoiceNumber || order.orderNumber}.pdf`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      body: pdfBase64,
      isBase64Encoded: true
    };
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('jwt')) {
      return unauthorized('Session admin invalide.');
    }
    return serverError(error, 'Impossible de générer la facture.');
  }
}
