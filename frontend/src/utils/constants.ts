/**
 * Application Constants
 */

export const APP_NAME = 'Amazon Clone';
export const APP_VERSION = '1.0.0';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    
    // Local development
    if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
      return 'http://localhost:5000/api';
    }
    
    // Render deployment - use the backend Render URL
    if (currentOrigin.includes('onrender.com')) {
      // Extract the app name from the frontend URL and construct backend URL
      const appName = currentOrigin.split('//')[1].split('.')[0];
      return `https://${appName}-backend.onrender.com/api`;
    }
    
    // Default to same-origin API
    return `${currentOrigin}/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_URL = getApiBaseUrl();
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
