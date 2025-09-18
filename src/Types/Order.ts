export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  ingredients: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: 'colissimo' | 'mondialRelay' | 'chronopost';
  relayPoint?: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  paymentMethod: 'bank_transfer';
  notes?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}
