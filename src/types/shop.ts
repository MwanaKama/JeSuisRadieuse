export type ShippingMethodCode = 'colissimo_home' | 'mondialrelay_point' | 'chronopost_express';
export type PaymentMethodCode = 'stripe' | 'paypal';
export type OrderStatusCode = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  available: boolean;
  benefits: string[];
  usageInstructions: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingOption {
  code: ShippingMethodCode;
  carrier: 'colissimo' | 'mondialrelay' | 'chronopost';
  label: string;
  description: string;
  price: number;
  eta: string;
  requiresPickupPoint: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface MondialRelayPoint extends PickupPoint {
  latitude?: number;
  longitude?: number;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface CheckoutPayload {
  items: Array<{ productId: string; quantity: number }>;
  customer: CheckoutCustomer;
  shippingMethodCode: ShippingMethodCode;
  pickupPointId?: string;
  pickupPointLabel?: string;
  paymentMethod: PaymentMethodCode;
}

export interface CheckoutResponse {
  orderNumber: string;
  checkoutUrl?: string;
  providerReference?: string;
}

export interface TrackedOrder {
  orderNumber: string;
  customerEmail: string;
  status: OrderStatusCode;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  shippingMethodCode: ShippingMethodCode;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderSummary {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentMethod: PaymentMethodCode;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatusCode;
  shippingMethodCode: ShippingMethodCode;
  trackingNumber?: string;
  trackingUrl?: string;
  invoiceNumber?: string;
  createdAt: string;
}

export interface OrderSummaryItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatusCode;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethodCode: ShippingMethodCode;
  trackingNumber?: string;
  trackingUrl?: string;
  invoiceNumber?: string;
  createdAt: string;
  items: OrderSummaryItem[];
}