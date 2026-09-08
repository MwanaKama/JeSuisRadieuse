import { generateInvoicePdf } from './invoice.js';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const BRAND_NAME = 'Je Suis Radieuse';

function senderEmail() {
  return process.env.FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'mamanradieuse@gmail.com';
}

function adminEmail() {
  return process.env.NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || 'mamanradieuse@gmail.com';
}

function hasEmailConfig() {
  return Boolean(process.env.BREVO_API_KEY);
}

async function sendMail({ to, subject, html, attachments }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[email] BREVO_API_KEY manquant — email ignoré.');
    return false;
  }

  const payload = {
    sender: { name: BRAND_NAME, email: senderEmail() },
    to: [{ email: to }],
    subject,
    htmlContent: html
  };

  if (Array.isArray(attachments) && attachments.length > 0) {
    payload.attachment = attachments;
  }

  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo ${res.status}: ${text.slice(0, 300)}`);
  }
  return true;
}

// N'échoue jamais : les emails ne doivent pas casser le tunnel de commande.
async function safeSend(opts) {
  if (!hasEmailConfig()) {
    return false;
  }
  try {
    await sendMail(opts);
    return true;
  } catch (error) {
    console.error('[email] envoi échoué:', error.message);
    return false;
  }
}

function money(euros) {
  return `${Number(euros).toFixed(2).replace('.', ',')} €`;
}

function layout(title, bodyHtml) {
  return `
  <div style="background:#faf5ff;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ede9fe">
      <div style="background:linear-gradient(90deg,#7c3aed,#ec4899);padding:26px;text-align:center">
        <div style="color:#ffffff;font-size:22px;font-weight:bold">${BRAND_NAME}</div>
        <div style="color:#f5d0fe;font-size:13px;margin-top:6px">${title}</div>
      </div>
      <div style="padding:26px;font-size:15px;line-height:1.6">${bodyHtml}</div>
      <div style="padding:16px 24px;background:#faf5ff;font-size:12px;color:#6b7280;text-align:center">
        Tisanes artisanales &amp; accompagnement bienveillant — <a href="https://jesuisradieuse.com" style="color:#7c3aed">jesuisradieuse.com</a>
      </div>
    </div>
  </div>`;
}

function itemsTable(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  const rows = items
    .map((item) => {
      const unit = item.unitPriceCents != null ? item.unitPriceCents / 100 : item.price || 0;
      return `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f3f0ff">${item.name} × ${item.quantity}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f3f0ff;text-align:right;white-space:nowrap">${money(unit * item.quantity)}</td>
      </tr>`;
    })
    .join('');
  return `<table style="width:100%;border-collapse:collapse;margin:14px 0">${rows}</table>`;
}

function customerFullName(customer) {
  if (!customer) {
    return '';
  }
  return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
}

// 1) Commande reçue (client) + notification admin
export async function notifyOrderCreated(order, customer) {
  const name = customerFullName(customer);
  const customerHtml = layout('Commande reçue', `
    <p>Bonjour ${name},</p>
    <p>Merci pour votre commande <strong>${order.orderNumber}</strong>.</p>
    ${itemsTable(order.items)}
    <p style="margin:6px 0">
      <strong>Total :</strong> ${money(order.total)}
      <span style="color:#9ca3af">(dont livraison ${money(order.shipping || 0)})</span>
    </p>
    <p>Nous vous confirmons la réception de votre commande. Un second email vous sera envoyé dès que votre paiement sera validé.</p>
    <p>Vous pouvez suivre votre commande à tout moment sur <a href="https://jesuisradieuse.com/suivi-commande" style="color:#7c3aed">notre page de suivi</a>.</p>
  `);

  const adminHtml = layout('Nouvelle commande', `
    <p>Une nouvelle commande vient d'être passée :</p>
    <p><strong>Commande :</strong> ${order.orderNumber}</p>
    <p><strong>Client :</strong> ${name} (${customer?.email || ''})</p>
    ${itemsTable(order.items)}
    <p><strong>Total :</strong> ${money(order.total)}</p>
  `);

  await safeSend({ to: customer.email, subject: `Votre commande ${order.orderNumber} est bien reçue`, html: customerHtml });
  await safeSend({ to: adminEmail(), subject: `🛒 Nouvelle commande ${order.orderNumber}`, html: adminHtml });
}

// 2) Paiement confirmé (client) — avec facture PDF en pièce jointe
export async function notifyPaymentConfirmed(order) {
  const orderNumber = order?.orderNumber;
  const customerEmail = order?.customerEmail;
  const customerName = order?.customerName;

  if (!orderNumber || !customerEmail) {
    return;
  }

  const html = layout('Paiement confirmé', `
    <p>Bonjour ${customerName || ''},</p>
    <p>Votre paiement pour la commande <strong>${orderNumber}</strong> a bien été confirmé.</p>
    <p>Votre facture est jointe à cet email (PDF).</p>
    <p>Nous préparons maintenant votre colis avec soin. Vous recevrez un email avec le numéro de suivi dès son expédition.</p>
  `);

  // Génère la facture PDF et l'attache à l'email.
  let attachments = [];
  try {
    const pdfBase64 = await generateInvoicePdf(order);
    attachments = [{ content: pdfBase64, name: `facture-${orderNumber}.pdf` }];
  } catch (error) {
    console.error('[email] génération facture échouée:', error.message);
  }

  await safeSend({
    to: customerEmail,
    subject: `Paiement confirmé — commande ${orderNumber}`,
    html,
    attachments
  });
}

// 3) Commande expédiée (client)
export async function notifyShipped(orderNumber, customerEmail, customerName, trackingNumber, trackingUrl) {
  const trackingBlock = trackingNumber
    ? `<p style="background:#f5f3ff;padding:14px;border-radius:10px;margin:14px 0">
         <strong>Numéro de suivi :</strong> ${trackingNumber}<br/>
         ${trackingUrl ? `<a href="${trackingUrl}" style="color:#7c3aed">Suivre mon colis en ligne →</a>` : ''}
       </p>`
    : `<p>Votre numéro de suivi vous sera communiqué très prochainement.</p>`;

  const html = layout('Commande expédiée', `
    <p>Bonjour ${customerName || ''},</p>
    <p>Bonne nouvelle ! Votre commande <strong>${orderNumber}</strong> a été expédiée.</p>
    ${trackingBlock}
  `);
  await safeSend({ to: customerEmail, subject: `Votre commande ${orderNumber} a été expédiée`, html });
}

// 4) Commande livrée (client)
export async function notifyDelivered(orderNumber, customerEmail, customerName) {
  const html = layout('Commande livrée', `
    <p>Bonjour ${customerName || ''},</p>
    <p>Votre commande <strong>${orderNumber}</strong> a été livrée. Nous espérons qu'elle vous apportera tout le bien-être attendu 🌿</p>
    <p>Merci de votre confiance, et à très bientôt.</p>
  `);
  await safeSend({ to: customerEmail, subject: `Votre commande ${orderNumber} a été livrée`, html });
}

// 5) Numéro de suivi ajouté (client)
export async function notifyTrackingAvailable(orderNumber, customerEmail, customerName, trackingNumber, trackingUrl) {
  const html = layout('Suivi de votre colis', `
    <p>Bonjour ${customerName || ''},</p>
    <p>Le suivi de votre commande <strong>${orderNumber}</strong> est maintenant disponible :</p>
    <p style="background:#f5f3ff;padding:14px;border-radius:10px;margin:14px 0">
      <strong>Numéro de suivi :</strong> ${trackingNumber || ''}<br/>
      ${trackingUrl ? `<a href="${trackingUrl}" style="color:#7c3aed">Suivre mon colis en ligne →</a>` : ''}
    </p>
  `);
  await safeSend({ to: customerEmail, subject: `Suivi disponible — commande ${orderNumber}`, html });
}

// 6) Alerte stock bas (admin)
export async function notifyLowStock(products) {
  const lowProducts = (products || []).filter((p) => p.stock <= Number(process.env.LOW_STOCK_THRESHOLD || 5));
  if (lowProducts.length === 0) {
    return;
  }

  const rows = lowProducts
    .map((p) => `<li>${p.name} — <strong>${p.stock} restant(s)</strong></li>`)
    .join('');

  const html = layout('Stock bas', `
    <p>Attention, les produits suivants ont un stock faible :</p>
    <ul style="padding-left:18px">${rows}</ul>
    <p>Pensez à réapprovisionner pour éviter les ruptures.</p>
  `);

  await safeSend({ to: adminEmail(), subject: `⚠️ Stock bas — ${lowProducts.length} produit(s)`, html });
}
