import { json, parseBody, serverError } from './_lib/http.js';
import { query, usingDatabase } from './_lib/db.js';

function mapStatus(externalStatus) {
  const status = String(externalStatus || '').toLowerCase();
  if (['in_transit', 'out_for_delivery', 'shipped'].includes(status)) return 'shipped';
  if (['delivered', 'final_delivered'].includes(status)) return 'delivered';
  return null;
}

export async function handler(event) {
  try {
    if (!usingDatabase()) {
      return json(200, { received: true, skipped: true });
    }

    const body = parseBody(event);
    const eventId = body.id || body.eventId || `${Date.now()}`;
    const eventType = body.type || body.eventType || 'shipment.updated';

    try {
      await query(
        `INSERT INTO webhook_events (provider, event_id, event_type, payload)
         VALUES ($1,$2,$3,$4::jsonb)`,
        ['shipping', String(eventId), String(eventType), JSON.stringify(body)]
      );
    } catch {
      return json(200, { received: true, duplicate: true });
    }

    const orderNumber = body.orderNumber || body.order_number;
    const trackingNumber = body.trackingNumber || body.tracking_number;
    const trackingUrl = body.trackingUrl || body.tracking_url;
    const mappedStatus = mapStatus(body.status || body.eventCode);

    if (!orderNumber || !mappedStatus) {
      return json(200, { received: true, ignored: true });
    }

    await query(
      `UPDATE orders
       SET order_status = $1,
           tracking_number = COALESCE($2, tracking_number),
           tracking_url = COALESCE($3, tracking_url),
           updated_at = NOW()
       WHERE order_number = $4`,
      [mappedStatus, trackingNumber || null, trackingUrl || null, orderNumber]
    );

    return json(200, { received: true, status: mappedStatus });
  } catch (error) {
    return serverError(error, 'Webhook livraison invalide.');
  }
}
