import { defaultShippingOptions, storeProducts } from '../data/store';
import type {
  AdminOrderSummary,
  CheckoutPayload,
  CheckoutResponse,
  PickupPoint,
  Product,
  ShippingMethodCode,
  ShippingOption,
  TrackedOrder
} from '../types/shop';

const FUNCTIONS_BASE_URL = '/.netlify/functions';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({ message: 'Reponse serveur invalide.' }));

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Une erreur serveur est survenue.';
    throw new Error(message);
  }

  return payload as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init
  });

  return parseResponse<T>(response);
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await request<{ products: Product[] }>('products');
    return data.products;
  } catch {
    return storeProducts;
  }
}

export async function fetchShippingOptions(country: string, postalCode: string, items: CheckoutPayload['items']) {
  try {
    const data = await request<{ shippingOptions: ShippingOption[] }>('shipping-options', {
      method: 'POST',
      body: JSON.stringify({ country, postalCode, items })
    });
    return data.shippingOptions;
  } catch {
    return defaultShippingOptions;
  }
}

export async function fetchPickupPoints(
  postalCode: string,
  country = 'FR',
  address = '',
  limit = 15,
): Promise<PickupPoint[]> {
  const params = new URLSearchParams({
    carrier: 'mondialrelay',
    postalCode,
    country,
    address,
    limit: String(limit),
  });
  const data = await request<{ pickupPoints: PickupPoint[] }>(`pickup-points?${params.toString()}`);
  return data.pickupPoints;
}

export async function createStripeCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('create-stripe-session', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function createPayPalCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('create-paypal-order', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function trackOrder(orderNumber: string, email: string): Promise<TrackedOrder> {
  const params = new URLSearchParams({ orderNumber, email });
  return request<TrackedOrder>(`track-order?${params.toString()}`);
}

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  return request<{ token: string }>('admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function fetchAdminOrders(token: string, filters: Partial<{ status: string; paymentStatus: string; shippingMethodCode: ShippingMethodCode; }>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const data = await request<{ orders: AdminOrderSummary[] }>(`admin-orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data.orders;
}

export async function updateAdminOrderStatus(token: string, orderNumber: string, status: string) {
  return request<{ order: AdminOrderSummary }>('admin-order-status', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderNumber, status })
  });
}

export interface AdminStockItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
}

export async function fetchAdminStock(token: string): Promise<AdminStockItem[]> {
  const data = await request<{ products: AdminStockItem[] }>('admin-stock', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data.products;
}

export async function updateAdminStock(token: string, productId: string, stock: number) {
  return request<{ product: AdminStockItem }>('admin-stock', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, stock })
  });
}

export async function setOrderTracking(
  token: string,
  orderNumber: string,
  trackingNumber: string,
  shippingMethodCode: string
) {
  return request<{ orderNumber: string; trackingNumber: string; trackingUrl?: string }>('admin-tracking', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderNumber, trackingNumber, shippingMethodCode })
  });
}