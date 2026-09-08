import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function sellerName() {
  return process.env.SELLER_NAME || 'Je Suis Radieuse';
}

function sellerAddress() {
  return process.env.SELLER_ADDRESS || 'Paris & Région Parisienne';
}

function sellerEmail() {
  return process.env.SELLER_EMAIL || 'mamanradieuse@gmail.com';
}

function sellerSiret() {
  return process.env.SELLER_SIRET || '';
}

function tvaNote() {
  return process.env.TVA_NOTE || 'TVA non applicable — art. 293 B du CGI';
}

function money(euros) {
  return `${Number(euros).toFixed(2).replace('.', ',')} €`;
}

function safe(text) {
  // WinAnsi (Helvetica standard) supporte le latin-1 : on remplace les rares caractères hors plage.
  return String(text ?? '')
    .replace(/’/g, "'")
    .replace(/…/g, '...')
    .replace(/—/g, '-');
}

export async function generateInvoicePdf(order) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PURPLE = rgb(0.49, 0.23, 0.93);
  const DARK = rgb(0.12, 0.12, 0.2);
  const GRAY = rgb(0.42, 0.42, 0.46);

  let y = height - 50;

  function line(text, x, size, f = font, color = DARK, dy = 14) {
    page.drawText(safe(text), { x, y, size, font: f, color });
    y -= dy;
  }

  // En-tête
  page.drawText('FACTURE', { x: 50, y, size: 26, font: bold, color: PURPLE });
  y -= 34;

  const dateStr = new Date().toLocaleDateString('fr-FR');
  line(`N° ${order.invoiceNumber || order.orderNumber}`, 50, 12, bold, DARK);
  line(`Référence commande : ${order.orderNumber}`, 50, 9, font, GRAY, 13);
  line(`Date d'émission : ${dateStr}`, 50, 10, font, GRAY);
  y -= 14;

  // Vendeur
  line('VENDEUR', 50, 9, bold, GRAY);
  line(sellerName(), 50, 12, bold, DARK);
  line(sellerAddress(), 50, 10, font, DARK, 13);
  if (sellerSiret()) {
    line(`SIRET : ${sellerSiret()}`, 50, 10, font, DARK, 13);
  }
  line(sellerEmail(), 50, 10, font, DARK, 13);
  line(tvaNote(), 50, 8, font, GRAY, 13);
  y -= 16;

  // Client
  line('FACTURÉ À', 50, 9, bold, GRAY);
  line(order.customerName || '', 50, 12, bold, DARK);
  line(order.address || '', 50, 10, font, DARK, 13);
  line(`${order.postalCode || ''} ${order.city || ''}`.trim(), 50, 10, font, DARK, 13);
  line(order.customerEmail || '', 50, 10, font, DARK, 13);
  y -= 16;

  // Tableau
  const cols = { desc: 50, qty: 320, pu: 385, total: 465 };
  page.drawText('Désignation', { x: cols.desc, y, size: 9, font: bold, color: GRAY });
  page.drawText('Qté', { x: cols.qty, y, size: 9, font: bold, color: GRAY });
  page.drawText('Prix unitaire', { x: cols.pu, y, size: 9, font: bold, color: GRAY });
  page.drawText('Total HT', { x: cols.total, y, size: 9, font: bold, color: GRAY });
  y -= 6;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.6, color: GRAY });
  y -= 16;

  for (const item of order.items || []) {
    page.drawText(safe(item.name), { x: cols.desc, y, size: 9, font, color: DARK });
    page.drawText(String(item.quantity), { x: cols.qty, y, size: 9, font, color: DARK });
    page.drawText(money(item.price), { x: cols.pu, y, size: 9, font, color: DARK });
    page.drawText(money(item.price * item.quantity), { x: cols.total, y, size: 9, font, color: DARK });
    y -= 15;
  }

  y -= 8;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.6, color: GRAY });
  y -= 20;

  // Totaux
  const labelX = 330;
  const valX = 465;
  line('Sous-total HT', labelX, 10, font, DARK);
  page.drawText(money(order.subtotal), { x: valX, y: y + 14, size: 10, font, color: DARK });
  line('Livraison', labelX, 10, font, DARK);
  page.drawText(money(order.shipping), { x: valX, y: y + 14, size: 10, font, color: DARK });
  line('TVA', labelX, 10, font, DARK);
  page.drawText('0,00 €', { x: valX, y: y + 14, size: 10, font, color: DARK });
  y -= 4;
  page.drawText('Total TTC', { x: labelX, y, size: 13, font: bold, color: PURPLE });
  page.drawText(money(order.total), { x: valX, y, size: 13, font: bold, color: PURPLE });
  y -= 26;

  page.drawText('Merci pour votre confiance — Je Suis Radieuse', {
    x: 50,
    y: 60,
    size: 9,
    font,
    color: GRAY
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}
