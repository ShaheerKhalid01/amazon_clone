/**
 * Application Constants
 */

export const APP_NAME = 'Amazon Clone';
export const APP_VERSION = '1.0.0';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const IMAGE_PLACEHOLDER = '/placeholder.png';

export const ITEMS_PER_PAGE = 20;
export const MAX_CART_ITEMS = 50;
export const FREE_SHIPPING_THRESHOLD = 25;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  NET_BANKING: 'Net Banking',
  UPI: 'UPI',
  COD: 'Cash on Delivery',
} as const;
