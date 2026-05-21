// Order related types for frontend

import type { Address } from './common.types';
import type { ProductCondition } from './product.types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'FAILED';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface OrderItem {
    productId: string;
    asin: string;
    title: string;
    variantInfo?: {
      options: { name: string; value: string }[];
      sku: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax: number;
    shippingCost: number;
    discount: number;
    isGift: boolean;
    giftMessage?: string;
    condition: ProductCondition;
    sellerId: string;
    sellerName: string;
    fulfillmentType: 'FBA' | 'FBM';
    returnEligible: boolean;
    image: string;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: {
      type: string;
      lastFourDigits?: string;
    };
    shippingAddress: Address;
    billingAddress: Address;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    giftWrapCost: number;
    total: number;
    currency: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery: string;
    actualDelivery?: string;
    cancellationReason?: string;
    returnEligible: boolean;
    notes?: string;
    isPrime: boolean;
    isGift: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OrderTracking {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    status: OrderStatus;
    estimatedDelivery: string;
    events: {
      date: string;
      status: string;
      location: string;
      description: string;
    }[];
    currentLocation?: string;
  }
  
  export interface ReturnRequest {
    id: string;
    orderId: string;
    itemId: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'REFUNDED';
    refundAmount: number;
    returnLabelUrl?: string;
    dropOffLocation?: string;
    createdAt: string;
    resolvedAt?: string;
  }
