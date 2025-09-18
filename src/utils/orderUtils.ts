import { Order, CustomerInfo, OrderItem } from '../types/Order';

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CMD-${timestamp}-${random}`.toUpperCase();
};

export const calculateShipping = (method: string): number => {
  const shippingRates = {
    colissimo: 6.90,
    mondialRelay: 4.90,
    chronopost: 12.90
  };
  return shippingRates[method as keyof typeof shippingRates] || 0;
};

export const formatOrderForEmail = (order: Order): string => {
  const itemsList = order.items.map(item => 
    `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`
  ).join('\n');

  return `
NOUVELLE COMMANDE - ${order.id}

=== INFORMATIONS CLIENT ===
Nom: ${order.customerInfo.firstName} ${order.customerInfo.lastName}
Email: ${order.customerInfo.email}
Téléphone: ${order.customerInfo.phone}

=== ADRESSE DE LIVRAISON ===
${order.customerInfo.address}
${order.customerInfo.postalCode} ${order.customerInfo.city}
${order.customerInfo.country}

=== MODE DE LIVRAISON ===
${order.customerInfo.shippingMethod.toUpperCase()}
${order.customerInfo.relayPoint ? `Point relais: ${order.customerInfo.relayPoint}` : ''}

=== PRODUITS COMMANDÉS ===
${itemsList}

=== TOTAUX ===
Sous-total: ${order.subtotal.toFixed(2)}€
Livraison: ${order.shipping.toFixed(2)}€
TOTAL: ${order.total.toFixed(2)}€

=== NOTES ===
${order.notes || 'Aucune note'}

Date de commande: ${new Date(order.orderDate).toLocaleString('fr-FR')}
  `.trim();
};

export const validateOrderData = (customerInfo: CustomerInfo, items: OrderItem[]): string[] => {
  const errors: string[] = [];

  // Validation des informations client
  if (!customerInfo.firstName.trim()) errors.push('Le prénom est requis');
  if (!customerInfo.lastName.trim()) errors.push('Le nom est requis');
  if (!customerInfo.email.trim()) errors.push('L\'email est requis');
  if (!customerInfo.phone.trim()) errors.push('Le téléphone est requis');
  if (!customerInfo.address.trim()) errors.push('L\'adresse est requise');
  if (!customerInfo.city.trim()) errors.push('La ville est requise');
  if (!customerInfo.postalCode.trim()) errors.push('Le code postal est requis');

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
    errors.push('L\'email n\'est pas valide');
  }

  // Validation code postal français
  const postalCodeRegex = /^[0-9]{5}$/;
  if (customerInfo.postalCode && !postalCodeRegex.test(customerInfo.postalCode)) {
    errors.push('Le code postal doit contenir 5 chiffres');
  }

  // Validation des articles
  if (items.length === 0) errors.push('Le panier est vide');

  return errors;
};
