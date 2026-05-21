// Cart related types

import type { DeliveryEstimate, ProductImage } from './product.types';

export interface CartItem {
    id: string;
    productId: string;
    asin: string;
    title: string;
    brand: string;
    image: ProductImage;
    variant: {
      id: string;
      sku: string;
      options: { name: string; value: string }[];
    } | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isOnSale: boolean;
    originalPrice?: number;
    savings?: number;
    isGift: boolean;
    giftMessage?: string;
    inStock: boolean;
    maxQuantity: number;
    isPrimeEligible: boolean;
    shippingInfo: {
      freeShipping: boolean;
      estimatedDelivery: DeliveryEstimate;
      shippingCost?: number;
    };
    sellerId: string;
    sellerName: string;
    addedAt: string;
  }
  
  export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    totalSavings: number;
    totalItems: number;
    itemCount: number;
    isPrimeMember: boolean;
    giftWrapCost?: number;
    couponDiscount?: number;
    estimatedTax?: number;
    shippingCost?: number;
    total: number;
    updatedAt: string;
  }
  
  export interface AddToCartPayload {
    productId: string;
    variantId?: string;
    quantity: number;
    isGift?: boolean;
    giftMessage?: string;
  }
  
  export interface UpdateCartItemPayload {
    itemId: string;
    quantity?: number;
    isGift?: boolean;
    giftMessage?: string;
  }
